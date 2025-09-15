import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login/Login.jsx';
import Dashboard from './components/AdminDashboard/Dashboard';
import KPIManagement from './components/AdminDashboard/KPIManagement';
import UserList from './components/AdminDashboard/UserList';
import DepartmentList from './components/AdminDashboard/DepartmentList';
import HODWorkplanReview from './components/HODDashboard/HODWorkplanReview';


import Navbar from './components/Layout/Navbar';

import LecturerList from './components/HODDashboard/LecturerList';
import LecturerProfile from './components/HODDashboard/LecturerProfile';
import WorkplanSubmission from './components/HODDashboard/WorkplanSubmission';
// import Reports from './components/Reports/Reports'; // Uncomment and modularize if needed

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
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
            path="/hod/review-workplans" 
            element={
              isAuthenticated && user.role === 'hod' ? 
              <HODWorkplanReview user={user} /> : 
              <Navigate to="/dashboard" />
  } 
/>
          
          <Route 
            path="/lecturers" 
            element={
              isAuthenticated && (user.role === 'admin' || user.role === 'hod' || user.role === 'dean') ? 
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
              isAuthenticated && (user.role === 'admin' || user.role === 'hod' || user.role === 'dean') ? 
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
          
          {/*
          <Route 
            path="/reports" 
            element={
              isAuthenticated ? 
              <Reports user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          */}
          
          <Route path="/users" element={isAuthenticated && (user.role === 'admin' || user.role === 'hod' || user.role === 'dean') ? <UserList user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/departments" element={isAuthenticated && (user.role === 'admin' || user.role === 'hod' || user.role === 'dean') ? <DepartmentList /> : <Navigate to="/dashboard" />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;