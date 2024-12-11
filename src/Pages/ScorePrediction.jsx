import React, { useState } from 'react';
import '../Styles/ScorePrediction.css';

const teams = [
  "Chennai Super Kings",
  "Delhi Capitals",
  "Gujarat Titans",
  "Kolkata Knight Riders",
  "Lucknow Super Giants",
  "Mumbai Indians",
  "Punjab Kings",
  "Rajasthan Royals",
  "Rising Pune Supergiant",
  "Royal Challengers Bangalore",
  "Sunrisers Hyderabad"
];

const venues = [
  "Arun Jaitley Stadium, Delhi",
  "Barabati Stadium, Cuttack",
  "Barsapara Cricket Stadium, Guwahati",
  "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
  "Brabourne Stadium, Mumbai",
  "Buffalo Park, East London",
  "De Beers Diamond Oval",
  "Dr. DY Patil Sports Academy, Mumbai",
  "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
  "Dubai International Cricket Stadium",
  "Eden Gardens, Kolkata",
  "Feroz Shah Kotla, Delhi",
  "Green Park, Kanpur",
  "Himachal Pradesh Cricket Association Stadium, Dharamsala",
  "Holkar Cricket Stadium",
  "JSCA International Stadium Complex",
  "Kingsmead, Durban",
  "M Chinnaswamy Stadium, Bengaluru",
  "MA Chidambaram Stadium, Chepauk, Chennai",
  "Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur",
  "Maharashtra Cricket Association Stadium, Pune",
  "Narendra Modi Stadium, Ahmedabad",
  "New Wanderers Stadium, Johannesburg",
  "Newlands, Cape Town",
  "OUTsurance Oval, Bloemfontein",
  "Punjab Cricket Association IS Bindra Stadium, Mohali, Chandigarh",
  "Rajiv Gandhi International Cricket Stadium, Uppal, Hyderabad",
  "Sardar Patel Stadium, Motera",
  "Saurashtra Cricket Association Stadium",
  "Sawai Mansingh Stadium, Jaipur",
  "Shaheed Veer Narayan Singh International Stadium",
  "Sharjah Cricket Stadium, Sharjah",
  "Sheikh Zayed Stadium",
  "St George's Park",
  "Subrata Roy Sahara Stadium",
  "SuperSport Park",
  "Vidarbha Cricket Association Stadium, Jamtha",
  "Wankhede Stadium, Mumbai"
];

const PredictForm = () => {
  const [formData, setFormData] = useState({
    inning: '',
    batting_team: '',
    bowling_team: '',
    over: '',
    cumulative_runs: '',
    cumulative_wickets: '',
    venue: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prediction_type: 'score'  // Explicitly specify prediction type
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Prediction failed");
      }

      setPrediction(result);
      console.log('Prediction Result:', result);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError(error.message || "An error occurred while predicting the score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-form-container">
      <h2 className="form-title">Score Prediction</h2>
      
      {/* Prediction Result Display */}
      {prediction && (
        <div className="prediction-result">
          <h3>Prediction Results</h3>
          <div className="result-details">
            <p>Predicted Final Score: <strong>{prediction.predicted_score}</strong></p>
            <p>Current Score: <strong>{prediction.current_score}</strong></p>
            <p>Projected Additional Runs: <strong>{prediction.projected_runs}</strong></p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="predict-form" onSubmit={handlePredict}>
        <div className="form-group">
          <label htmlFor="inning">Inning</label>
          <input
            type="number"
            id="inning"
            name="inning"
            min="1"
            max="2"
            value={formData.inning}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="batting_team">Batting Team</label>
          <select
            id="batting_team"
            name="batting_team"
            value={formData.batting_team}
            onChange={handleChange}
            required
          >
            <option value="">Select Batting Team</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bowling_team">Bowling Team</label>
          <select
            id="bowling_team"
            name="bowling_team"
            value={formData.bowling_team}
            onChange={handleChange}
            required
          >
            <option value="">Select Bowling Team</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="over">Over</label>
          <input
            type="number"
            id="over"
            name="over"
            min="0"
            max="20"
            value={formData.over}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cumulative_runs">Current Runs</label>
          <input
            type="number"
            id="cumulative_runs"
            name="cumulative_runs"
            min="0"
            value={formData.cumulative_runs}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cumulative_wickets">Current Wickets</label>
          <input
            type="number"
            id="cumulative_wickets"
            name="cumulative_wickets"
            min="0"
            max="10"
            value={formData.cumulative_wickets}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <select
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          >
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue} value={venue}>{venue}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="predict-button"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict Score'}
        </button>
      </form>
    </div>
  );
};

export default PredictForm;