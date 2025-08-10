import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

const TranslationDemo: React.FC = () => {
  const { t, language, formatDate, formatCurrency, isEnglish } = useTranslation();

  const demoData = {
    date: new Date(),
    price: 97.50,
    level: 15,
    xp: 2350
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-slate-900">
            {t('common.language')} - Demo
          </h3>
        </div>
        <LanguageSelector variant="discrete" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auth Translations */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-700 mb-2">
              {isEnglish ? 'Authentication' : 'Autenticação'}
            </h4>
            <div className="space-y-1 text-sm">
              <p>✓ {t('auth.welcome_back')}</p>
              <p>✓ {t('auth.email_address')}</p>
              <p>✓ {t('auth.password')}</p>
              <p>✓ {t('auth.sign_in')}</p>
            </div>
          </div>

          {/* Dashboard Translations */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-700 mb-2">Dashboard</h4>
            <div className="space-y-1 text-sm">
              <p>✓ {t('dashboard.good_morning')}</p>
              <p>✓ {t('dashboard.level')}: {demoData.level}</p>
              <p>✓ {t('dashboard.xp')}: {demoData.xp}</p>
              <p>✓ {t('dashboard.achievements')}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-700 mb-2">
              {isEnglish ? 'Navigation' : 'Navegação'}
            </h4>
            <div className="space-y-1 text-sm">
              <p>✓ {t('navigation.dashboard')}</p>
              <p>✓ {t('navigation.achievements')}</p>
              <p>✓ {t('navigation.plans')}</p>
              <p>✓ {t('navigation.profile')}</p>
            </div>
          </div>

          {/* Formatting Examples */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-700 mb-2">
              {isEnglish ? 'Formatting' : 'Formatação'}
            </h4>
            <div className="space-y-1 text-sm">
              <p>📅 {formatDate(demoData.date)}</p>
              <p>💰 {formatCurrency(demoData.price)}</p>
              <p>🌍 {t('common.language')}: {language.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">
            {isEnglish 
              ? `Internationalization system working! Current language: ${language}`
              : `Sistema de internacionalização funcionando! Idioma atual: ${language}`
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TranslationDemo;
