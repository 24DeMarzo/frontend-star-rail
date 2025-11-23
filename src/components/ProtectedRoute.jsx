import React from 'react';
import { useOutletContext, Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const outletContext = useOutletContext(); 
  const { currentUser } = outletContext;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={outletContext} />;
}

export default ProtectedRoute;