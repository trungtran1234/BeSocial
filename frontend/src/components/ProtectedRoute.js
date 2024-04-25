import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" />; // redirect to login if no token
  }

  return children; // else go to protected route
};

export default ProtectedRoute;