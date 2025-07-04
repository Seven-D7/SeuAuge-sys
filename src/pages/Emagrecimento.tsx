import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Questionnaire from '../components/Questionnaire';
import { useProgressStore } from '../stores/progressStore';

const Emagrecimento: React.FC = () => {
  const navigate = useNavigate();
  const { setWeightLoss, setReportData } = useProgressStore();
  const [completed, setCompleted] = useState(false);

  const handleComplete = (data: any) => {
    const step1 = data.step1 || {};
    const metrics = data;
    const alturaM = (step1.altura || 0) / 100;
    const idealWeight = alturaM ? 22 * alturaM * alturaM : 0;

    setWeightLoss({
      height: step1.altura || 0,
      currentWeight: step1.peso_atual || 0,
      targetWeight: step1.peso_objetivo || 0,
      goalTime: step1.prazo || 0,
      frequency: Array.isArray(data.step3?.horarios_exercicio)
        ? data.step3.horarios_exercicio.length
        : 0,
      diet: data.step5?.preferencias_alimentares || 'onivoro',
      imc: metrics.imc,
      idealWeight,
      dailyDeficit: metrics.deficit_calorico,
      classificacaoImc: metrics.classificacao_imc,
      tmb: metrics.tmb,
      gastoEnergetico: metrics.gasto_energetico,
      caloriasDiarias: metrics.calorias_diarias,
      perdaSemanal: metrics.perda_semanal,
      tempoEstimado: metrics.tempo_estimado,
    });

    setReportData(data);

    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-3xl font-bold text-white text-center">
          Questionário concluído!
        </h1>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium"
          onClick={() => navigate('/progress')}
        >
          Ver resultado
        </button>
      </div>
    );
  }

  return <Questionnaire onComplete={handleComplete} />;
};

export default Emagrecimento;
