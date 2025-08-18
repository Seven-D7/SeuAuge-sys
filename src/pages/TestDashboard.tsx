import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import TestRunner from '../components/Admin/TestRunner';
import { Navigate } from 'react-router-dom';

const TestDashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestRunner />
      </div>
    </div>
  );
};

export default TestDashboard;
