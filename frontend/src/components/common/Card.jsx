// src/components/common/Card.jsx
import React from "react";

export const Card = ({ children }) => (
  <div className="rounded-xl shadow-md border bg-white">{children}</div>
);

export const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);
