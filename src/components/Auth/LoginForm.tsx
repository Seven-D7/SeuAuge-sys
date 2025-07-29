import React, { useState } from 'react';
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
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Credenciais inválidas. Verifique seu email e senha.');
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
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-400/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Email enviado!</h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Enviamos um link de recuperação para <br />
            <span className="text-teal-300 font-semibold">{email}</span>
            <br /><br />
            Verifique sua caixa de entrada e pasta de spam.
          </p>
        </div>

        <button
          onClick={resetForm}
          className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-teal-400/30"
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {forgotPasswordMode ? 'Recuperar senha' : 'Bem-vindo de volta'}
        </h2>
        <p className="text-white/70 text-sm sm:text-base">
          {forgotPasswordMode
            ? 'Digite seu email para receber o link de recuperação'
            : 'Entre para continuar sua jornada de bem-estar'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Endereço de Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm sm:text-base transition-all duration-300"
              placeholder="Digite seu email"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {!forgotPasswordMode && (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm sm:text-base transition-all duration-300"
                placeholder="Digite sua senha"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-teal-300 hover:text-teal-200 text-sm font-medium transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] transform hover:scale-105 shadow-lg backdrop-blur-sm border border-teal-400/30"
          >
            {loading
              ? (forgotPasswordMode ? 'Enviando...' : 'Entrando...')
              : (forgotPasswordMode ? 'Enviar link de recuperação' : 'Entrar')
            }
          </button>

          {forgotPasswordMode && (
            <button
              type="button"
              onClick={() => {
                setForgotPasswordMode(false);
                setError(null);
              }}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              Voltar ao login
            </button>
          )}
        </div>
      </form>

      {!forgotPasswordMode && (
        <div className="text-center">
          <p className="text-white/70 text-sm sm:text-base">
            Não tem uma conta?{' '}
            <button
              onClick={onToggleMode}
              className="text-teal-300 hover:text-teal-200 font-medium transition-colors"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
