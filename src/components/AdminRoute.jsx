import React from 'react';
import { useOutletContext, Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const outletContext = useOutletContext();
  const { currentUser } = outletContext || {};

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet context={outletContext} />;
}

export default AdminRoute;