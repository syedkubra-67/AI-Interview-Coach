import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from './common/LoadingSkeleton';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-height-screen flex flex-col items-center justify-center p-8 bg-[#080b11]">
        <div className="max-w-md w-full space-y-4">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-500"></div>
          </div>
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    );
  }

  // User is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route requires admin role, but user is not an admin
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
