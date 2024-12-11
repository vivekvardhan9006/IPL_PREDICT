from flask import Flask, request, jsonify
import tensorflow as tf
import pandas as pd
import pickle
import joblib
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="http://localhost:3000")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Dictionary to store models and their corresponding preprocessing objects
models = {}

# Load the models and preprocessing objects
try:
    # Load match winner prediction model (original)
    models['winner'] = {
        'model': load_model('model.h5'),
        'scaler': pickle.load(open('scaler.pkl', 'rb'))
    }
    
    # Load score prediction model (new)
    models['score'] = {
        'model': load_model('score_model.h5', custom_objects={'mse': MeanSquaredError()}),
        'feature_scaler': joblib.load('score_scaler.pkl'),
        'target_scaler': joblib.load('target_scaler.pkl'),
        'label_encoders': joblib.load('label_encoders.pkl')
    }
    
    logger.info("All models and preprocessing objects loaded successfully")
except Exception as e:
    logger.error(f"Error loading models or preprocessing objects: {str(e)}")
    raise

def validate_winner_prediction_input(data):
    """Validate input data for match winner prediction."""
    required_fields = ['team1', 'team2', 'venue', 'toss_winner', 'toss_decision']
    
    if not isinstance(data, dict):
        raise ValueError("Input must be a JSON object")
    
    # Convert all string values to strings if they aren't already
    for key in data:
        if data[key] is not None:
            data[key] = str(data[key])
    
    logger.info(f"Validating winner prediction input data: {data}")
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
    
    empty_fields = [field for field in required_fields if not data[field]]
    if empty_fields:
        raise ValueError(f"Empty values in fields: {', '.join(empty_fields)}")
    
    if data['toss_winner'] not in [data['team1'], data['team2']]:
        raise ValueError("Toss winner must be one of the playing teams")
    
    if data['toss_decision'].lower() not in ['bat', 'field']:
        raise ValueError("Toss decision must be either 'bat' or 'field'")

def validate_score_prediction_input(data):
    """Validate input data for score prediction."""
    required_fields = ['inning', 'batting_team', 'bowling_team', 'over', 
                      'cumulative_runs', 'cumulative_wickets', 'venue']
    
    if not isinstance(data, dict):
        raise ValueError("Input must be a JSON object")
    
    # Convert numeric strings to integers
    numeric_fields = ['inning', 'over', 'cumulative_runs', 'cumulative_wickets']
    for field in numeric_fields:
        if field in data and data[field] is not None:
            try:
                data[field] = int(data[field])
            except (ValueError, TypeError):
                raise ValueError(f"Field '{field}' must be a valid number")
    
    logger.info(f"Validating score prediction input data: {data}")
    
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
    
    # Validate numeric fields
    if not (1 <= data['inning'] <= 2):
        raise ValueError("Inning must be 1 or 2")
    
    if not (0 <= data['over'] <= 20):
        raise ValueError("Over must be between 0 and 20")
    
    if not (0 <= data['cumulative_wickets'] <= 10):
        raise ValueError("Cumulative wickets must be between 0 and 10")

def predict_winner(data):
    """Make match winner prediction."""
    model = models['winner']['model']
    scaler = models['winner']['scaler']
    
    input_data = pd.DataFrame({
        'venue': [data['venue']],
        'team1': [data['team1']],
        'team2': [data['team2']],
        'toss_winner': [data['toss_winner']],
        'toss_decision': [data['toss_decision'].lower()],
    })
    
    input_encoded = pd.get_dummies(input_data, columns=['venue', 'team1', 'team2', 'toss_winner', 'toss_decision'])
    input_encoded = input_encoded.reindex(columns=scaler.feature_names_in_, fill_value=0)
    input_scaled = scaler.transform(input_encoded)
    
    prediction = model.predict(input_scaled)
    predicted_class = prediction.argmax(axis=1)[0]
    prediction_confidence = float(prediction[0][predicted_class])
    
    return {
        "predicted_winner": data['team1'] if predicted_class == 0 else data['team2'],
        "confidence": round(prediction_confidence * 100, 2)
    }

def predict_score(data):
    """Make score prediction."""
    model = models['score']['model']
    feature_scaler = models['score']['feature_scaler']
    target_scaler = models['score']['target_scaler']
    label_encoders = models['score']['label_encoders']
    
    try:
        # Encode categorical variables
        batting_team_encoded = label_encoders['batting_team'].transform([data['batting_team']])[0]
        bowling_team_encoded = label_encoders['bowling_team'].transform([data['bowling_team']])[0]
        venue_encoded = label_encoders['venue'].transform([data['venue']])[0]
        
        # Prepare input features
        input_features = [[
            data['inning'],
            batting_team_encoded,
            bowling_team_encoded,
            data['over'],
            data['cumulative_runs'],
            data['cumulative_wickets'],
            venue_encoded
        ]]
        
        # Scale features
        input_scaled = feature_scaler.transform(input_features)
        
        # Make prediction
        predicted_score_scaled = model.predict(input_scaled)
        predicted_score = target_scaler.inverse_transform(predicted_score_scaled)[0][0]
        
        return {
            "predicted_score": int(predicted_score),
            "current_score": data['cumulative_runs'],
            "projected_runs": int(predicted_score - data['cumulative_runs'])
        }
    except Exception as e:
        logger.error(f"Error in score prediction: {str(e)}")
        raise ValueError(f"Error processing input data: {str(e)}")

@app.route('/', methods=['GET'])
def home():
    """Root endpoint to confirm API is running."""
    return jsonify({
        "status": "ok",
        "message": "Cricket prediction API is running",
        "available_endpoints": [
            "/predict [POST]",
            "/available_predictions [GET]"
        ]
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Handle prediction requests."""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        if not data:
            logger.error("No JSON data provided in the request")
            return jsonify({"error": "No input data provided"}), 400

        prediction_type = data.pop('prediction_type', None)
        if not prediction_type:
            # Try to determine prediction type from input fields
            if all(field in data for field in ['batting_team', 'bowling_team', 'over']):
                prediction_type = 'score'
            elif all(field in data for field in ['team1', 'team2', 'toss_winner']):
                prediction_type = 'winner'
            else:
                return jsonify({"error": "Could not determine prediction type from input"}), 400

        logger.info(f"Received {prediction_type} prediction request with data: {data}")
        
        try:
            if prediction_type == 'winner':
                validate_winner_prediction_input(data)
                result = predict_winner(data)
                result['prediction_type'] = 'match_winner'
            elif prediction_type == 'score':
                validate_score_prediction_input(data)
                result = predict_score(data)
                result['prediction_type'] = 'score'
            else:
                return jsonify({"error": f"Invalid prediction type: {prediction_type}"}), 400
            
            result['prediction_details'] = data
            logger.info(f"Prediction response: {result}")
            return jsonify(result)
            
        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            return jsonify({"error": str(e)}), 400
            
        except Exception as e:
            logger.error(f"Error in making prediction: {str(e)}")
            return jsonify({"error": "Error making prediction"}), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/available_predictions', methods=['GET'])
def get_available_predictions():
    """Endpoint to get available prediction types."""
    return jsonify({
        "available_predictions": {
            "winner": "Match winner prediction",
            "score": "Final score prediction"
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)