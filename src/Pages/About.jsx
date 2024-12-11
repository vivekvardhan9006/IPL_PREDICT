import React from 'react';
import '../Styles/About.css'; // Assuming you'll create a corresponding CSS file

const About = () => {
  return (
    <div className="about-page">
      {/* Header Section */}
      <header className="about-header">
        <h1>Welcome to NEXT WICKET-AI</h1>
        <p>Your ultimate destination for accurate IPL match predictions.</p>
      </header>

      {/* Main Content Container */}
      <div className="about-content-container">
        {/* Introduction Section */}
        <section className="about-section">
          <h2>Introduction</h2>
          <p>
            At NEXT WICKET-AI, we are passionate about bringing the excitement of the Indian Premier League (IPL) 
            to fans worldwide with a unique twist. Our platform offers detailed, data-driven predictions for IPL 
            match outcomes, ensuring that fans can stay ahead of the game with expert insights and analytics.
          </p>
        </section>

        {/* Why Choose Us Section */}
        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <p>
            Our platform combines deep statistical analysis with machine learning and deep learning to provide 
            actionable insights. Here's why we stand out:
          </p>
          <ul className="standout-list">
            <li>State-of-the-art ML and DL models for high accuracy.</li>
            <li>Real-time updates during matches.</li>
            <li>Expertly trained on historical IPL data.</li>
          </ul>
        </section>

        {/* How Our Models Work Section */}
        <section className="about-section">
          <h2>How Our Models Work</h2>
          <p>
            The website features three key prediction models, each tailored to a unique aspect of the game:
          </p>
          
          <div className="models-list">
            <div className="model-item">
              <h3>1. Match Score Prediction (During Match)</h3>
              <p>Predicts scores during gameplay using:</p>
              <ul>
                <li>Current wickets</li>
                <li>Current runs</li>
                <li>Current overs</li>
                <li>Team names</li>
              </ul>
            </div>

            <div className="model-item">
              <h3>2. Pre-Match Score Prediction (ML Model)</h3>
              <p>Uses machine learning to predict scores for both innings based on:</p>
              <ul>
                <li>Team names</li>
                <li>Venue</li>
                <li>Toss winner</li>
                <li>Toss decision (bat/bowl)</li>
              </ul>
            </div>

            <div className="model-item">
              <h3>3. Winner Prediction (DL Model)</h3>
              <p>Utilizes a Classification-based LSTM model to predict match outcomes:</p>
              <ul>
                <li>Team names</li>
                <li>Venue</li>
                <li>Toss winner</li>
                <li>Toss decision (bat/bowl)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;