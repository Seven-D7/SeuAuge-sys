import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  fallbackPath = '/dashboard' 
}) => {
  const { user, loading } = useAuth();

  // Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 mx-auto border border-white/20">
              <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse mx-auto"></div>
          </div>
          <p className="text-white/70 text-sm">Verificando privilégios de administrador...</p>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // Enhanced admin check - multiple ways to verify admin status
  const isAdmin = user.isAdmin || user.role === 'admin';
  
  // User is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/30">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Área Restrita</h2>
          <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-200 text-sm text-left">
                Esta área é restrita a administradores do sistema. 
                Se você acredita que deveria ter acesso, entre em contato com o suporte.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = fallbackPath}
              className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Ir para Dashboard
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
            >
              Voltar
            </button>
          </div>
          
          {/* Security notice */}
          <div className="mt-8 text-xs text-white/40">
            <p>Tentativas de acesso não autorizado são registradas</p>
          </div>
        </div>
      </div>
    );
  }

  // User is admin - render protected content
  return <>{children}</>;
};

export default AdminRoute;
