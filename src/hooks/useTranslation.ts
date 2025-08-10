import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const { t, language, setLanguage } = useLanguage();
  
  // Helper para formatação de dados/horários baseado no idioma
  const formatDate = (date: Date) => {
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return date.toLocaleDateString(locale);
  };
  
  const formatTime = (date: Date) => {
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return date.toLocaleTimeString(locale, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const formatDateTime = (date: Date) => {
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return date.toLocaleString(locale);
  };
  
  // Helper para números formatados
  const formatNumber = (num: number) => {
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return num.toLocaleString(locale);
  };
  
  // Helper para moeda (BRL)
  const formatCurrency = (amount: number) => {
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    const currency = 'BRL'; // Sempre BRL pois é app brasileiro
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  return {
    t,
    language,
    setLanguage,
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    formatCurrency,
    isEnglish: language === 'en',
    isPortuguese: language === 'pt'
  };
};

export default useTranslation;
