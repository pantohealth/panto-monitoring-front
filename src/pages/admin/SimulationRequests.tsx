import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { PlayCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

const MOCK_SIMULATIONS = [
  {
    id: 'SIM-001',
    deviceId: 'DEV-123',
    type: 'Train Movement',
    status: 'Running',
    progress: 65,
    startTime: '2024-03-15T10:30:00',
    estimatedCompletion: '2024-03-15T11:30:00',
    requestedBy: 'John Smith',
    priority: 'High'
  },
  {
    id: 'SIM-002',
    deviceId: 'DEV-456',
    type: 'Power Consumption',
    status: 'Completed',
    progress: 100,
    startTime: '2024-03-15T09:00:00',
    estimatedCompletion: '2024-03-15T10:00:00',
    requestedBy: 'Sarah Johnson',
    priority: 'Medium'
  },
  {
    id: 'SIM-003',
    deviceId: 'DEV-789',
    type: 'Route Optimization',
    status: 'Failed',
    progress: 45,
    startTime: '2024-03-15T08:30:00',
    estimatedCompletion: '2024-03-15T09:30:00',
    requestedBy: 'Mike Wilson',
    priority: 'Low'
  }
];

export function SimulationRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleExportPDF = () => {
    exportToPDF('Simulation Requests Report', MOCK_SIMULATIONS, [
      'id',
      'deviceId',
      'type',
      'status',
      'progress',
      'startTime',
      'estimatedCompletion',
      'requestedBy',
      'priority'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Simulation Requests Report', MOCK_SIMULATIONS, [
      'id',
      'deviceId',
      'type',
      'status',
      'progress',
      'startTime',
      'estimatedCompletion',
      'requestedBy',
      'priority'
    ]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PlayCircle className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Simulation Requests</h1>
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_SIMULATIONS.map((sim) => (
                <tr key={sim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sim.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sim.deviceId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sim.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(sim.status)}
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sim.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                        sim.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sim.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className={`h-2.5 rounded-full ${
                          sim.status === 'Failed' ? 'bg-red-500' :
                          sim.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${sim.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{sim.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sim.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sim.estimatedCompletion).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sim.requestedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}