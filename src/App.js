import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import LecturerList from './components/LecturerList/LecturerList';
import LecturerProfile from './components/LecturerProfile/LecturerProfile';
import KPIManagement from './components/KPIManagement/KPIManagement';
import WorkplanSubmission from './components/WorkplanSubmission/WorkplanSubmission';
import Reports from './components/Reports/Reports';
import Navbar from './components/Layout/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/lecturers" 
            element={
              isAuthenticated && (user.role === 'admin' || user.role === 'supervisor') ? 
              <LecturerList user={user} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          
          <Route 
            path="/lecturer/:id" 
            element={
              isAuthenticated ? 
              <LecturerProfile user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/kpi-management" 
            element={
              isAuthenticated && (user.role === 'admin' || user.role === 'supervisor') ? 
              <KPIManagement user={user} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          
          <Route 
            path="/workplan" 
            element={
              isAuthenticated ? 
              <WorkplanSubmission user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              isAuthenticated ? 
              <Reports user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;