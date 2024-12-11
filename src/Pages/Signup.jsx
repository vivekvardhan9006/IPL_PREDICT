import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Signup.css';
import videoSrc from '../Assets/BackGroundViedo1.mp4';
import userLogo from '../Assets/UserLogoForSignInPage.png';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear messages
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    const { password, confirm_password, mobile, email, name } = formData;

    if (!name || !email || !password || !confirm_password || !mobile) {
      setErrorMessage("All fields are required");
      return false;
    }

    if (password !== confirm_password) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(mobile)) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch("http://localhost:8555/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        // Store token if provided
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        // Clear form
        setFormData({
          name: '',
          mobile: '',
          email: '',
          password: '',
          confirm_password: ''
        });
        // Redirect to login after delay
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setErrorMessage(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src={videoSrc} type="video/mp4" />

        Your browser does not support the video tag.
      </video>
      <div>
        <div className="container">
          <img
            src={userLogo}
            alt="User Registration Logo"
            className="user-logo"
          />
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Username:</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile no:</label>
              <input
                type="text"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password:</label>
              <input
                type="password"
                name="confirm_password"
                required
                value={formData.confirm_password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="button-group">
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
              <button
                type="reset"
                onClick={() => {
                  setFormData({
                    name: '',
                    mobile: '',
                    email: '',
                    password: '',
                    confirm_password: ''
                  });
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                disabled={isLoading}
                className="reset-button"
              >
                Reset
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}