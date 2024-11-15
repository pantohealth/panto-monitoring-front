import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToExcel, exportToPDF } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';

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

  const handleExportPDF = () => {
    exportToPDF('Devices Report', filteredDevices, ['device', 'paNumber', 'newPoint']);
  };

  const handleExportExcel = () => {
    exportToExcel('Devices Report', filteredDevices, ['device', 'paNumber', 'newPoint']);
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

  useEffect(() => {
    handleDeviceSelect(selectedDevice);
  }, [selectedDevice]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
      </div>

      <DateTimeFilters onExport={handleExportPDF} onExportExcel={handleExportExcel} onSearch={() => {}} />

      <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200 flex gap-4">
          <Dropdown
            value={selectedDevice}
            onChange={setSelectedDevice}
            options={AVAILABLE_DEVICES}
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