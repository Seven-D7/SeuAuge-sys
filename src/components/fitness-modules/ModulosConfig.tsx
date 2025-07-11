import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load fitness modules
const EmagrecimentoAvancado = lazy(() => import('./EmagrecimentoAvancado'));

const ModulosConfig: React.FC = () => {
  return (
    <div className="fitness-modules">
      <Suspense fallback={<div className="loading">Carregando módulo...</div>}>
        <Routes>
          <Route path="/emagrecimento-avancado" element={<EmagrecimentoAvancado />} />
          {/* Add more fitness module routes here */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default ModulosConfig;