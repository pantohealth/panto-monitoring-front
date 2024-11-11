import { useState, useMemo } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { RadioGroup } from '../../components/ui/RadioGroup';

interface SystemLogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: string;
  context: string;
  trace: string;
}

const MOCK_LOGS: SystemLogEntry[] = [
  {
    id: 1,
    timestamp: '2024-03-15T10:30:00',
    message: 'Failed to connect to database',
    type: 'error',
    context: 'DatabaseService',
    trace: 'Error: Connection timeout at DatabaseService.connect'
  },
  {
    id: 2,
    timestamp: '2024-03-15T10:31:00',
    message: 'User authentication successful',
    type: 'log',
    context: 'AuthService',
    trace: 'User ID: 123 authenticated successfully'
  },
  {
    id: 3,
    timestamp: '2024-03-15T10:32:00',
    message: 'Invalid credentials provided',
    type: 'error',
    context: 'AuthService',
    trace: 'Error: Invalid username or password'
  },
  {
    id: 4,
    timestamp: '2024-03-15T10:33:00',
    message: 'System health check completed',
    type: 'log',
    context: 'HealthService',
    trace: 'All systems operational'
  }
];

export function SystemLogPage() {
  const [logType, setLogType] = useState<'log' | 'error'>('log');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter logs based on selected type
  const filteredLogs = useMemo(() => {
    if (logType === 'log') {
      return MOCK_LOGS;
    }
    return MOCK_LOGS.filter(log => log.type === 'error');
  }, [logType]);

  const handleExportPDF = () => {
    exportToPDF('System Logs', filteredLogs, ['timestamp', 'message', 'type', 'context', 'trace']);
  };

  const handleExportExcel = () => {
    exportToExcel('System Logs', filteredLogs, ['timestamp', 'message', 'type', 'context', 'trace']);
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        type: logType
      });

      // In a real app, you would use these parameters to fetch data
      const url = `https://apiv4dev.pantohealth.com/api/v4/log?${params}`;
      console.log('Fetching logs from:', url);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const handleTypeChange = (value: string) => {
    setLogType(value as 'log' | 'error');
    setCurrentPage(1); // Reset to first page when changing type
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">System Log</h1>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={handleSearch}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <RadioGroup
            options={[
              { label: 'All Logs', value: 'log' },
              { label: 'Errors Only', value: 'error' }
            ]}
            value={logType}
            onChange={handleTypeChange}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Context
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trace
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.type === 'error' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.context}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-lg truncate">
                      {log.trace}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}