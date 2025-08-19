import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user data - In real app, this would come from API
  const mockUsers = {
    'admin': { 
      password: 'admin123', 
      role: 'admin', 
      name: 'System Administrator',
      id: 1
    },
    'supervisor': { 
      password: 'sup123', 
      role: 'supervisor', 
      name: 'Dr. John Supervisor',
      id: 2
    },
    'lecturer1': { 
      password: 'lec123', 
      role: 'lecturer', 
      name: 'Mr. Raymose Banda',
      id: 3
    },
    'lecturer2': { 
      password: 'lec123', 
      role: 'lecturer', 
      name: 'Ms. Comfort Chiwele',
      id: 4
    }
  };

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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers[credentials.username];
    
    if (user && user.password === credentials.password) {
      onLogin({
        id: user.id,
        username: credentials.username,
        name: user.name,
        role: user.role
      });
    } else {
      setError('Invalid username or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="university-logo">
          <div className="logo-placeholder">
            <h2>CBU</h2>
            <p>SICT</p>
          </div>
        </div>
        
        <div className="login-card">
          <div className="login-header">
            <h1>KPI Management System</h1>
            <p>School of Information & Communication Technology</p>
            <p>The Copperbelt University</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter your username"
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

          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Supervisor:</strong> supervisor / sup123</p>
            <p><strong>Lecturer:</strong> lecturer1 / lec123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;