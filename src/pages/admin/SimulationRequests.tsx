import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { PlayCircle } from 'lucide-react';

const MOCK_SIMULATIONS = [
  {
    id: 'SIM-001',
    deviceId: 'DEV-123',
    type: 'Static',
    status: 'Failed',
    project: 65,
    Time: '2024-03-15T10:30:00',
    requestedBy: 'John Smith',
    
  },
  {
    id: 'SIM-002',
    deviceId: 'DEV-456',
    type: 'Static',
    status: 'Done',
    project: 100,
    Time: '2024-03-15T09:00:00',
    requestedBy: 'Sarah Johnson',
    
  },
  {
    id: 'SIM-003',
    deviceId: 'DEV-789',
    type: 'Static',
    status: 'Canceled',
    project: 45,
    Time: '2024-03-15T08:30:00',
    requestedBy: 'Mike Wilson',
   
  }
];

export function SimulationRequestsPage() {

  const handleExportPDF = () => {
    exportToPDF('Simulation Requests Report', MOCK_SIMULATIONS, [
      'id',
      'deviceId',
      'type',
      'status',
      'project',
      'Time',
      'requestedBy',
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Simulation Requests Report', MOCK_SIMULATIONS, [
      'id',
      'deviceId',
      'type',
      'status',
      'project',
      'Time',
      'requestedBy',
    ]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Canceled':
        return <span className="w-4 h-4 p-1 rounded-sm text-blue-500 bg-blue-100">Canceled</span>;
      case 'Done':
        return <span className="w-4 h-4 p-1 rounded-sm text-green-500 bg-green-100">Done</span>;
      case 'Failed':
        return <span className="w-4 h-4 p-1 rounded-sm text-red-500 bg-red-100">Failed</span>;
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

      {/* <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      /> */}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_SIMULATIONS.map((sim) => (
                <tr key={sim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sim.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusIcon(sim.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sim.requestedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-500 mt-1">{sim.project}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sim.Time).toLocaleString()}
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