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

        <div className="divide-y divide-gray-200">
          {filteredDevices.map((device) => (
            <div key={device.id} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">{device.name}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Carbon strip</span>
                    <span className="px-2 py-1 text-sm bg-gray-100 rounded">
                      {device.carbonStrip}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Last connection: {device.lastConnection ? new Date(device.lastConnection).toLocaleString() : '---'}
                  </span>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <Gauge className="w-6 h-6 text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">Distance</span>
                    <span className="text-lg font-medium">{device.distance} km</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <Gauge className="w-6 h-6 text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">Speed</span>
                    <span className="text-lg font-medium">{device.speed} km/h</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-center space-x-2">
                    {device.devicePoints.map((point) => (
                      <div
                        key={point.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                          point.status === 'active' ? 'bg-green-500' :
                          point.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      >
                        {point.id}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <span className="block text-sm text-gray-500">Battery A</span>
                  <span className="text-lg font-medium">{device.batteryA}%</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <span className="block text-sm text-gray-500">Battery B</span>
                  <span className="text-lg font-medium">{device.batteryB}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}