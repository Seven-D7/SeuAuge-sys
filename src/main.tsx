import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/custom.css';
import SimpleDemo from './SimpleDemo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleDemo />
  </StrictMode>,
);

