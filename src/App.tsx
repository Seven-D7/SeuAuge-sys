import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout/Layout';
import PlanGuard from './components/PlanGuard';
import Auth from './pages/Auth';
import HomeImproved from './pages/HomeImproved';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Store from './pages/Store';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Payment from './pages/Payment';
import Plans from './pages/Plans';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';

// Lazy loading para melhor performance
const Progress = lazy(() => import('./pages/Progress'));
const AppsPage = lazy(() => import('./pages/Apps'));
const FitnessModulesApp = lazy(() => import('./components/fitness-modules/ModulosConfig'));

// Componente de loading melhorado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">Carregando...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            <Route path="/" element={<HomeImproved />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
            <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="videos" element={<Videos />} />
              <Route path="store" element={<Store />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="progress"
                element={
                  <PlanGuard allowedPlans={["B", "C"]}>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Progress />
                    </Suspense>
                  </PlanGuard>
                }
              />
              <Route path="plans" element={<Plans />} />
              <Route path="payment" element={<Payment />} />
              <Route path="settings" element={<Settings />} />
              <Route
                path="apps"
                element={
                  <PlanGuard allowedPlans={["B", "C"]}>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AppsPage />
                    </Suspense>
                  </PlanGuard>
                }
              />
              <Route
                path="fitness/*"
                element={
                  <PlanGuard allowedPlans={["B", "C"]}>
                    <Suspense fallback={<LoadingSpinner />}>
                      <FitnessModulesApp />
                    </Suspense>
                  </PlanGuard>
                }
              />
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

