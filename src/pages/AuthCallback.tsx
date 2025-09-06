import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [message, setMessage] = useState('Processando sua autenticação...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      setStatus('error');
      const friendlyMessage = errorDescription || 'Ocorreu um erro durante a autenticação.';
      setMessage(friendlyMessage);
      toast.error(friendlyMessage);
      return;
    }

    if (!authLoading) {
      if (user) {
        setStatus('success');
        setMessage('Autenticação bem-sucedida! Redirecionando...');
        toast.success('Login realizado com sucesso!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setStatus('error');
        const friendlyMessage = 'Falha ao verificar a sessão. Por favor, tente fazer login novamente.';
        setMessage(friendlyMessage);
        toast.error('Sessão inválida ou expirada.');
      }
    }
  }, [authLoading, user, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center"
      >
        {status === 'loading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">Verificando...</h2>
            <p className="text-slate-500">{message}</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">Sucesso!</h2>
            <p className="text-slate-500">{message}</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">Erro</h2>
            <p className="text-slate-500">{message}</p>
            <button
              onClick={() => navigate('/auth')}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Voltar ao Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;
