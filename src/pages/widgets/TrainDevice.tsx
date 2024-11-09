import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Dropdown } from '../../components/ui/Dropdown';
import { Settings, Gauge } from 'lucide-react';

interface TrainDevice {
  id: string;
  name: string;
  carbonStrip: number;
  lastConnection: string | null;
  distance: number;
  speed: number;
  batteryA: number;
  batteryB: number;
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
    distance: 12.5,
    speed: 60,
    batteryA: 85,
    batteryB: 90,
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
    distance: 8.3,
    speed: 45,
    batteryA: 75,
    batteryB: 80,
    devicePoints: [
      { id: 1, status: 'active' },
      { id: 2, status: 'warning' }
    ]
  }
];

export function TrainDevicePage() {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredDevices = selectedDevice
    ? MOCK_DEVICES.filter(device => device.id === selectedDevice)
    : MOCK_DEVICES;

  const handleExportPDF = () => {
    exportToPDF('Train Devices Report', filteredDevices, [
      'id',
      'name',
      'carbonStrip',
      'lastConnection',
      'distance',
      'speed',
      'batteryA',
      'batteryB'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Train Devices Report', filteredDevices, [
      'id',
      'name',
      'carbonStrip',
      'lastConnection',
      'distance',
      'speed',
      'batteryA',
      'batteryB'
    ]);
  };

  const getStatusColor = (status: 'active' | 'warning' | 'error') => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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

      <div className="p-4 bg-white shadow rounded-lg">
        <Dropdown
          value={selectedDevice}
          onChange={setSelectedDevice}
          options={MOCK_DEVICES.map(device => device.id)}
          placeholder="Select Device"
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
        />
      </div>

      <div className="space-y-4">
        {filteredDevices.map((device) => (
          <div key={device.id} className="bg-gray-800 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">{device.name}</h2>
                <div className="flex items-center space-x-2 text-gray-300">
                  <span>Carbon strip</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">
                    {device.carbonStrip}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Last connection: {device.lastConnection ? new Date(device.lastConnection).toLocaleString() : '---'}
                </span>
                <button className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="flex items-center space-x-4">
                <Gauge className="w-6 h-6 text-blue-400" />
                <div>
                  <span className="block text-sm text-gray-400">Distance</span>
                  <span className="text-lg">{device.distance} km</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Gauge className="w-6 h-6 text-blue-400" />
                <div>
                  <span className="block text-sm text-gray-400">Speed</span>
                  <span className="text-lg">{device.speed} km/h</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center justify-center">
                <div className="flex space-x-2">
                  {device.devicePoints.map((point) => (
                    <div
                      key={point.id}
                      className={`w-8 h-8 rounded-full ${getStatusColor(point.status)} flex items-center justify-center`}
                    >
                      {point.id}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-sm text-gray-400">Battery A</span>
                  <span className="text-lg">{device.batteryA}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-sm text-gray-400">Battery B</span>
                  <span className="text-lg">{device.batteryB}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}