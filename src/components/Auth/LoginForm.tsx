import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { isSupabaseDemoMode } from '../../lib/supabase';
import LanguageSelector from '../LanguageSelector';

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
  const { t } = useLanguage();

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
      setError(t('auth.email_password_required'));
      return;
    }

    if (!validateEmail(email.trim())) {
      setError(t('auth.valid_email_required'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.password_min_length'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Error messages are already handled in SupabaseAuthContext
      setError(error.message || t('auth.login_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError(t('auth.enter_email_to_recover'));
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError(t('auth.valid_email_required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSupabaseDemoMode) {
        // Simulate password reset email in demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResetEmailSent(true);
        console.log('🔧 Demo: Password reset email simulated for', trimmedEmail);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
        if (error) throw error;
        setResetEmailSent(true);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.message?.includes('User not found')) {
        setError(t('auth.email_not_found'));
      } else if (error.message?.includes('Invalid email')) {
        setError(t('auth.invalid_email'));
      } else if (error.message?.includes('too many requests')) {
        setError(t('auth.too_many_requests'));
      } else {
        setError(t('auth.recovery_error'));
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
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t('auth.email_sent')}</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('auth.recovery_sent')} <br />
            <span className="text-slate-900 font-semibold">{email}</span>
            <br /><br />
            {t('auth.check_inbox')}
          </p>
        </div>

        <button
          onClick={resetForm}
          className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {t('auth.back_to_login')}
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
                {forgotPasswordMode ? t('auth.sending') : t('auth.signing_in')}
              </div>
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
            {t('auth.back_to_login')}
          </motion.button>
        )}
      </form>
    </motion.div>
  );
};

export default LoginForm;
