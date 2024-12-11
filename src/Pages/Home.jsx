import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Home.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Mlogo from '../Assets/MainLogo.png';
import bgImage from '../Assets/HomePageimg1.jpg';
import 'remixicon/fonts/remixicon.css';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      offset: 1,
    });
  }, []);

  // New function to handle prediction navigation
  const handlePredictionNavigation = (redirectTo) => {
    // Store the redirect path in state/localStorage
    localStorage.setItem('redirectAfterSignin', redirectTo);
    navigate('/Signin');
  };

  return (
    <div>
      {/* Header */}
      <header>
        <a href="#" className="logo">
          <img src={Mlogo} alt="Logo" />
        </a>

        <ul className="navlist">
          <li><Link to="/About">About</Link></li>
          <li
            className="dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <a href="#">Predict</a>
            {showDropdown && (
              <ul className="dropdown-content">
                <li><Link to="/Signin" onClick={() => handlePredictionNavigation('/Predict1')}>Match Prediction</Link></li>
                <li><Link to="/Signin" onClick={() => handlePredictionNavigation('/ScorePrediction')}>Score Prediction</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/Contact">Contact</Link></li>
        </ul>

        <div className="right-content">
          <Link to="/Signin" className="nav-btn">Sign In</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h5 data-aos="fade-right" data-aos-duration="1400">#Predict upcoming matches</h5>
          <h1 data-aos="zoom-in-left" data-aos-duration="1400" data-aos-delay="200">-Most Accurate</h1>
          <p data-aos="fade-right" data-aos-duration="1400" data-aos-delay="300">
          At NEXT WICKET-AI, we are passionate about bringing the excitement of the Indian Premier League (IPL) to fans worldwide with a unique twist. Our platform offers detailed, data-driven predictions for IPL match outcomes, ensuring that fans can stay ahead of the game with expert insights and analytics.
          </p>

          <div className="main-hero" data-aos="flip-down" data-aos-duration="1400" data-aos-delay="400">
            <button
              onClick={() => handlePredictionNavigation('/Predict1')}
              className="btn"
            >
              Match Prediction
            </button>
            <button
              onClick={() => handlePredictionNavigation('/ScorePrediction')}
              className="btn"
            >
              Score Prediction
            </button>
          </div>
        </div>

        <div className="hero-img" data-aos="zoom-in" data-aos-duration="1400">
          <img src={bgImage} alt="Hero" />
        </div>
      </section>

      {/* Social Media Icons */}
      <div className="icons">
        <a href="https://www.facebook.com/share/14iskt66cb/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer" data-aos="fade-in" data-aos-duration="1400" data-aos-delay="600">
          <i className="ri-facebook-fill"></i>
        </a>
        <a href="https://www.instagram.com/next_wicket_ai/profilecard/?igsh=eDkxdHk3cWhlcTdi" target="_blank" rel="noopener noreferrer" data-aos="fade-in" data-aos-duration="1400" data-aos-delay="700">
          <i className="ri-instagram-fill"></i>
        </a>
        <a href="https://x.com/next_wicket_ai?t=EPoSdUGlM88yAEvZjEw3Vg&s=08" target="_blank" rel="noopener noreferrer" data-aos="fade-in" data-aos-duration="1400" data-aos-delay="800">
          <i className="ri-twitter-fill"></i>
        </a>
      </div>

      {/* Scroll Down */}
      <div className="scroll" data-aos="zoom-out-down" data-aos-duration="1400" data-aos-delay="550">
        <a href="#">
          <i className="ri-arrow-down-s-line"></i>
          Scroll Down
        </a>
      </div>
    </div>
  );
};

export default HomePage;