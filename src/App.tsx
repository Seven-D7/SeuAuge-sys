import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import ProtectedRoute from '@components/ProtectedRoute';
import AdminRoute from '@components/AdminRoute';
import Layout from '@components/Layout/Layout';
import PlanGuard from '@components/PlanGuard';
import { Toaster } from 'react-hot-toast';

const Auth = lazy(() => import('@pages/Auth'));
const Home = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const Videos = lazy(() => import('@pages/Videos'));
const Store = lazy(() => import('@pages/Store'));
const Favorites = lazy(() => import('@pages/Favorites'));
const Profile = lazy(() => import('@pages/Profile'));
const Settings = lazy(() => import('@pages/Settings'));
const Payment = lazy(() => import('@pages/Payment'));
const Plans = lazy(() => import('@pages/Plans'));
const AdminDashboard = lazy(() => import('@pages/AdminDashboard'));
const Progress = lazy(() => import('@pages/Progress'));
const AppsPage = lazy(() => import('@pages/Apps'));
const About = lazy(() => import('@pages/About'));
const FitnessModulesApp = lazy(() => import('@components/fitness-modules/ModulosConfig'));

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Home /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><About /></Suspense>} />
          <Route path="/auth" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Auth /></Suspense>} />
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
            <Route path="dashboard" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Dashboard /></Suspense>} />
            <Route path="videos" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Videos /></Suspense>} />
            <Route path="store" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Store /></Suspense>} />
            <Route path="favorites" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Favorites /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Profile /></Suspense>} />
            
            <Route
              path="progress"
              element={
                <PlanGuard allowedPlans={["B", "C"]}>
                  <Suspense fallback={<div className="p-4 text-white">Carregando...</div>}>
                    <Progress />
                  </Suspense>
                </PlanGuard>
              }
            />
            <Route path="plans" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Plans /></Suspense>} />
            <Route path="payment" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Payment /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<div className="p-4 text-white">Carregando...</div>}><Settings /></Suspense>} />

            <Route
              path="apps"
              element={
                <PlanGuard allowedPlans={["B", "C"]}>
                  <Suspense fallback={<div className="p-4 text-white">Carregando...</div>}>
                    <AppsPage />
                  </Suspense>
                </PlanGuard>
              }
            />
            <Route
              path="fitness/*"
              element={
                <PlanGuard allowedPlans={["B", "C"]}>
                  <Suspense fallback={<div className="p-4 text-white">Carregando...</div>}>
                    <FitnessModulesApp />
                  </Suspense>
                </PlanGuard>
              }
            />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <Suspense fallback={<div className="p-4 text-white">Carregando...</div>}>
                    <AdminDashboard />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </div>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
