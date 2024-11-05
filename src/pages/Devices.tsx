import { useState } from 'react';
import { DateTimeFilters } from '@/components/filters/DateTimeFilters';
import { exportToPDF } from '@/utils/export';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const AVAILABLE_DEVICES = [
  'Device A',
  'Device B',
  'Device C',
  'Device D',
  'Device E',
];

const MOCK_DEVICES = [
  { id: 1, device: 'Device A', paNumber: 'PA001', newPoint: 'Point 1' },
  { id: 2, device: 'Device B', paNumber: 'PA002', newPoint: 'Point 2' },
  { id: 3, device: 'Device C', paNumber: 'PA003', newPoint: 'Point 3' },
];

const COLUMNS = ['Device', 'PA Number', 'New Point'];

export function DevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState(MOCK_DEVICES);

  const handleExport = () => {
    exportToPDF('Devices Report', filteredDevices, ['device', 'paNumber', 'newPoint']);
  };

  const handleDeviceSelect = (device: string) => {
    setSelectedDevice(device);
    setIsDropdownOpen(false);
    if (device) {
      setFilteredDevices(MOCK_DEVICES.filter(d => d.device === device));
    } else {
      setFilteredDevices(MOCK_DEVICES);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
      </div>

      <DateTimeFilters onExport={handleExport} onSearch={() => {}} />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-64">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="flex items-center justify-between">
                {selectedDevice || 'Select Device'}
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => handleDeviceSelect('')}
                    className={cn(
                      'block w-full px-4 py-2 text-left hover:bg-gray-100',
                      !selectedDevice && 'bg-gray-50'
                    )}
                  >
                    All Devices
                  </button>
                  {AVAILABLE_DEVICES.map((device) => (
                    <button
                      key={device}
                      onClick={() => handleDeviceSelect(device)}
                      className={cn(
                        'block w-full px-4 py-2 text-left hover:bg-gray-100',
                        selectedDevice === device && 'bg-gray-50'
                      )}
                    >
                      {device}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
              {filteredDevices.map((device) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{device.device}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device.paNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device.newPoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}