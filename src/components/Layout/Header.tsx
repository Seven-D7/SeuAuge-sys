import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { authOperations } from '../../lib/supabase';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import LanguageSelector from '../LanguageSelector';
import SupabaseSetupPrompt from './SupabaseSetupPrompt';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginProgress, setLoginProgress] = useState<string>('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const navigate = useNavigate();
  const { login, clearError } = useAuth();
  const { t } = useLanguage();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Clear errors when user starts typing
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError(null);
      clearError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) {
      setError(null);
      clearError();
    }
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
      setError('Email inválido');
      return;
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    clearError();
    setLoginProgress('Autenticando...');

    try {
      // Step 1: Authenticate
      setLoginProgress('Verificando credenciais...');
      await login(email.trim(), password);

      // Step 2: Loading user data
      setLoginProgress('Carregando perfil...');

      // Small delay to show progress feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Redirect
      setLoginProgress('Redirecionando...');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);

      // Enhanced error handling
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      // Show setup prompt if Supabase is not configured
      if (errorMessage.includes('Sistema de autenticação não configurado') || 
          errorMessage.includes('Supabase not configured') ||
          (!isSupabaseConfigured && (errorMessage.includes('conexão') || errorMessage.includes('Failed to fetch') || errorMessage.includes('network')))) {
        setShowSetupPrompt(true);
      } else if (errorMessage.includes('timeout')) {
        const timeoutMsg = 'Conexão lenta. Tente novamente';
        setError(timeoutMsg);
        toast.error(timeoutMsg, { duration: 6000 });
      } else if (errorMessage.includes('network')) {
        const networkMsg = 'Sem conexão. Verifique sua internet';
        setError(networkMsg);
        toast.error(networkMsg, { duration: 6000 });
      } else {
        setError(errorMessage || t('auth.login_error'));
      }
    } finally {
      setLoading(false);
      setLoginProgress('');
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Digite seu email para recuperar a senha');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Digite um email válido');
      return;
    }

    setLoading(true);
    setError(null);
    clearError();
    setLoginProgress('Enviando link de recuperação...');

    try {
      const { error } = await authOperations.resetPasswordForEmail(
        trimmedEmail,
        `${window.location.origin}/auth/reset-password`
      );

      if (error) throw error;

      setResetEmailSent(true);
      toast.success('Email de recuperação enviado!', { duration: 5000 });
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      if (errorMessage?.includes('timeout')) {
        const timeoutMsg = 'Tempo limite excedido. Verifique sua conexão';
        setError(timeoutMsg);
        toast.error(timeoutMsg, { duration: 6000 });
      } else if (errorMessage?.includes('User not found') || errorMessage?.includes('Invalid login credentials')) {
        setError('Email não encontrado. Verifique se está correto');
      } else if (errorMessage?.includes('Invalid email')) {
        setError('Formato de email inválido');
      } else if (errorMessage?.includes('too many requests') || errorMessage?.includes('Email rate limit')) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente');
      } else if (errorMessage?.includes('For security purposes')) {
        setError('Por segurança, você só pode solicitar recuperação a cada 60 segundos');
      } else {
        setError('Erro ao enviar email de recuperação. Tente novamente');
      }
    } finally {
      setLoading(false);
      setLoginProgress('');
    }
  };

  const resetForm = () => {
    setForgotPasswordMode(false);
    setResetEmailSent(false);
    setError(null);
    clearError();
    setEmail('');
    setPassword('');
    setLoginProgress('');
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

          <div className="space-y-4 text-left mb-6">
            <p className="text-slate-600">
              Enviamos um link de recuperação para:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-slate-900 font-medium break-all text-sm">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-blue-800">
                  <p className="font-medium">Próximos passos:</p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>Verifique sua caixa de entrada</li>
                    <li>Confira a pasta de spam/lixo eletrônico</li>
                    <li>Clique no link no email para redefinir sua senha</li>
                    <li>O link expira em 1 hora por segurança</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={resetForm}
          className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[44px]"
        >
          {t('auth.back_to_login')}
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {showSetupPrompt && (
        <SupabaseSetupPrompt onClose={() => setShowSetupPrompt(false)} />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Seletor de idioma discreto */}
        <div className="flex justify-end">
          <LanguageSelector variant="discrete" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {forgotPasswordMode ? t('auth.recover_password') : t('auth.welcome_back')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {forgotPasswordMode
              ? t('auth.enter_email_recovery')
              : t('auth.enter_to_continue')
            }
          </p>
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium"
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('auth.email_address')}
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
                placeholder={t('auth.enter_email')}
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
                {t('auth.password')}
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
                  placeholder={t('auth.enter_password')}
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
                  {t('auth.forgot_password')}
                </button>
              </div>
            </motion.div>
          )}
            <div className="hidden lg:block text-right min-w-0 max-w-[120px]">
          {error && (
                <p className="text-sm font-medium text-white truncate">
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
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center ring-2 ring-slate-700 group-hover:ring-primary/50 transition-all duration-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base min-h-[44px] transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <User className="w-5 h-5 text-white" />
                  <span className="text-sm">
                    {loginProgress || (forgotPasswordMode ? t('auth.sending') : t('auth.signing_in'))}
                  </span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
              ) : (
                forgotPasswordMode ? t('auth.send_recovery_link') : t('auth.sign_in')
              )}
            </button>

            {!forgotPasswordMode && (
              <button
                type="button"
                onClick={onToggleMode}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 text-base border border-slate-300 hover:border-primary"
              >
                {t('auth.no_account')} <span className="text-primary font-semibold">{t('auth.create_account')}</span>
            className="md:hidden bg-slate-800 border-t border-slate-700 px-3 sm:px-4 py-3 safe-area-inset-x"
            )}
          </motion.div>

          {forgotPasswordMode && (
            <motion.button
              initial={{ opacity: 0 }}
            className="flex items-center space-x-2 hover:bg-slate-800 rounded-lg p-2 transition-all duration-200 group min-w-0 max-w-full"
              type="button"
              onClick={resetForm}
              className="w-full text-slate-600 hover:text-primary font-medium py-2 text-sm transition-colors"
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base transition-all duration-200"
              {t('auth.back_to_login')}
            </motion.button>
          )}
        </form>
      </motion.div>
    </>
  );
};

export default LoginForm;
