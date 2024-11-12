import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Dropdown } from '../../components/ui/Dropdown';

interface TrainDevice {
  id: string;
  name: string;
  carbonStrip: number;
  lastConnection: string | null;
  speed: number;
  batteryA: number;
  batteryB: number;
  kmD: number;
  km: number;
  apD: string;
  ap: string;
  devicePoints: {
    id: number;
    status: 'active' | 'warning' | 'error';
  }[];
}

const MOCK_DEVICES: TrainDevice[] = [
  {
    id: 'DB-001',
    name: 'DB Netz',
    carbonStrip: 25,
    lastConnection: null,
    speed: 60,
    batteryA: 85,
    batteryB: 90,
    kmD: 12.5,
    km: 15.2,
    apD: '~',
    ap: '~',
    devicePoints: [
      { id: 1, status: 'active' },
      { id: 2, status: 'warning' },
      { id: 3, status: 'error' }
    ]
  },
  {
    id: 'MIN-001',
    name: 'Minelge1',
    carbonStrip: 35,
    lastConnection: '2024-10-24T23:01:00',
    speed: 45,
    batteryA: 75,
    batteryB: 80,
    kmD: 8.3,
    km: 10.1,
    apD: '~',
    ap: '~',
    devicePoints: [
      { id: 1, status: 'active' },
      { id: 2, status: 'warning' }
    ]
  }
];

const COLUMNS = [
  'Device',
  'Carbon Strip',
  'Last Connection',
  'Speed',
  'Battery A',
  'Battery B',
  'Distance ',
  'Distance D',
  'A/p ',
  'A/p D',
  'Device Points'
];

export function TrainDevicePage() {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const filteredDevices = selectedDevice
    ? MOCK_DEVICES.filter(device => device.id === selectedDevice)
    : MOCK_DEVICES;

  const handleExportPDF = () => {
    exportToPDF('Train Devices Report', filteredDevices, [
      'id',
      'name',
      'carbonStrip',
      'lastConnection',
      'speed',
      'batteryA',
      'batteryB',
      'kmD',
      'kmO',
      'apD',
      'apO'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Train Devices Report', filteredDevices, [
      'id',
      'name',
      'carbonStrip',
      'lastConnection',
      'speed',
      'batteryA',
      'batteryB',
      'kmD',
      'kmO',
      'apD',
      'apO'
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Device on Trains</h1>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <Dropdown
            value={selectedDevice}
            onChange={setSelectedDevice}
            options={MOCK_DEVICES.map(device => device.id)}
            placeholder="Select Device"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{device.name}</div>
                      <span className="ml-2 text-xs text-gray-500">({device.id})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-sm bg-gray-100 rounded">
                      {device.carbonStrip}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.lastConnection ? new Date(device.lastConnection).toLocaleString() : '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.speed} km/h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.batteryA}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.batteryB}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.kmD} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.km} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.apD}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.ap}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {device.devicePoints.map((point) => (
                        <div
                          key={point.id}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                            point.status === 'active' ? 'bg-green-500' :
                            point.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        >
                          {point.id}
                        </div>
                      ))}
                    </div>
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