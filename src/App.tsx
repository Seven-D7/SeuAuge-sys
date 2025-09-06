import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout/Layout";
import PlanGuard from "./components/PlanGuard";
import ErrorBoundary from "./components/ErrorBoundary";
import SupabaseStatus from "./components/Common/SupabaseStatus";
import NetworkStatus from "./components/Common/NetworkStatus";
import { Toaster } from "react-hot-toast";

// Lazy load components
const Auth = lazy(() => import("./pages/Auth"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const FitnessModulesApp = lazy(() => import("./components/fitness-modules/ModulosConfig"));
const Reports = lazy(() => import("./pages/Reports"));
const Videos = lazy(() => import("./pages/Videos"));
const Products = lazy(() => import("./pages/Products"));
const AppsPage = lazy(() => import("./pages/Apps"));
const Achievements = lazy(() => import("./pages/Achievements"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const PreferencesSetup = lazy(() => import("./pages/PreferencesSetup"));
const Plans = lazy(() => import("./pages/Plans"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SupabaseStatus />
            <NetworkStatus />
            <Toaster position="top-center" />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
                <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/confirm" element={<AuthCallback />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/plans" element={<Plans />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Layout><Favorites /></Layout></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                <Route path="/achievements" element={<ProtectedRoute><Layout><Achievements /></Layout></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute><Layout><Onboarding /></Layout></ProtectedRoute>} />
                <Route path="/preferences" element={<ProtectedRoute><Layout><PreferencesSetup /></Layout></ProtectedRoute>} />

                {/* Plan-Protected Routes */}
                <Route path="/protected/*" element={<ProtectedRoute><Layout><Routes>
                  <Route path="videos" element={<PlanGuard requiredPlan="B"><Videos /></PlanGuard>} />
                  <Route path="products" element={<PlanGuard requiredPlan="B"><Products /></PlanGuard>} />
                  <Route path="apps" element={<PlanGuard requiredPlan="B"><AppsPage /></PlanGuard>} />
                  <Route path="fitness/*" element={<PlanGuard requiredPlan="B"><FitnessModulesApp /></PlanGuard>} />
                </Routes></Layout></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
