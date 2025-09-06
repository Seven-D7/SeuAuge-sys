import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
          <p className="text-white/70 text-sm mt-4">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  const hasRequiredRole = () => {
    if (requiredRole === 'user') return true;
    if (requiredRole === 'admin') return user.isAdmin || user.role === 'admin';
    if (requiredRole === 'moderator') return user.role === 'moderator' || user.role === 'admin';
    return false;
  };

  if (!hasRequiredRole()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-white/70 mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
