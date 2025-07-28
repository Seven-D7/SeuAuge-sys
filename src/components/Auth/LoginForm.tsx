import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      setError(null);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      // Don't expose detailed error information
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Digite seu email para recuperar a senha');
      return;
    }

    setLoading(true);

    try {
      // Simulate password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResetEmailSent(true);
      setError(null);
    } catch (error) {
      setError('Erro ao enviar email de recuperação. Tente novamente.');
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
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Email enviado!</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Enviamos um link de recuperação para <strong>{email}</strong>.
            Verifique sua caixa de entrada e spam.
          </p>
        </div>

        <button
          onClick={resetForm}
          className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
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
        <p className="text-slate-400 text-sm sm:text-base">
          {forgotPasswordMode
            ? 'Digite seu email para receber o link de recuperação'
            : 'Entre para continuar sua jornada de bem-estar'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Endereço de Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              placeholder="Digite seu email"
              required
            />
          </div>
        </div>

        {!forgotPasswordMode && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                placeholder="Digite sua senha"
                required={!forgotPasswordMode}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-primary hover:text-primary-light text-sm font-medium transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 text-sm sm:text-base min-h-[44px]"
          >
            {loading
              ? (forgotPasswordMode ? 'Enviando...' : 'Entrando...')
              : (forgotPasswordMode ? 'Enviar link de recuperação' : 'Entrar')
            }
          </button>

          {forgotPasswordMode && (
            <button
              type="button"
              onClick={() => setForgotPasswordMode(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
            >
              Voltar ao login
            </button>
          )}
        </div>
      </form>

      {!forgotPasswordMode && (
        <div className="text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            Não tem uma conta?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary hover:text-primary-light font-medium transition-colors"
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
