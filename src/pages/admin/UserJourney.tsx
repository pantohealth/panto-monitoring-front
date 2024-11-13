import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { FootprintsIcon, User, Clock, MousePointer2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const MOCK_JOURNEYS = [
  {
    id: 1,
    userId: 'USR-001',
    username: 'John Doe',
    sessionStart: '2024-03-15T10:00:00',
    sessionEnd: '2024-03-15T11:30:00',
    pagesVisited: 15,
    actionsPerformed: 45,
    averageTimePerPage: '5m 30s',
    mostVisitedPage: '/dashboard/analytics',
    deviceType: 'Desktop',
    browser: 'Chrome'
  },
  {
    id: 2,
    userId: 'USR-002',
    username: 'Jane Smith',
    sessionStart: '2024-03-15T09:15:00',
    sessionEnd: '2024-03-15T10:45:00',
    pagesVisited: 12,
    actionsPerformed: 38,
    averageTimePerPage: '4m 45s',
    mostVisitedPage: '/dashboard/reports',
    deviceType: 'Mobile',
    browser: 'Safari'
  }
];

const activityData = {
  labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', 
           '14:00', '16:00', '18:00', '20:00', '22:00'],
  datasets: [
    {
      label: 'Active Users',
      data: [15, 20, 10, 5, 8, 25, 30, 28, 32, 24, 18, 12],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }
  ]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export function UserJourneyPage() {
  const [selectedDevice, setSelectedDevice] = useState<string>('all');

  const handleExportPDF = () => {
    exportToPDF('User Journey Report', MOCK_JOURNEYS, [
      'userId',
      'username',
      'sessionStart',
      'sessionEnd',
      'pagesVisited',
      'actionsPerformed',
      'averageTimePerPage',
      'mostVisitedPage',
      'deviceType',
      'browser'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('User Journey Report', MOCK_JOURNEYS, [
      'userId',
      'username',
      'sessionStart',
      'sessionEnd',
      'pagesVisited',
      'actionsPerformed',
      'averageTimePerPage',
      'mostVisitedPage',
      'deviceType',
      'browser'
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FootprintsIcon className="h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-semibold text-gray-900">User Journey Logs</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Active Users</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-500">Currently online</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-medium text-gray-900">Avg. Session Time</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">12m 30s</p>
          <p className="text-sm text-gray-500">Last 24 hours</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <MousePointer2 className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-medium text-gray-900">Total Actions</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
          <p className="text-sm text-gray-500">Last 24 hours</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Activity Timeline</h2>
        <div className="h-64">
          <Line data={activityData} options={chartOptions} />
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
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time/Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Most Visited</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_JOURNEYS.map((journey) => (
                <tr key={journey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{journey.username}</div>
                        <div className="text-sm text-gray-500">{journey.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(journey.sessionStart).toLocaleTimeString()} - 
                      {new Date(journey.sessionEnd).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{journey.pagesVisited}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{journey.actionsPerformed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{journey.averageTimePerPage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{journey.mostVisitedPage}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      journey.deviceType === 'Desktop' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {journey.deviceType}
                    </span>
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