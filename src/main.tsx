import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/Home'; // Perfeito
import './index.css'; // Perfeito
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
