import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { FileCode2, GitBranch, GitCommit, GitPullRequest } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const MOCK_REPORTS = [
  {
    id: 1,
    developer: 'John Smith',
    commits: 156,
    pullRequests: 12,
    codeReviews: 34,
    merges: 8,
    impact: 'High',
    lastActivity: '2024-03-15T10:30:00'
  },
  {
    id: 2,
    developer: 'Sarah Johnson',
    commits: 98,
    pullRequests: 8,
    codeReviews: 22,
    merges: 5,
    impact: 'Medium',
    lastActivity: '2024-03-15T09:45:00'
  }
];

const activityData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Commits',
      data: [15, 20, 25, 18, 30, 22, 15],
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

export function DeveloperReportsPage() {
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  const handleExportPDF = () => {
    exportToPDF('Developer Activity Report', MOCK_REPORTS, [
      'developer',
      'commits',
      'pullRequests',
      'codeReviews',
      'merges',
      'impact',
      'lastActivity'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Developer Activity Report', MOCK_REPORTS, [
      'developer',
      'commits',
      'pullRequests',
      'codeReviews',
      'merges',
      'impact',
      'lastActivity'
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCode2 className="h-6 w-6 text-indigo-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Developer Reports</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <GitCommit className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Total Commits</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">254</p>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <GitPullRequest className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-medium text-gray-900">Open PRs</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">20</p>
          <p className="text-sm text-gray-500">Awaiting review</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-medium text-gray-900">Active Branches</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">13</p>
          <p className="text-sm text-gray-500">Currently active</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Commit Activity</h2>
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
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Impact Levels</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Developer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pull Requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code Reviews</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.developer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.commits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.pullRequests}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.codeReviews}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.merges}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.impact === 'High' ? 'bg-green-100 text-green-800' :
                      report.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.impact}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.lastActivity).toLocaleString()}
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