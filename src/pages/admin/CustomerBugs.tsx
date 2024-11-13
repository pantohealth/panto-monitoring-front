import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Bug } from 'lucide-react';

const MOCK_BUGS = [
  {
    id: 1,
    title: 'Device Connection Error',
    description: 'Unable to establish connection with device ID: DEV-123',
    status: 'Open',
    priority: 'High',
    reportedBy: 'John Doe',
    reportedAt: '2024-03-15T10:30:00',
    lastUpdated: '2024-03-15T11:45:00'
  },
  {
    id: 2,
    title: 'Data Sync Issue',
    description: 'Synchronization failed for train location data',
    status: 'In Progress',
    priority: 'Medium',
    reportedBy: 'Jane Smith',
    reportedAt: '2024-03-14T15:20:00',
    lastUpdated: '2024-03-15T09:30:00'
  }
];

export function CustomerBugsPage() {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const handleExportPDF = () => {
    exportToPDF('Customer Bugs Report', MOCK_BUGS, [
      'id',
      'title',
      'description',
      'status',
      'priority',
      'reportedBy',
      'reportedAt',
      'lastUpdated'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Customer Bugs Report', MOCK_BUGS, [
      'id',
      'title',
      'description',
      'status',
      'priority',
      'reportedBy',
      'reportedAt',
      'lastUpdated'
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bug className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Customer Bugs</h1>
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
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_BUGS.map((bug) => (
                <tr key={bug.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{bug.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{bug.title}</div>
                    <div className="text-sm text-gray-500">{bug.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bug.status === 'Open' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bug.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bug.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : bug.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {bug.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bug.reportedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bug.lastUpdated).toLocaleString()}
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