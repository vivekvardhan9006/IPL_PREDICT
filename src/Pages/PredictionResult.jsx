import React from 'react';
import '../Styles/Predict3.css'; // Ensure to create or update the CSS file for styling

const PredictionResult = ({ prediction, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="prediction-loading">
        <div className="spinner"></div>
        <p>Analyzing match data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prediction-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!prediction) return null;

  const confidencePercentage = (prediction.confidence * 100).toFixed(2);
  const confidenceClass = confidencePercentage >= 75 ? 'high-confidence' : confidencePercentage >= 50 ? 'medium-confidence' : 'low-confidence';

  return (
    <div className="prediction-result">
      <div className="prediction-card">
        <h2>Match Prediction</h2>
        <div className="prediction-winner">
          <h3>Predicted Winner</h3>
          <p>{prediction.predicted_winner}</p>
        </div>
        <div className={`prediction-confidence ${confidenceClass}`}>
          <h3>Confidence</h3>
          <p>{confidencePercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
