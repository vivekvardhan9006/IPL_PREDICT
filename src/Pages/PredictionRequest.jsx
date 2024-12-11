import React, { useState } from 'react';
import axios from 'axios';

const PredictionRequest = () => {
    const [formData, setFormData] = useState({
        team1: '',
        team2: '',
        venue: '',
        toss_winner: '',
        toss_decision: '',
    });
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error on each submission

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', formData);
            setPrediction(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error sending request');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="team1" placeholder="Team 1" value={formData.team1} onChange={handleChange} />
                <input type="text" name="team2" placeholder="Team 2" value={formData.team2} onChange={handleChange} />
                <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} />
                <input type="text" name="toss_winner" placeholder="Toss Winner" value={formData.toss_winner} onChange={handleChange} />
                <input type="text" name="toss_decision" placeholder="Toss Decision (bat/field)" value={formData.toss_decision} onChange={handleChange} />
                <button type="submit">Get Prediction</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {prediction && (
                <div>
                    <h2>Prediction Result</h2>
                    <p>Predicted Winner: {prediction.predicted_winner}</p>
                    <p>Confidence: {prediction.confidence.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default PredictionRequest;
