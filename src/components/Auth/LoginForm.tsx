import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient'; // Import supabase directly for password reset
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
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showSetupPrompt, setShowSetupPrompt] = useState(!isSupabaseConfigured);
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

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await login({ email, password });
      if (error) throw error;
      toast.success('Login bem-sucedido!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Email não confirmado. Verifique sua caixa de entrada.');
      } else if (!isSupabaseConfigured) {
        setShowSetupPrompt(true);
        setError('O Supabase não está configurado.');
      } else {
        setError('Falha no login. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      toast.success('Email de recuperação enviado!');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('Falha ao enviar email de recuperação. Tente novamente mais tarde.');
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Email enviado!</h2>
          <p className="text-slate-600">Enviamos um link de recuperação para <span className="font-medium text-slate-800">{email}</span>.</p>
        </div>
        <button onClick={resetForm} className="w-full bg-primary text-white font-medium py-3 rounded-lg">{t('auth.back_to_login')}</button>
      </motion.div>
    );
  }

  return (
    <>
      {showSetupPrompt && <SupabaseSetupPrompt onClose={() => setShowSetupPrompt(false)} />}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
        <div className="flex justify-end">
          <LanguageSelector variant="discrete" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{forgotPasswordMode ? t('auth.recover_password') : t('auth.welcome_back')}</h2>
          <p className="text-slate-600">{forgotPasswordMode ? t('auth.enter_email_recovery') : t('auth.enter_to_continue')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.email_address')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg" placeholder={t('auth.enter_email')} required />
            </div>
          </div>

          {!forgotPasswordMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-lg" placeholder={t('auth.enter_password')} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" onClick={() => setForgotPasswordMode(true)} className="text-primary text-sm font-medium">{t('auth.forgot_password')}</button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-medium py-3 rounded-lg disabled:opacity-50">
              {loading ? (forgotPasswordMode ? 'Enviando...' : 'Entrando...') : (forgotPasswordMode ? t('auth.send_recovery_link') : t('auth.sign_in'))}
            </button>
            {!forgotPasswordMode && (
              <button type="button" onClick={onToggleMode} className="w-full bg-slate-100 text-slate-700 font-medium py-3 rounded-lg">
                {t('auth.no_account')} <span className="text-primary font-semibold">{t('auth.create_account')}</span>
              </button>
            )}
          </div>

          {forgotPasswordMode && (
            <button type="button" onClick={resetForm} className="w-full text-slate-600 text-sm py-2">{t('auth.back_to_login')}</button>
          )}
        </form>
      </motion.div>
    </>
  );
};

export default LoginForm;
