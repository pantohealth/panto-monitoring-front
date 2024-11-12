import { useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';

interface ServerMetrics {
  id: number;
  server: string;
  cpu: number;
  ram: number;
  disk: number;
  timestamp: string;
}

const SERVERS = [
  'Dev Server',
  'Dash Server',
  'Dash Computing Server',
  'Dev Computing Server',
  'Dev Rabbit',
  'Dash Rabbit'
];

const MOCK_HEALTH: ServerMetrics[] = [
  { id: 1, server: 'Dev Server', cpu: 45, ram: 62, disk: 55, timestamp: '2024-03-15 10:30:00' },
  { id: 2, server: 'Dash Server', cpu: 38, ram: 55, disk: 48, timestamp: '2024-03-15 10:30:00' },
  { id: 3, server: 'Dash Computing Server', cpu: 78, ram: 85, disk: 72, timestamp: '2024-03-15 10:30:00' },
  { id: 4, server: 'Dev Computing Server', cpu: 65, ram: 70, disk: 58, timestamp: '2024-03-15 10:30:00' },
  { id: 5, server: 'Dev Rabbit', cpu: 25, ram: 45, disk: 30, timestamp: '2024-03-15 10:30:00' },
  { id: 6, server: 'Dash Rabbit', cpu: 32, ram: 48, disk: 35, timestamp: '2024-03-15 10:30:00' }
];

const COLUMNS = ['Server', 'CPU Usage', 'RAM Usage', 'Disk Usage', 'Time', 'Status'];

export function HealthPage() {
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredHealth = selectedServer
    ? MOCK_HEALTH.filter(item => item.server === selectedServer)
    : MOCK_HEALTH;

  const handleExportPDF = () => {
    const exportData = filteredHealth.map(item => ({
      server: item.server,
      cpu: `${item.cpu}%`,
      ram: `${item.ram}%`,
      disk: `${item.disk}%`,
      timestamp: item.timestamp,
      status: getStatus(item)
    }));

    exportToPDF('Server Health Report', exportData, ['server', 'cpu', 'ram', 'disk', 'timestamp', 'status']);
  };

  const handleExportExcel = () => {
    const exportData = filteredHealth.map(item => ({
      server: item.server,
      cpu: `${item.cpu}%`,
      ram: `${item.ram}%`,
      disk: `${item.disk}%`,
      timestamp: item.timestamp,
      status: getStatus(item)
    }));

    exportToExcel('Server Health Report', exportData, ['server', 'cpu', 'ram', 'disk', 'timestamp', 'status']);
  };

  const getStatusColor = (value: number) => {
    if (value >= 80) return 'bg-red-100 text-red-800';
    if (value >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatus = (metrics: ServerMetrics) => {
    const highestValue = Math.max(metrics.cpu, metrics.ram, metrics.disk);
    if (highestValue >= 80) return 'Critical';
    if (highestValue >= 60) return 'Warning';
    return 'Normal';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Server Health</h1>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <Dropdown
            value={selectedServer}
            onChange={setSelectedServer}
            options={SERVERS}
            placeholder="Select Server"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>

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
              {filteredHealth.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.server}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            item.cpu >= 80 ? 'bg-red-500' :
                            item.cpu >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${item.cpu}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{item.cpu}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            item.ram >= 80 ? 'bg-red-500' :
                            item.ram >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${item.ram}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{item.ram}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            item.disk >= 80 ? 'bg-red-500' :
                            item.disk >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${item.disk}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{item.disk}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(Math.max(item.cpu, item.ram, item.disk))}`}>
                      {getStatus(item)}
                    </span>
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