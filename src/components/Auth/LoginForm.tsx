import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { auth, isDemoMode } from '../../firebase';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotPasswordMode) {
      return handleForgotPassword();
    }

    // Input validation
    if (!email.trim() || !password.trim()) {
      setError('Email e senha são obrigatórios');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Por favor, digite um email válido');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error codes
      if (error.code === 'auth/user-not-found') {
        setError('Email não encontrado. Verifique o endereço digitado.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique o formato do endereço.');
      } else if (error.code === 'auth/user-disabled') {
        setError('Esta conta foi desativada. Entre em contato com o suporte.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Muitas tentativas de login. Tente novamente mais tarde.');
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError('Digite seu email para recuperar a senha');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Por favor, digite um email válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isDemoMode) {
        // Simulate password reset email in demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResetEmailSent(true);
        console.log('🔧 Demo: Password reset email simulated for', trimmedEmail);
      } else {
        await sendPasswordResetEmail(auth, trimmedEmail);
        setResetEmailSent(true);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('Email não encontrado. Verifique o endereço digitado.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique o formato do endereço.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Erro ao enviar email de recuperação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForgotPasswordMode(false);
    setResetEmailSent(false);
    setError(null);
    setEmail('');
    setPassword('');
  };

  if (resetEmailSent) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Email enviado!</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Enviamos um link de recuperação para <br />
            <span className="text-slate-900 font-semibold">{email}</span>
            <br /><br />
            Verifique sua caixa de entrada e pasta de spam.
          </p>
        </div>

        <button
          onClick={resetForm}
          className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Voltar ao login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {forgotPasswordMode ? 'Recuperar senha' : 'Bem-vindo de volta'}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base">
          {forgotPasswordMode
            ? 'Digite seu email para receber o link de recuperação'
            : 'Entre para continuar sua jornada de bem-estar'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Endereço de Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-300"
              placeholder="Digite seu email"
              required
              autoComplete="email"
            />
          </div>
        </motion.div>

        {!forgotPasswordMode && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-300"
                placeholder="Digite sua senha"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base min-h-[44px] transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {forgotPasswordMode ? 'Enviando...' : 'Entrando...'}
              </div>
            ) : (
              forgotPasswordMode ? 'Enviar link de recuperação' : 'Entrar'
            )}
          </button>

          {!forgotPasswordMode && (
            <button
              type="button"
              onClick={onToggleMode}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 text-base border border-slate-300 hover:border-primary"
            >
              Ainda não tem conta? <span className="text-primary font-semibold">Criar conta</span>
            </button>
          )}
        </motion.div>

        {forgotPasswordMode && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={resetForm}
            className="w-full text-slate-600 hover:text-primary font-medium py-2 text-sm transition-colors"
          >
            Voltar ao login
          </motion.button>
        )}
      </form>
    </motion.div>
  );
};

export default LoginForm;
