import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
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
  data: number[] | { value: number }[] ;
  type: 'clicks' | 'online';
  
}


export function UserActivityGraph({ data, type }: UserActivityGraphProps) {

const clicksRate = data.map(item => item[0]);  
const onlineRate = data.map(item => item[1]);
  
  const chartData: ChartData<'line'>  = {
    labels: new Array(data.length).fill(''),
    datasets: [
      {
        label: type === 'clicks' ? 'Clicks' : 'Hours',
        data: type === 'clicks' ? clicksRate : onlineRate,
        borderColor: type === 'clicks' ? '#F59E0B' : '#3B82F6',
        backgroundColor: type === 'clicks' ? '#FEF3C7' : '#DBEAFE',
        pointRadius: 4,
        pointBackgroundColor: type === 'clicks' ? '#F59E0B' : '#3B82F6',
        tension: 0,
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;

            // Ensure the value is a valid number before proceeding
            if (value === undefined || isNaN(value)) {
              return ''; // Return an empty string if value is not valid
            }

            return type === 'clicks'
              ? `${Math.ceil(value)} clicks`
              : `${Math.ceil(value)} hours`; 
          },

        },
      },
    },
    scales: {
      y: {
        type:'linear',
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: type === 'clicks' ? 10 : 1,
          callback: (tickValue: string | number) => {
            // Ensure tickValue is a valid number, and handle the string or number correctly
            const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
  
            // Check if value is a valid number after parsing
            if (isNaN(value)) {
              return ''; // Return empty string if the value is not a valid number
            }
  
            return type === 'clicks' ? value : `${value}`;
          },
        },
      },
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 6,
      },
    },
  };

  return (
    <div className="h-[80px]">
      <Line data={chartData} options={options} />
    </div>
  );
}