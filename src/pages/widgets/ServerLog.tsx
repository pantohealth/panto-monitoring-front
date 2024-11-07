import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF } from '../../utils/export';
import { exportToExcel } from '../../utils/export';

const MOCK_LOGS = [
  {
    id: 1,
    timestamp: '2024-03-15 10:30:00',
    type: 'INFO',
    message: 'Server started successfully',
    source: 'System'
  },
  {
    id: 2,
    timestamp: '2024-03-15 10:31:00',
    type: 'DEBUG',
    message: 'Processing data request',
    source: 'DataHandler'
  },
  {
    id: 3,
    timestamp: '2024-03-15 10:32:00',
    type: 'WARNING',
    message: 'High memory usage detected',
    source: 'Monitor'
  }
];

export function ServerLogPage() {
  const handleExportPDF = () => {
    exportToPDF('Server Logs', MOCK_LOGS, ['id', 'timestamp', 'type', 'message', 'source']);
  };

  const handleExportExcel = () => {
    exportToExcel('Server Logs', MOCK_LOGS, ['id', 'timestamp', 'type', 'message', 'source']);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Data to Server Log</h1>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_LOGS.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.type === 'INFO' 
                        ? 'bg-blue-100 text-blue-800'
                        : log.type === 'WARNING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}