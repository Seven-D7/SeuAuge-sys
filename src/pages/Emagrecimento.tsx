import React, { useMemo, useState } from 'react';
import { mockVideos, mockProducts } from '../data/mockData';
import type { Product } from '../stores/cartStore';
import type { Video } from '../stores/favoritesStore';

interface FormData {
  height: number;
  currentWeight: number;
  targetWeight: number;
  goalTime: number;
  frequency: number;
  impedance?: string;
  diet: string;
  medicalNotes?: string;
}

const initialData: FormData = {
  height: 0,
  currentWeight: 0,
  targetWeight: 0,
  goalTime: 0,
  frequency: 3,
  impedance: '',
  diet: 'sem-restricao',
  medicalNotes: ''
};

const diets = [
  { value: 'sem-restricao', label: 'Sem Restrição' },
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'vegano', label: 'Vegano' }
];

const Emagrecimento: React.FC = () => {
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const imc = useMemo(() => {
    if (!data.height || !data.currentWeight) return 0;
    return data.currentWeight / ((data.height / 100) ** 2);
  }, [data.height, data.currentWeight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const idealWeight = useMemo(() => {
    if (!data.height) return 0;
    return 22 * ((data.height / 100) ** 2);
  }, [data.height]);

  const dailyDeficit = useMemo(() => {
    if (!data.goalTime) return 0;
    const diff = data.currentWeight - data.targetWeight;
    const days = data.goalTime * 7;
    return diff > 0 ? Math.round(((diff * 7700) / days)) : 0;
  }, [data.currentWeight, data.targetWeight, data.goalTime]);

  const recommendedVideos: Video[] = useMemo(() => {
    return mockVideos.filter(v => v.tags?.includes('emagrecimento')).slice(0, 3);
  }, []);

  const recommendedProducts: Product[] = useMemo(() => {
    return mockProducts.filter(p => p.tags?.includes('emagrecimento')).slice(0, 3);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ferramenta de Emagrecimento</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span>Altura (cm)</span>
              <input
                name="height"
                type="number"
                className="input"
                value={data.height}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              <span>Peso atual (kg)</span>
              <input
                name="currentWeight"
                type="number"
                className="input"
                value={data.currentWeight}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              <span>Peso desejado (kg)</span>
              <input
                name="targetWeight"
                type="number"
                className="input"
                value={data.targetWeight}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              <span>Tempo objetivo (semanas)</span>
              <input
                name="goalTime"
                type="number"
                className="input"
                value={data.goalTime}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              <span>Frequência de atividade física (dias/semana)</span>
              <input
                name="frequency"
                type="number"
                className="input"
                value={data.frequency}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              <span>Resultados de bioimpedância</span>
              <input
                name="impedance"
                type="text"
                className="input"
                value={data.impedance}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              <span>Preferências alimentares</span>
              <select
                name="diet"
                className="input"
                value={data.diet}
                onChange={handleChange}
              >
                {diets.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col">
            <span>Restrições médicas</span>
            <textarea
              name="medicalNotes"
              className="input"
              value={data.medicalNotes}
              onChange={handleChange}
            />
          </label>
          <div className="mt-4">
            <span className="font-medium">IMC: {imc.toFixed(1)}</span>
          </div>
          <button type="submit" className="btn-primary mt-4">Calcular Plano</button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-lg space-y-2">
            <h2 className="text-xl font-semibold">Resumo do Plano</h2>
            <p>
              Para atingir seu peso objetivo, você precisa de aproximadamente {data.goalTime} semanas,
              com um consumo diário de {dailyDeficit} calorias a menos e {data.frequency} treinos por semana.
            </p>
            <p>Peso ideal estimado: {idealWeight.toFixed(1)} kg</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Vídeos Recomendados</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedVideos.map(video => (
                <li key={video.id} className="bg-slate-800 p-3 rounded-lg">
                  <p className="font-medium">{video.title}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Produtos Recomendados</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedProducts.map(product => (
                <li key={product.id} className="bg-slate-800 p-3 rounded-lg">
                  <p className="font-medium">{product.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Checklist Diário</h3>
            <ul className="space-y-2">
              <li><label className="flex items-center space-x-2"><input type="checkbox"/> <span>Refeições concluídas</span></label></li>
              <li><label className="flex items-center space-x-2"><input type="checkbox"/> <span>Treino realizado</span></label></li>
              <li><label className="flex items-center space-x-2"><input type="checkbox"/> <span>2L de água</span></label></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emagrecimento;
