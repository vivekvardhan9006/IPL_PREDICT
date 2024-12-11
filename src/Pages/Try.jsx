import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Try.css';

export default function SignIn() {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Visme animation script dynamically
    const script = document.createElement('script');
    script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
    script.async = true;
    script.crossOrigin = 'anonymous'; // Ensures proper handling of cross-origin scripts

    script.onload = () => {
      console.log('Visme script loaded successfully.');
    };

    script.onerror = (error) => {
      console.error('Error loading Visme script:', error);
    };

    document.body.appendChild(script);

    // Add event listener for button click in animation
    const handleVismeClick = (e) => {
      // Check if the target matches your animation's button selector
      if (e.target && e.target.matches('.visme_d .sign-in-button')) {
        console.log('Sign in button clicked');
        navigate('/Predict1'); // Navigate to Predict1
      }
    };

    document.addEventListener('click', handleVismeClick);

    return () => {
      // Cleanup the script and event listener on component unmount
      document.body.removeChild(script);
      document.removeEventListener('click', handleVismeClick);
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8555/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
        }),
      });

      // Check if the response is OK (status 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Login successful!');
        // Store user data in localStorage if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/Predict1');
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      {/* Visme animation container */}
      <div
        className="visme_d"
        data-title="SignIn Animation"
        data-url="4d6r0g79-untitled-project?fullPage=true"
        data-domain="forms"
        data-full-page="true"
        data-min-height="100vh"
        data-form-id="104356"
      ></div>

      {/* Login form */}
      <div className="login_b0x">
        <div className="login-header">
          <span>Login</span>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input_box">
            <input
              type="text"
              name="name"
              className="input-field"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter username"
            />
            <label className="label">Username</label>
          </div>

          <div className="input_box">
            <input
              type="password"
              name="password"
              className="input-field"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter password"
            />
            <label className="label">Password</label>
          </div>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <div className="input_box">
            <button
              type="submit"
              className="input-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
