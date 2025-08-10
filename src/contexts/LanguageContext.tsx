import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
};

// Carregar traduções dinamicamente
const loadTranslations = async (lang: Language) => {
  try {
    const translations = await import(`../locales/${lang}.json`);
    return translations.default;
  } catch (error) {
    console.warn(`Erro ao carregar traduções para ${lang}, usando português como fallback`);
    const fallback = await import('../locales/pt.json');
    return fallback.default;
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Recuperar idioma salvo no localStorage
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['pt', 'en'].includes(saved)) {
      return saved;
    }
    
    // Detectar idioma do browser
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      return 'en';
    }
    
    return 'pt'; // Padrão português
  });
  
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Carregar traduções quando o idioma mudar
  useEffect(() => {
    const loadLangTranslations = async () => {
      const trans = await loadTranslations(language);
      setTranslations(trans);
    };
    
    loadLangTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Função de tradução com suporte a nested keys
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback: retornar a chave se não encontrar tradução
        console.warn(`Tradução não encontrada para: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
