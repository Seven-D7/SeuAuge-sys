import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'moderator';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  fallbackPath = '/auth?mode=login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Enhanced loading state with better UX
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 mx-auto border border-white/20">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse mx-auto"></div>
          </div>
          <p className="text-white/70 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  // Check role-based access
  const hasRequiredRole = () => {
    if (requiredRole === 'user') return true; // All authenticated users have user role
    if (requiredRole === 'admin') return user.isAdmin || user.role === 'admin';
    if (requiredRole === 'moderator') return user.role === 'moderator' || user.role === 'admin';
    return false;
  };

  // User doesn't have required role
  if (!hasRequiredRole()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/30">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-white/70 mb-6">
            Você não tem permissão para acessar esta área. 
            {requiredRole === 'admin' && ' É necessário ter privilégios de administrador.'}
            {requiredRole === 'moderator' && ' É necessário ter privilégios de moderador.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // User authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
