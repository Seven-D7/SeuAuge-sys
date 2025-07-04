import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useProgressStore } from '../stores/progressStore';
import Report from '../components/Report';

const Progress: React.FC = () => {
  const { weightLoss, metrics, reportData } = useProgressStore();
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <TrendingUp className="w-8 h-8 text-teal-500" />
        <h1 className="text-3xl font-bold text-white">Meu Progresso</h1>
      </div>

      {weightLoss && (
        <section className="bg-slate-800 rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white">Emagrecendo bem</h2>
          <p className="text-slate-400">
            Objetivo: {weightLoss.targetWeight}kg em {weightLoss.goalTime} semanas
          </p>
          <p className="text-slate-400">IMC atual: {weightLoss.imc.toFixed(1)} ({weightLoss.classificacaoImc})</p>
          <p className="text-slate-400">Peso ideal: {weightLoss.idealWeight.toFixed(1)}kg</p>
          <p className="text-slate-400">Déficit diário sugerido: {weightLoss.dailyDeficit} kcal</p>
          <button
            onClick={() => setShowReport(true)}
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            Ver minhas metas
          </button>
        </section>
      )}

      <section className="bg-slate-800 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Composição Corporal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-300">
          <div>
            <span className="font-medium text-white">Peso Corporal:</span> {metrics.totalWeight}kg
          </div>
          <div>
            <span className="font-medium text-white">IMC:</span> {metrics.bmi}
          </div>
          <div>
            <span className="font-medium text-white">Água Corporal Total:</span> {metrics.totalBodyWater}L
          </div>
          <div>
            <span className="font-medium text-white">Água Intracelular:</span> {metrics.intracellularWater}L
          </div>
          <div>
            <span className="font-medium text-white">Água Extracelular:</span> {metrics.extracellularWater}L
          </div>
          <div>
            <span className="font-medium text-white">Massa Magra:</span> {metrics.leanMass}kg
          </div>
          <div>
            <span className="font-medium text-white">Massa Muscular Esquelética:</span> {metrics.skeletalMuscleMass}kg
          </div>
          <div>
            <span className="font-medium text-white">Massa de Gordura:</span> {metrics.bodyFatMass}kg
          </div>
          <div>
            <span className="font-medium text-white">% Gordura Corporal:</span> {metrics.bodyFatPercent}%
          </div>
          <div>
            <span className="font-medium text-white">Gordura Braços:</span> {metrics.fatArms}%
          </div>
          <div>
            <span className="font-medium text-white">Gordura Tronco:</span> {metrics.fatTrunk}%
          </div>
          <div>
            <span className="font-medium text-white">Gordura Pernas:</span> {metrics.fatLegs}%
          </div>
          <div>
            <span className="font-medium text-white">Massa Óssea:</span> {metrics.boneMass}kg
          </div>
          <div>
            <span className="font-medium text-white">TMB:</span> {weightLoss?.tmb ?? metrics.bmr} kcal
          </div>
          <div>
            <span className="font-medium text-white">Calorias Diárias:</span> {weightLoss?.caloriasDiarias ?? 0} kcal
          </div>
          <div>
            <span className="font-medium text-white">Relação ECW/ICW:</span> {metrics.ecwIcwRatio}
          </div>
          <div>
            <span className="font-medium text-white">Equilíbrio Muscular:</span> {metrics.muscleSymmetry}%
          </div>
        </div>
      </section>
      {showReport && weightLoss && (
        <div className="fixed inset-0 z-10 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-y-auto max-h-full">
            <Report data={reportData} onBack={() => setShowReport(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
