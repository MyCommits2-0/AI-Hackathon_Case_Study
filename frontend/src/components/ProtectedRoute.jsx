// frontend/src/components/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  // 1. Check if the user is logged in
  if (!token || !user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to redirect them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect them to an unauthorized page or back to login
    // For now, we'll send them to the login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If they are authenticated and authorized, render the page
  return children;
};

export default ProtectedRoute;
