import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Configurações</h1>
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl flex items-center justify-between">
        <span className="font-medium text-slate-800 dark:text-slate-200">
          Tema {theme === 'dark' ? 'Escuro' : 'Claro'}
        </span>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Alternar para {theme === 'dark' ? 'Claro' : 'Escuro'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
