import { useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';

interface Warning {
  id: number;
  time: string;
  type: string;
  side: string;
  device: string;
  action: string;
  status: string;
  description: string;
  details: string;
}

const WARNING_TYPES = ['Device','System', 'Ai'];
const SIDES = ['Backend', 'Frontend'];
const DEVICES = ['~', 'Leipzig 3'];
const ACTIONS = ['Notice', 'Remove'];

const MOCK_WARNINGS: Warning[] = [
  {
    id: 1,
    time: '2024/11/12 03:35',
    type: 'System',
    side: 'Backend',
    device: '~',
    action: 'Notice',
    status: 'Unchecked',
    description: 'PlanExecutor',
    details: '~'
  },
  {
    id: 2,
    time: '2024/11/11 17:02',
    type: 'Ai',
    side: 'Backend',
    device: 'Leipzig 3',
    action: 'Remove',
    status: 'Unchecked',
    description: 'Duplicate Signal Event Data',
    details: '~'
  },
  {
    id: 3,
    time: '2024/11/11 17:02',
    type: 'Ai',
    side: 'Backend',
    device: 'Leipzig 3',
    action: 'Remove',
    status: 'Unchecked',
    description: 'Duplicate Signal Event Data',
    details: '~'
  }
];

export function WarningsPage() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSideDropdownOpen, setIsSideDropdownOpen] = useState(false);
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);

  const filteredWarnings = MOCK_WARNINGS.filter(warning => {
    if (selectedType && warning.type !== selectedType) return false;
    if (selectedSide && warning.side !== selectedSide) return false;
    if (selectedDevice && warning.device !== selectedDevice) return false;
    if (selectedAction && warning.action !== selectedAction) return false;
    return true;
  });

  const handleExportPDF = () => {
    exportToPDF('System Warnings Report', filteredWarnings, [
      'time',
      'type',
      'side',
      'device',
      'action',
      'status',
      'description',
      'details'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('System Warnings Report', filteredWarnings, [
      'time',
      'type',
      'side',
      'device',
      'action',
      'status',
      'description',
      'details'
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Warnings</h1>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 grid grid-cols-4 gap-4">
          <Dropdown
            value={selectedType}
            onChange={setSelectedType}
            options={WARNING_TYPES}
            placeholder="Filter Type"
            isOpen={isTypeDropdownOpen}
            onToggle={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          />
          <Dropdown
            value={selectedSide}
            onChange={setSelectedSide}
            options={SIDES}
            placeholder="Filter Side"
            isOpen={isSideDropdownOpen}
            onToggle={() => setIsSideDropdownOpen(!isSideDropdownOpen)}
          />
          <Dropdown
            value={selectedDevice}
            onChange={setSelectedDevice}
            options={DEVICES}
            placeholder="Filter Device"
            isOpen={isDeviceDropdownOpen}
            onToggle={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
          />
          <Dropdown
            value={selectedAction}
            onChange={setSelectedAction}
            options={ACTIONS}
            placeholder="Filter Action"
            isOpen={isActionDropdownOpen}
            onToggle={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarnings.map((warning) => (
                <tr key={warning.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><span className='text-xs'>from</span> {warning.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.side}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.device}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {warning.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{warning.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50"
              onClick={() => {}}
            >
              Previous
            </button>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-500 text-white rounded">1</span>
              <span className="px-3 py-1 text-gray-600">2</span>
              <span className="px-2 text-gray-600">...</span>
              <span className="px-3 py-1 text-gray-600">30463047</span>
            </div>
            <button
              className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50"
              onClick={() => {}}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}