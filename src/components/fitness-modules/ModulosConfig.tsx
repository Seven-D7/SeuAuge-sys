import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load fitness modules
const EmagrecimentoAvancado = lazy(() => import("./EmagrecimentoAvancado"));
const GanhoMassa = lazy(() => import("./GanhoMassa"));
const RecomposicaoCorporal = lazy(() => import("./RecomposicaoCorporal"));
const PerformanceAtletica = lazy(() => import("./PerformanceAtletica"));
const FlexibilidadeMobilidade = lazy(() => import("./FlexibilidadeMobilidade"));
const CorridaAvancada = lazy(() => import("./CorridaAvancada"));

const ModulosConfig: React.FC = () => {
  return (
    <div className="fitness-modules">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Carregando módulo fitness...
              </p>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/emagrecimento" element={<EmagrecimentoAvancado />} />
          <Route
            path="/emagrecimento-avancado"
            element={<EmagrecimentoAvancado />}
          />
          <Route path="/ganho-massa" element={<GanhoMassa />} />
          <Route path="/recomposicao" element={<RecomposicaoCorporal />} />
          <Route path="/performance" element={<PerformanceAtletica />} />
          <Route path="/flexibilidade" element={<FlexibilidadeMobilidade />} />
          {/* Rota padrão - redireciona para emagrecimento */}
          <Route path="/*" element={<EmagrecimentoAvancado />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default ModulosConfig;
