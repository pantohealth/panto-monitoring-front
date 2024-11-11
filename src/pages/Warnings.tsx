import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToPDF } from '../utils/export';

const MOCK_WARNINGS = [
  { id: 1, type: 'System', message: 'High CPU Usage', severity: 'Warning', timestamp: '2024-03-15 10:30:00' },
  { id: 2, type: 'Security', message: 'Failed Login Attempts', severity: 'Critical', timestamp: '2024-03-15 09:45:00' },
];

const COLUMNS = ['ID', 'Type', 'Message', 'Severity', 'Timestamp'];

export function WarningsPage() {
  const handleExport = () => {
    exportToPDF('System Warnings Report', MOCK_WARNINGS, ['id', 'type', 'message', 'severity', 'timestamp']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Warnings</h1>
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
              {MOCK_WARNINGS.map((warning) => (
                <tr key={warning.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{warning.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{warning.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{warning.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      warning.severity === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {warning.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{warning.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}