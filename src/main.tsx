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

// Check production readiness and log warnings
const readiness = checkProductionReadiness();
if (!readiness.ready) {
  console.warn('⚠️ Production readiness issues detected:');
  readiness.issues.forEach(issue => console.warn(`  - ${issue}`));
  console.warn('ℹ️ The application will continue but some features may not work correctly.');
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
