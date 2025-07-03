import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightChartProps {
  data: WeightEntry[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: 'Peso (kg)',
        data: data.map((entry) => entry.weight),
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.3)',
        tension: 0.4,
      },
    ],
  };

  return <Line data={chartData} />;
};

export type { WeightEntry };
export default WeightChart;
