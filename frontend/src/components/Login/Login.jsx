import React, { useState } from 'react';
import apiService from '../../utils/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call real API login
      const response = await apiService.login(credentials.email, credentials.password);
      
      // API returns: { token, user: { id, email, fullName, departmentId, roles } }
      const { user } = response;
      
      // Transform API user data to match what your app expects
      const userData = {
        id: user.id,
        username: user.email,
        email: user.email,
        name: user.fullName,
        role: user.roles?.[0]?.toLowerCase() || 'lecturer', // Get first role
        roles: user.roles,
        departmentId: user.departmentId
      };

      // Call parent component's onLogin with user data
      onLogin(userData);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="university-logo">
          <div className="logo-placeholder">
            <h2><img src="https://www.cbu.ac.zm/cbu-challenge/assets/img/CBU_Logo.png" alt="CBU LOGO"></img></h2>
          </div>
        </div>
        
        <div className="login-card">
          <div className="login-header">
            <h1>KPI Management System</h1>
            <p>School of Information & Communications Technology</p>
            <p>The Copperbelt University</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;