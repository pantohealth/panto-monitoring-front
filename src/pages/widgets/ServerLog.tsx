import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Dropdown } from '../../components/ui/Dropdown';

interface ServerLogEntry {
  id: number;
  recordTime: string;
  receiveTime: string;
  device: string;
  acc: string;
  system: string;
  battery: string;
  temp: string;
  gps: string;
  laser: string;
  laserV: string;
  tower: string;
  error: string;
  abnormal: string;
}

const MOCK_DEVICES = ['Leipzig 3', 'Leipzig 2', 'Leipzig1'];

const MOCK_LOGS: ServerLogEntry[] = [
  {
    id: 1,
    recordTime: '11/Nov/2024 09:52',
    receiveTime: '11/Nov/2024 09:53',
    device: 'Leipzig 3',
    acc: '11996',
    system: '7',
    battery: '2',
    temp: '~',
    gps: '60',
    laser: '~',
    laserV: '~',
    tower: '~',
    error: '~',
    abnormal: '1'
  },
  {
    id: 2,
    recordTime: '11/Nov/2024 09:52',
    receiveTime: '11/Nov/2024 09:53',
    device: 'Leipzig 2',
    acc: '11996',
    system: '7',
    battery: '2',
    temp: '~',
    gps: '60',
    laser: '~',
    laserV: '~',
    tower: '~',
    error: '~',
    abnormal: '0'
  },
  {
    id: 3,
    recordTime: '11/Nov/2024 09:52',
    receiveTime: '11/Nov/2024 09:53',
    device: 'Leipzig1',
    acc: '11997',
    system: '7',
    battery: '2',
    temp: '~',
    gps: '60',
    laser: '~',
    laserV: '~',
    tower: '~',
    error: '~',
    abnormal: '0'
  }
];

export function ServerLogPage() {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredLogs = selectedDevice
    ? MOCK_LOGS.filter(log => log.device === selectedDevice)
    : MOCK_LOGS;

  const handleExportPDF = () => {
    exportToPDF('Server Logs', filteredLogs, [
      'recordTime',
      'receiveTime',
      'device',
      'acc',
      'system',
      'battery',
      'temp',
      'gps',
      'laser',
      'laserV',
      'tower',
      'error',
      'abnormal'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Server Logs', filteredLogs, [
      'recordTime',
      'receiveTime',
      'device',
      'acc',
      'system',
      'battery',
      'temp',
      'gps',
      'laser',
      'laserV',
      'tower',
      'error',
      'abnormal'
    ]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Data to Server Log</h1>

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
            options={MOCK_DEVICES}
            placeholder="Select Device"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receive</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Acc</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">System</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Battery</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Temp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Gps</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Laser</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase whitespace-nowrap">Laser V</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Tower</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Error</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">Abnormal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.recordTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.receiveTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.device}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.acc}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.system}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.battery}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.temp}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.gps}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.laser}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.laserV}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log.tower}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{log.error}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600">{log.abnormal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}