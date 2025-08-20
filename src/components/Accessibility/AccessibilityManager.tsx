import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  MousePointer, 
  Type, 
  Contrast,
  Settings,
  Accessibility,
  Languages
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  audioFeedback: boolean;
  colorBlindFriendly: boolean;
  focusIndicator: boolean;
  language: string;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean | string) => void;
  announceToScreenReader: (message: string) => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  audioFeedback: false,
  colorBlindFriendly: false,
  focusIndicator: true,
  language: 'pt-BR',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityManagerProps {
  children: React.ReactNode;
}

const AccessibilityManager: React.FC<AccessibilityManagerProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }

    // Check for system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }

    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  // Save settings to localStorage and apply CSS classes
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    const root = document.documentElement;
    
    // Apply CSS classes based on settings
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    root.classList.toggle('screen-reader-mode', settings.screenReaderMode);
    root.classList.toggle('colorblind-friendly', settings.colorBlindFriendly);
    root.classList.toggle('enhanced-focus', settings.focusIndicator);

    // Update language
    root.lang = settings.language;
  }, [settings]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Add custom keyboard shortcuts
      if (e.altKey) {
        switch (e.key) {
          case 'a':
            e.preventDefault();
            setIsSettingsOpen(true);
            announceToScreenReader('Painel de acessibilidade aberto');
            break;
          case 's':
            e.preventDefault();
            const skipLink = document.querySelector('[data-skip-link]') as HTMLElement;
            skipLink?.focus();
            break;
          case 'h':
            e.preventDefault();
            const homeLink = document.querySelector('[href="/"]') as HTMLElement;
            homeLink?.click();
            break;
        }
      }

      // Enhanced tab navigation
      if (e.key === 'Tab') {
        const focusable = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusable.length > 0) {
          // Add visual focus indicator for keyboard users
          document.body.classList.add('keyboard-navigation');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation]);

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    
    // Audio feedback if enabled
    if (settings.audioFeedback) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = settings.language;
      speechSynthesis.speak(utterance);
    }

    // Clear announcement after 5 seconds
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(msg => msg !== message));
    }, 5000);
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Announce changes to screen reader
    const settingNames = {
      highContrast: 'Alto contraste',
      largeText: 'Texto grande',
      reducedMotion: 'Movimento reduzido',
      screenReaderMode: 'Modo leitor de tela',
      keyboardNavigation: 'Navegação por teclado',
      audioFeedback: 'Feedback de áudio',
      colorBlindFriendly: 'Amigável para daltonismo',
      focusIndicator: 'Indicador de foco',
      language: 'Idioma',
    };
    
    const settingName = settingNames[key];
    const status = typeof value === 'boolean' ? (value ? 'ativado' : 'desativado') : `alterado para ${value}`;
    announceToScreenReader(`${settingName} ${status}`);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Quick access toolbar
  const QuickAccessToolbar = () => (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg px-4 py-2 z-50 border-x border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Acesso Rápido:
        </span>
        
        <button
          onClick={() => updateSetting('highContrast', !settings.highContrast)}
          className={`p-2 rounded ${settings.highContrast ? 'bg-yellow-500 text-black' : 'bg-gray-200 dark:bg-gray-700'}`}
          title="Alternar alto contraste (Alt + C)"
          aria-label="Alternar alto contraste"
        >
          <Contrast className="w-4 h-4" />
        </button>

        <button
          onClick={() => updateSetting('largeText', !settings.largeText)}
          className={`p-2 rounded ${settings.largeText ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          title="Alternar texto grande (Alt + T)"
          aria-label="Alternar texto grande"
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          onClick={() => updateSetting('audioFeedback', !settings.audioFeedback)}
          className={`p-2 rounded ${settings.audioFeedback ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          title="Alternar feedback de áudio (Alt + A)"
          aria-label="Alternar feedback de áudio"
        >
          {settings.audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleSettings}
          className="p-2 bg-primary text-white rounded"
          title="Abrir configurações de acessibilidade (Alt + S)"
          aria-label="Abrir configurações de acessibilidade"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  // Settings panel
  const SettingsPanel = () => (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Accessibility className="w-6 h-6" />
                Acessibilidade
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(settings).map(([key, value]) => {
                if (key === 'language') return null;
                
                const settingConfig = {
                  highContrast: { label: 'Alto Contraste', icon: Contrast },
                  largeText: { label: 'Texto Grande', icon: Type },
                  reducedMotion: { label: 'Movimento Reduzido', icon: MousePointer },
                  screenReaderMode: { label: 'Modo Leitor de Tela', icon: Eye },
                  keyboardNavigation: { label: 'Navegação por Teclado', icon: Keyboard },
                  audioFeedback: { label: 'Feedback de Áudio', icon: Volume2 },
                  colorBlindFriendly: { label: 'Amigável para Daltonismo', icon: Eye },
                  focusIndicator: { label: 'Indicador de Foco Aprimorado', icon: MousePointer },
                }[key];

                if (!settingConfig) return null;

                const Icon = settingConfig.icon;

                return (
                  <div key={key} className="flex items-center justify-between">
                    <label className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{settingConfig.label}</span>
                    </label>
                    <button
                      onClick={() => updateSetting(key as keyof AccessibilitySettings, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      role="switch"
                      aria-checked={value as boolean}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}

              {/* Language selector */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Idioma</span>
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-1"
                >
                  <option value="pt-BR">Português</option>
                  <option value="en-US">English</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Screen reader announcements
  const ScreenReaderAnnouncements = () => (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {announcements.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );

  // Skip link for keyboard navigation
  const SkipLink = () => (
    <a
      href="#main-content"
      data-skip-link
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded z-50"
    >
      Pular para o conteúdo principal
    </a>
  );

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        announceToScreenReader,
        isSettingsOpen,
        toggleSettings,
      }}
    >
      <SkipLink />
      <QuickAccessToolbar />
      {children}
      <SettingsPanel />
      <ScreenReaderAnnouncements />
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityManager;
