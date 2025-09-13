import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ to, label = "Back", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`back-button ${className}`}
      type="button"
    >
      <span className="back-icon">←</span>
      {label}
    </button>
  );
};

export default BackButton;