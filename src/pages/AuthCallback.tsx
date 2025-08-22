import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL params
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Erro na verificação do email');
          setLoading(false);
          return;
        }

        // Handle the auth callback
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error('Auth callback error:', authError);
          setStatus('error');
          setMessage('Erro ao processar verificação');
          setLoading(false);
          return;
        }

        // Check if user is authenticated after callback
        if (data.session) {
          // User is now authenticated
          setStatus('success');
          setMessage('Email verificado com sucesso!');
          toast.success('Email verificado! Redirecionando...', { duration: 3000 });
          
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Check for specific callback types
          const type = searchParams.get('type');
          
          if (type === 'email_change') {
            setStatus('success');
            setMessage('Email alterado com sucesso!');
            setTimeout(() => navigate('/profile'), 2000);
          } else if (type === 'recovery') {
            setStatus('success');
            setMessage('Acesso autorizado. Redefina sua senha.');
            setTimeout(() => navigate('/auth/reset-password'), 1000);
          } else {
            setStatus('success');
            setMessage('Email verificado com sucesso!');
            setTimeout(() => navigate('/dashboard'), 2000);
          }
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('error');
        setMessage('Erro inesperado na verificação');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6"
            >
              <Loader2 className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Verificando email...
            </h2>
            <p className="text-slate-600">
              Aguarde enquanto processamos sua verificação
            </p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`mx-auto w-16 h-16 ${
                status === 'success' 
                  ? 'bg-emerald-100 border border-emerald-200' 
                  : 'bg-red-100 border border-red-200'
              } rounded-full flex items-center justify-center mb-6`}
            >
              {status === 'success' ? (
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </motion.div>

            <h2 className={`text-2xl font-bold mb-4 ${
              status === 'success' ? 'text-slate-900' : 'text-red-900'
            }`}>
              {status === 'success' ? 'Sucesso!' : 'Erro na verificação'}
            </h2>

            <p className={`mb-6 ${
              status === 'success' ? 'text-slate-600' : 'text-red-600'
            }`}>
              {message}
            </p>

            <button
              onClick={handleContinue}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
                status === 'success'
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
              }`}
            >
              {status === 'success' ? 'Continuar para Dashboard' : 'Voltar ao Login'}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;
