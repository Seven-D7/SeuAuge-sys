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

// Initialize Sentry only if DSN is provided
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // Lower sample rate in production
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
    throw new Error('Production requirements not met. Check console for details.');
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
