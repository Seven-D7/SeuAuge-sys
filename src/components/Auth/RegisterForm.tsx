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
      newErrors.email = 'Email inválido';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0] || 'Senha inválida';
    }

    // Confirm password validation
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
      
      if (age < 13) {
        newErrors.birthdate = 'Idade mínima é 13 anos';
      } else if (age > 120) {
        newErrors.birthdate = 'Data de nascimento inválida';
      }
    }

    // Weight validation
    const weight = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weight) || weight < 20 || weight > 500) {
      newErrors.weight = 'Peso deve estar entre 20kg e 500kg';
    }

    // Height validation
    const height = parseFloat(formData.height);
    if (!formData.height || isNaN(height) || height < 50 || height > 250) {
      newErrors.height = 'Altura deve estar entre 50cm e 250cm';
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
        email: sanitizeInput(formData.email.toLowerCase()),
        password: formData.password, // Don't sanitize password
        birthdate: formData.birthdate,
      };

      await register(
        sanitizedData.email,
        sanitizedData.password,
        sanitizedData.name,
        sanitizedData.birthdate
      );

      // Navigate to preferences setup after successful registration
      navigate('/preferences');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      setErrors({ general: error.message || 'Erro no registro. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'strong': return 'Forte';
      case 'medium': return 'Média';
      default: return 'Fraca';
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Criar conta
        </h2>
        <p className="text-white/70 text-sm sm:text-base">
          Comece sua jornada de transformação hoje
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm sm:text-base transition-all duration-300 ${
                errors.name ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Digite seu nome completo"
              required
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm sm:text-base transition-all duration-300 ${
                errors.email ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Digite seu email"
              required
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm sm:text-base transition-all duration-300 ${
                errors.password ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Crie uma senha segura"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-full h-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ 
                      width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' 
                    }}
                  />
                </div>
                <span className="text-xs text-white/70">{getPasswordStrengthText()}</span>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm sm:text-base transition-all duration-300 ${
                errors.confirmPassword ? 'border-red-500/50' : 'border-white/20'
              }`}
              placeholder="Confirme sua senha"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Birthdate */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Nascimento
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="date"
                value={formData.birthdate}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm transition-all duration-300 ${
                  errors.birthdate ? 'border-red-500/50' : 'border-white/20'
                }`}
                required
              />
            </div>
            {errors.birthdate && (
              <p className="mt-1 text-red-400 text-xs">
                {errors.birthdate}
              </p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Peso (kg)
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm transition-all duration-300 ${
                  errors.weight ? 'border-red-500/50' : 'border-white/20'
                }`}
                placeholder="70"
                min="20"
                max="500"
                required
              />
            </div>
            {errors.weight && (
              <p className="mt-1 text-red-400 text-xs">
                {errors.weight}
              </p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Altura (cm)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm transition-all duration-300 ${
                  errors.height ? 'border-red-500/50' : 'border-white/20'
                }`}
                placeholder="170"
                min="50"
                max="250"
                required
              />
            </div>
            {errors.height && (
              <p className="mt-1 text-red-400 text-xs">
                {errors.height}
              </p>
            )}
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] transform hover:scale-105 shadow-lg backdrop-blur-sm border border-teal-400/30"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-white/70 text-sm sm:text-base">
          Já tem uma conta?{' '}
          <button
            onClick={onToggleMode}
            className="text-teal-300 hover:text-teal-200 font-medium transition-colors"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
