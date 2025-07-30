import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Calendar, Ruler, Weight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validatePassword, validateEmail, validateUserInput, sanitizeInput } from '../../lib/security';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    weight: '',
    height: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time password strength validation
    if (field === 'password') {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    const nameValidation = validateUserInput.name(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Nome inválido';
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0] || 'Senha inválida';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 16) {
        newErrors.birthdate = 'Você deve ter pelo menos 16 anos';
      } else if (age > 100) {
        newErrors.birthdate = 'Data de nascimento inválida';
      }
    }

    // Weight validation (optional)
    if (formData.weight) {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight) || weight < 30 || weight > 300) {
        newErrors.weight = 'Peso deve estar entre 30kg e 300kg';
      }
    }

    // Height validation (optional)
    if (formData.height) {
      const height = parseFloat(formData.height);
      if (isNaN(height) || height < 100 || height > 250) {
        newErrors.height = 'Altura deve estar entre 100cm e 250cm';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        birthdate: formData.birthdate,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
      };

      await register(
        sanitizedData.email,
        sanitizedData.password,
        sanitizedData.name,
        {
          birthdate: sanitizedData.birthdate,
          weight: sanitizedData.weight,
          height: sanitizedData.height,
        }
      );

      navigate('/preferences');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error codes
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Este email já está em uso. Tente fazer login.' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Senha muito fraca. Use pelo menos 6 caracteres.' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Email inválido. Verifique o formato.' });
      } else {
        setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'strong': return 'bg-green-400';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Fraca';
      case 'medium': return 'Média';
      case 'strong': return 'Forte';
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Criar sua conta
        </h2>
        <p className="text-slate-600 text-sm sm:text-base">
          Comece sua jornada de transformação hoje mesmo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm sm:text-base transition-all duration-300"
              placeholder="Digite seu nome"
              required
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Endereço de Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm sm:text-base transition-all duration-300"
              placeholder="Digite seu email"
              required
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Data de nascimento
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => handleInputChange('birthdate', e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm sm:text-base transition-all duration-300"
              required
            />
          </div>
          {errors.birthdate && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.birthdate}
            </p>
          )}
        </div>

        {/* Peso e Altura (opcionais) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Peso (kg) - opcional
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm transition-all duration-300"
                placeholder="70"
              />
            </div>
            {errors.weight && (
              <p className="text-red-600 text-xs mt-1">{errors.weight}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Altura (cm) - opcional
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm transition-all duration-300"
                placeholder="170"
              />
            </div>
            {errors.height && (
              <p className="text-red-600 text-xs mt-1">{errors.height}</p>
            )}
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm sm:text-base transition-all duration-300"
              placeholder="Digite sua senha"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }}
                  />
                </div>
                <span className="text-slate-600">{getPasswordStrengthText()}</span>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirmar Senha */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm sm:text-base transition-all duration-300"
              placeholder="Confirme sua senha"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* General error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Criando conta...
              </div>
            ) : (
              'Criar conta'
            )}
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base border border-slate-200"
          >
            Já tem uma conta? Fazer login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
