import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';
import './index.css';
import './styles/animations.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

// Debug das variáveis importantes (Supabase)
console.log("DEBUG - Supabase URL:", import.meta.env.VITE_SUPABASE_URL ? "(definida)" : "(não definida)");
console.log("DEBUG - Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "(definida)" : "(não definida)");

// Initialize Sentry only if DSN is provided
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    environment: import.meta.env.PROD ? 'production' : 'development',
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
console.log('🚀 Aplicação iniciada com Supabase!');
