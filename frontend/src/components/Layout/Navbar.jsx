import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const isActive = path => location.pathname === path;

  const getNavigationItems = () => {
    const baseItems = [{ path: '/dashboard', label: 'Dashboard' }];

    if (user.role === 'hod' || user.role === 'dean') {
      baseItems.push(
        { path: '/evaluations', label: 'Evaluations' },
        { path: '/lecturers', label: 'Lecturers' },
        { path: '/kpi-management', label: 'KPI Management' },
        { path: '/reports', label: 'Reports' }
      );
    }

    if (user.role === 'lecturer') {
      baseItems.push(
        { path: '/workplan', label: 'My Workplan' },
        { path: '/reports', label: 'Reports' }
      );
    }

    return baseItems;
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="brand-link">
          <div className="brand-logo">CBU</div>
          <div className="brand-text">
            <span className="brand-title">KPI Management</span>
            <span className="brand-subtitle">SICT</span>
          </div>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            {getNavigationItems().map(item => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">Logout</button>
          </div>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle navigation">
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
