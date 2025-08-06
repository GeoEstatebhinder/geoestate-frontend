import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    let isMounted = true; // to avoid state updates on unmounted component
    const token = localStorage.getItem('token');

    if (isMounted) {
      setIsAuthenticated(!!token); // simple check: token exists
    }

    return () => {
      isMounted = false; // cleanup to avoid memory leaks
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
