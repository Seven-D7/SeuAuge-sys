import React, { useMemo, useState } from 'react';
import { Play, PlusCircle, FileText, ShoppingCart } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data defined locally for videos and products
const mockVideos = [
  { id: 1, title: 'Treino para Emagrecimento', tags: ['emagrecimento'], category: 'Fitness' },
  { id: 2, title: 'Dicas de Alimentação', tags: ['emagrecimento'], category: 'Saúde' },
  { id: 3, title: 'Meditação para Controle de Peso', tags: ['emagrecimento'], category: 'Fitness' }
];

const mockProducts = [
  { id: 1, name: 'Chá Verde Detox', price: '29,90', tags: ['emagrecimento'], category: 'Suplementos' },
  { id: 2, name: 'Suplemento Termogênico', price: '79,90', tags: ['emagrecimento'], category: 'Suplementos' },
  { id: 3, name: 'Vitamina C', price: '39,90', tags: ['emagrecimento'], category: 'Vitaminas' }
];

// Mock WeightChart component
type WeightChartProps = {
  data: { date: string; weight: number }[];
};
const WeightChart: React.FC<WeightChartProps> = () => (
  <div className="bg-white border border-green-200 p-4 rounded-xl text-center">Gráfico de Evolução (Mock)</div>
);

const Emagrecimento: React.FC = () => {
  const initialData = {
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

  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<{ date: string; weight: number; }[]>([]);
  const [newWeight, setNewWeight] = useState('');

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
    const entry = {
      date: new Date().toLocaleDateString(),
      weight: data.currentWeight,
    };
    setHistory([entry]);
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

  const recommendedVideos = useMemo(() => {
    let vids = mockVideos.filter((v) => v.tags?.includes('emagrecimento'));
    if (data.frequency > 4) {
      vids = vids.filter((v) => v.category === 'Fitness');
    }
    return vids.slice(0, 3);
  }, [data.frequency]);

  const recommendedProducts = useMemo(() => {
    let products = mockProducts.filter((p) => p.tags?.includes('emagrecimento'));
    if (imc > 30) {
      products = products.filter((p) => p.category !== 'Vitaminas');
    }
    return products.slice(0, 3);
  }, [imc]);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-700">Seu Plano Personalizado de Emagrecimento</h1>
        <p className="text-lg text-gray-600">Planeje, acompanhe e conquiste seus objetivos com um acompanhamento completo.</p>
      </header>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {['height', 'currentWeight', 'targetWeight', 'goalTime', 'frequency'].map((field, idx) => (
            <label key={idx} className="flex flex-col space-y-2">
              <span className="font-medium">
                {field === 'height' && 'Altura (cm)'}
                {field === 'currentWeight' && 'Peso atual (kg)'}
                {field === 'targetWeight' && 'Peso desejado (kg)'}
                {field === 'goalTime' && 'Tempo objetivo (semanas)'}
                {field === 'frequency' && 'Frequência de atividade física (dias/semana)'}
              </span>
              <input
                name={field}
                type="number"
                className="bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                value={data[field as keyof typeof data] as number}
                onChange={handleChange}
              />
            </label>
          ))}

          <label className="flex flex-col space-y-2">
            <span className="font-medium">Resultados de bioimpedância</span>
            <input
              name="impedance"
              type="text"
              className="bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              value={data.impedance}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col space-y-2">
            <span className="font-medium">Preferências alimentares</span>
            <select
              name="diet"
              className="bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              value={data.diet}
              onChange={handleChange}
            >
              {diets.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col md:col-span-2 space-y-2">
            <span className="font-medium">Restrições médicas</span>
            <textarea
              name="medicalNotes"
              className="bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              value={data.medicalNotes}
              onChange={handleChange}
            />
          </label>

          <div className="md:col-span-2 text-lg font-medium">IMC: {imc.toFixed(1)}</div>

          <button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 transition p-3 rounded-xl font-semibold flex items-center justify-center space-x-2">
            <FileText className="w-5 h-5" /> <span>Calcular Plano</span>
          </button>
        </form>
      ) : (
        <div className="space-y-10 max-w-6xl mx-auto" id="result-area">
          <div className="bg-green-50 p-6 rounded-2xl space-y-4 border border-green-200">
            <h2 className="text-2xl font-bold text-green-700">Resumo do Plano</h2>
            <p>
              Você precisa de aproximadamente <span className="font-semibold text-green-700">{data.goalTime} semanas</span> para atingir seu objetivo, consumindo <span className="font-semibold text-green-700">{dailyDeficit} calorias a menos por dia</span> com <span className="font-semibold text-green-700">{data.frequency} treinos semanais</span>.
            </p>
            <p>Peso ideal estimado: <span className="font-semibold text-green-700">{idealWeight.toFixed(1)} kg</span></p>
          </div>

          {history.length > 0 && (
            <div className="bg-green-50 p-6 rounded-2xl space-y-4 border border-green-200">
              <h3 className="text-xl font-semibold text-green-700">Evolução do Peso</h3>
              <WeightChart data={history} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
            <label className="flex flex-col flex-1 space-y-2">
              <span className="text-sm">Nova pesagem (kg)</span>
              <input
                type="number"
                className="bg-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Ex: 70"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 transition p-3 rounded-xl font-semibold flex items-center space-x-2"
              onClick={() => {
                const weight = parseFloat(newWeight);
                if (!isNaN(weight)) {
                  setHistory((prev) => [...prev, { date: new Date().toLocaleDateString(), weight }]);
                  setNewWeight('');
                }
              }}
            >
              <PlusCircle className="w-5 h-5" /> <span>Registrar</span>
            </button>

            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 transition p-3 rounded-xl font-semibold flex items-center space-x-2"
              onClick={async () => {
                const element = document.getElementById('result-area');
                if (!element) return;
                const canvas = await html2canvas(element);
                const pdf = new jsPDF();
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('plano-emagrecimento.pdf');
              }}
            >
              <FileText className="w-5 h-5" /> <span>Gerar PDF</span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Vídeos Recomendados</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedVideos.map(video => (
                <li key={video.id} className="bg-gray-100 p-4 rounded-xl flex items-center justify-between">
                  <p className="font-medium">{video.title}</p>
                  <button className="flex items-center space-x-1 text-green-600 font-semibold">
                    <Play className="w-4 h-4" /> <span>Assistir</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Produtos Recomendados</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedProducts.map(product => (
                <li key={product.id} className="bg-gray-100 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-1">{product.name}</p>
                    <span className="text-green-700 font-semibold">R$ {product.price}</span>
                  </div>
                  <button className="flex items-center space-x-1 text-green-600 font-semibold">
                    <ShoppingCart className="w-4 h-4" /> <span>Adicionar</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Checklist Diário</h3>
            <ul className="space-y-2">
              {['Refeições concluídas', 'Treino realizado', '2L de água'].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 accent-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emagrecimento;
