import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { TrendingUp, CheckCircle, Shield, Zap } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage = () => {
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode') || 'login';

  const [authMode, setAuthMode] = React.useState<'login' | 'register'>(mode as 'login' | 'register');

  const toggleMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  const features = [
    {
      icon: CheckCircle,
      title: "Conteúdo Premium",
      description: "Acesso a vídeos, treinos e orientação nutricional especializada"
    },
    {
      icon: Shield,
      title: "Seguro & Confiável",
      description: "Seus dados estão protegidos com criptografia de ponta"
    },
    {
      icon: Zap,
      title: "Resultados Rápidos",
      description: "Metodologia comprovada para transformar sua saúde"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Lado esquerdo - Hero section com cores da paleta */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary via-emerald-500 to-emerald-600 text-white flex items-center justify-center p-6 sm:p-8 min-h-[40vh] lg:min-h-screen relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />
        
        <div className="relative z-10 text-center max-w-md space-y-6 lg:space-y-8">
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-white">
              Transforme Sua Jornada de
              <br />
              <span className="text-emerald-100">Saúde e Bem-estar</span>
            </h1>
          </motion.div>

          {/* Descrição */}
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-50 text-base sm:text-lg leading-relaxed"
          >
            Acesse conteúdo premium de bem-estar, orientação nutricional especializada e uma loja de produtos de saúde selecionados.
          </motion.p>

          {/* Features */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-3 text-left"
              >
                <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                  <p className="text-emerald-100 text-xs">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10k+</div>
              <div className="text-xs text-emerald-100">Usuários</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-emerald-100">Vídeos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-xs text-emerald-100">Satisfação</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lado direito - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          {authMode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
