import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToPDF } from '../utils/export';

const MOCK_HEALTH = [
  { id: 1, metric: 'CPU Usage', value: '45%', status: 'Normal', timestamp: '2024-03-15 10:30:00' },
  { id: 2, metric: 'Memory', value: '78%', status: 'Warning', timestamp: '2024-03-15 10:30:00' },
  { id: 3, metric: 'Disk Space', value: '62%', status: 'Normal', timestamp: '2024-03-15 10:30:00' },
];

const COLUMNS = ['ID', 'Metric', 'Value', 'Status', 'Timestamp'];

export function HealthPage() {
  const handleExport = () => {
    exportToPDF('Server Health Report', MOCK_HEALTH, ['id', 'metric', 'value', 'status', 'timestamp']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Server Health</h1>
      </div>

      <DateTimeFilters onExport={handleExport} onSearch={() => {}}/>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_HEALTH.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}