import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';
import './index.css';
import './styles/animations.css';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { logEnvironmentStatus, checkProductionReadiness } from './lib/environment';

// Debug das variáveis importantes (Firebase principal)
console.log("DEBUG - Firebase Project:", import.meta.env.VITE_FIREBASE_PROJECT_ID || "(não definida)");
console.log("DEBUG - Firebase Auth:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "(definida)" : "(não definida)");

// Initialize Sentry only if DSN is provided
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    environment: import.meta.env.PROD ? 'production' : 'development',
  });
}

// Check production readiness and log environment status
logEnvironmentStatus();

// Prevent app start if production requirements not met
if (import.meta.env.PROD) {
  const readiness = checkProductionReadiness();
  
  if (!readiness.ready) {
    console.error('🚨 Application cannot start in production mode:');
    readiness.issues.forEach(issue => console.error(`  - ${issue}`));

    // Evita crash total no local build: apenas avisa
    if (import.meta.env.MODE === 'production' && process.env.FIREBASE_DEPLOY) {
      throw new Error('Production requirements not met. Check console for details.');
    } else {
      console.warn("⚠️ Ignorando bloqueio de produção (modo debug/local).");
    }
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
// Log de inicialização
console.log('🚀 Aplicação iniciada com sucesso!');
