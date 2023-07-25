import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ path, element }) => {
  const isAuthenticated = Cookies.get('accessToken');

  if (isAuthenticated) {
    return <Route path={path} element={element} />;
  } else {
    return <Navigate to="/user/login" />;
  }
};

export default ProtectedRoute;
