// src/components/common/Button.jsx
import React from "react";

export const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-90 transition ${className}`}
  >
    {children}
  </button>
);
