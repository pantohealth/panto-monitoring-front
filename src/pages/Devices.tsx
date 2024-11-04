import React from 'react';
import { DateTimeFilters } from '@/components/filters/DateTimeFilters';
import { exportToPDF } from '@/utils/export';

const MOCK_DEVICES = [
  { id: 1, name: 'Server 1', status: 'Online', lastPing: '2024-03-15 10:30:00', type: 'Production' },
  { id: 2, name: 'Server 2', status: 'Offline', lastPing: '2024-03-15 09:45:00', type: 'Staging' },
];

const COLUMNS = ['ID', 'Name', 'Status', 'Last Ping', 'Type'];

export function DevicesPage() {
  const handleExport = () => {
    exportToPDF('Devices Report', MOCK_DEVICES, ['id', 'name', 'status', 'lastPing', 'type']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
      </div>

      <DateTimeFilters onExport={handleExport} />

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
              {MOCK_DEVICES.map((device) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{device.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      device.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{device.lastPing}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}