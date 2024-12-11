import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import '../Styles/Signin.css';
import bgImage from '../Assets/PredictPageBackGroundimg.jpg';

export default function SignIn() {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for redirect path on component mount
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterSignin');
    if (redirectPath) {
      // Verify the path is valid
      const validPaths = ['/Predict1', '/ScorePrediction'];
      if (!validPaths.includes(redirectPath)) {
        localStorage.removeItem('redirectAfterSignin');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password
        })
      });

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
        
        // Check for redirect path after successful login
        const redirectPath = localStorage.getItem('redirectAfterSignin');
        
        // Redirect after a short delay
        setTimeout(() => {
          // Clear the stored redirect path
          localStorage.removeItem('redirectAfterSignin');
          
          // Navigate to the redirect path or default to Predict1
          if (redirectPath === '/Predict1' || redirectPath === '/ScorePrediction') {
            navigate(redirectPath);
          } else {
            navigate('/Predict1');
          }
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
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