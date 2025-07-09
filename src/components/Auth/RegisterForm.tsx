import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [birthdate, setBirthdate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (name.trim().length < 2 || name.trim().length > 50) {
      alert('Nome deve ter entre 2 e 50 caracteres');
      setLoading(false);
      return;
    }

    const pesoNum = Number(weight);
    if (pesoNum < 30 || pesoNum > 300) {
      alert('Peso deve estar entre 30kg e 300kg');
      setLoading(false);
      return;
    }

    const alturaNum = Number(height);
    if (alturaNum < 100 || alturaNum > 250) {
      alert('Altura deve estar entre 100 e 250 cm');
      setLoading(false);
      return;
    }

    const birth = new Date(birthdate);
    const age = new Date().getFullYear() - birth.getFullYear();
    if (age > 100 || age < 16) {
      alert('Idade deve estar entre 16 e 100 anos.');
      setLoading(false);
      return;
    }
    
    try {
      await register(email, password, name, birthdate);
      setError(null);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError('Falha ao criar conta. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Junte-se ao Meu Auge</h2>
        <p className="text-slate-400">Comece sua transformação de bem-estar hoje</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Digite seu nome completo"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
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
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Digite seu email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
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
              className="w-full pl-12 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Crie uma senha"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Data de Nascimento
          </label>
          <input
            type="date"
            value={birthdate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setBirthdate(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = Number(e.target.value);
                if (val < 30 || val > 300) {
                  alert('Peso deve estar entre 30kg e 300kg');
                  return;
                }
                setWeight(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Altura (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = Number(e.target.value);
                if (val < 100 || val > 250) {
                  alert('Altura deve estar entre 100 e 250 cm');
                  return;
                }
                setHeight(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            IMC
          </label>
          <input
            type="text"
            value={
              weight && height
                ? (
                    Number(weight) /
                    Math.pow(Number(height) / 100, 2)
                  ).toFixed(1)
                : ''
            }
            readOnly
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Criando Conta...' : 'Criar Conta'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-slate-400">
          Já tem uma conta?{' '}
          <button
            onClick={onToggleMode}
            className="text-primary hover:text-primary font-medium"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;