import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF } from '../../utils/export';
import { exportToExcel } from '../../utils/export';

const MOCK_DEVICES = [
  {
    id: 1,
    trainId: 'T-001',
    deviceId: 'DEV-123',
    status: 'Active',
    lastPing: '2024-03-15 10:30:00',
    location: 'Car 1'
  },
  {
    id: 2,
    trainId: 'T-002',
    deviceId: 'DEV-124',
    status: 'Inactive',
    lastPing: '2024-03-15 09:45:00',
    location: 'Car 3'
  },
  {
    id: 3,
    trainId: 'T-003',
    deviceId: 'DEV-125',
    status: 'Maintenance',
    lastPing: '2024-03-15 08:15:00',
    location: 'Car 2'
  }
];

export function TrainDevicePage() {
  const handleExportPDF = () => {
    exportToPDF('Train Devices', MOCK_DEVICES, ['id', 'trainId', 'deviceId', 'status', 'lastPing', 'location']);
  };

  const handleExportExcel = () => {
    exportToExcel('Train Devices', MOCK_DEVICES, ['id', 'trainId', 'deviceId', 'status', 'lastPing', 'location']);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Device on Train</h1>

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
                  Train ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Ping
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_DEVICES.map((device) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {device.trainId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.deviceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      device.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : device.status === 'Inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.lastPing}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.location}
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