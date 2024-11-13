import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Database, HardDrive, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const MOCK_DATA = [
  {
    id: 1,
    name: 'Train Location Data',
    type: 'GPS Data',
    size: '2.5 GB',
    records: 150000,
    lastBackup: '2024-03-15T10:30:00',
    status: 'Active',
    retention: '90 days'
  },
  {
    id: 2,
    name: 'System Logs',
    type: 'Log Files',
    size: '1.8 GB',
    records: 250000,
    lastBackup: '2024-03-15T09:45:00',
    status: 'Archived',
    retention: '180 days'
  },
  {
    id: 3,
    name: 'User Analytics',
    type: 'Analytics Data',
    size: '3.2 GB',
    records: 180000,
    lastBackup: '2024-03-15T08:15:00',
    status: 'Active',
    retention: '365 days'
  }
];

export function DataManagementPage() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleExportPDF = () => {
    exportToPDF('Data Management Report', MOCK_DATA, [
      'name',
      'type',
      'size',
      'records',
      'lastBackup',
      'status',
      'retention'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Data Management Report', MOCK_DATA, [
      'name',
      'type',
      'size',
      'records',
      'lastBackup',
      'status',
      'retention'
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-indigo-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Data Management</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-medium text-gray-900">Storage Usage</h2>
            </div>
            <span className="text-sm text-gray-500">7.5 GB / 10 GB</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-medium text-gray-900">Backup Status</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">Last successful backup: 2 hours ago</p>
          <Button variant="secondary" size="sm" className="mt-4">
            Start Backup
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-medium text-gray-900">Data Recovery</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">3 recovery points available</p>
          <Button variant="secondary" size="sm" className="mt-4">
            Restore Data
          </Button>
        </div>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Data Types</option>
              <option value="gps">GPS Data</option>
              <option value="logs">Log Files</option>
              <option value="analytics">Analytics Data</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Backup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.records.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastBackup).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.retention}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
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