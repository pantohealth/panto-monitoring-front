import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface UserActivityGraphProps {
  data: number[];
  labels: string[];
  type: 'clicks' | 'online';
}

export function UserActivityGraph({ data, labels, type }: UserActivityGraphProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: type === 'clicks' ? 'Click Rate' : 'Online Rate',
        data,
        borderColor: type === 'clicks' ? '#F59E0B' : '#3B82F6',
        backgroundColor: type === 'clicks' ? '#FEF3C7' : '#DBEAFE',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-[60px]">
      <Line data={chartData} options={options} />
    </div>
  );
}