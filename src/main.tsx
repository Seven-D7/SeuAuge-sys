import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';
import './index.css';
import './styles/animations.css';
import './styles/mobile.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

// Session cleanup on page load
const cleanupStaleSession = async () => {
  try {
    // Check if we have a valid session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      // Clear any stale data if no valid session
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('supabase.') || 
            key.startsWith('sb-') || 
            key.includes('auth') ||
            key.includes('session')) {
          localStorage.removeItem(key);
        }
      });
      console.log('Cleared stale session data');
    }
  } catch (error) {
    console.warn('Error during session cleanup:', error);
  }
};

// Detect if running in Capacitor
const isCapacitor = !!(window as any).Capacitor;

// Add Capacitor class to body for styling
if (isCapacitor) {
  document.body.classList.add('capacitor-app');
}

// Mobile optimizations
if (window.innerWidth <= 768) {
  document.body.classList.add('mobile-device');
}

// Add viewport meta tag if not present (for Capacitor)
if (!document.querySelector('meta[name="viewport"]')) {
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  document.head.appendChild(viewport);
}

// Debug das variáveis importantes (Supabase)
console.log("DEBUG - Supabase URL:", import.meta.env.VITE_SUPABASE_URL ? "(definida)" : "(não definida)");
console.log("DEBUG - Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "(definida)" : "(não definida)");
console.log("DEBUG - Capacitor:", isCapacitor ? "Ativo" : "Web");

// Initialize Sentry only if DSN is provided
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    environment: import.meta.env.PROD ? 'production' : 'development',
    beforeSend(event) {
      // Filter out network errors in Capacitor
      if (isCapacitor && event.exception?.values?.[0]?.value?.includes('NetworkError')) {
        return null;
      }
      return event;
    },
  });
}

// Check Supabase configuration in production
if (import.meta.env.PROD) {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('🚨 Supabase configuration missing in production:');
    if (!import.meta.env.VITE_SUPABASE_URL) console.error('  - VITE_SUPABASE_URL not set');
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) console.error('  - VITE_SUPABASE_ANON_KEY not set');
    throw new Error('Supabase configuration required for production');
  }
}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  // Force layout recalculation after orientation change
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
});

// Handle network status changes
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  console.log('🌐 Conexão restaurada');
  
  // Validate session when coming back online
  if (window.location.pathname !== '/auth') {
    cleanupStaleSession();
  }
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
  console.log('📵 Sem conexão');
});

// Cleanup stale session on page load
cleanupStaleSession();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Log de inicialização
console.log('🚀 Aplicação iniciada!', {
  supabase: import.meta.env.VITE_SUPABASE_URL ? 'Configurado' : 'Não configurado',
  capacitor: isCapacitor,
  mobile: window.innerWidth <= 768,
  online: navigator.onLine
});
