import { useState } from 'react';
import { DateTimeFilters } from '@/components/filters/DateTimeFilters';
import { exportToPDF } from '@/utils/export';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const AVAILABLE_COMPANIES = [
  'Railway Corp',
  'Metro Systems',
  'Tram Operations',
  'Bus Transit',
  'Urban Transport',
];

const MOCK_COMPANIES = [
  {
    id: 1,
    name: 'Railway Corp',
    userActivity: 156,
    videoRequests: 89,
    clicks: 1234,
    newPoints: 45,
    mergePoints: 23,
    simulationRequests: 67,
  },
  {
    id: 2,
    name: 'Metro Systems',
    userActivity: 98,
    videoRequests: 45,
    clicks: 876,
    newPoints: 34,
    mergePoints: 12,
    simulationRequests: 43,
  },
  {
    id: 3,
    name: 'Tram Operations',
    userActivity: 67,
    videoRequests: 32,
    clicks: 543,
    newPoints: 21,
    mergePoints: 9,
    simulationRequests: 28,
  },
];

const COLUMNS = [
  'Company',
  'User Sum Activity/Hour',
  'Video Requests',
  'Clicks',
  'New Points',
  'Merge Points',
  'Simulation Requests',
];

export function CompanyPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState(MOCK_COMPANIES);

  const handleExport = () => {
    exportToPDF('Company Report', filteredCompanies, [
      'name',
      'userActivity',
      'videoRequests',
      'clicks',
      'newPoints',
      'mergePoints',
      'simulationRequests',
    ]);
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setIsDropdownOpen(false);
    if (company) {
      setFilteredCompanies(MOCK_COMPANIES.filter(c => c.name === company));
    } else {
      setFilteredCompanies(MOCK_COMPANIES);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Company Analytics</h1>
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
                {selectedCompany || 'Select Company'}
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => handleCompanySelect('')}
                    className={cn(
                      'block w-full px-4 py-2 text-left hover:bg-gray-100',
                      !selectedCompany && 'bg-gray-50'
                    )}
                  >
                    All Companies
                  </button>
                  {AVAILABLE_COMPANIES.map((company) => (
                    <button
                      key={company}
                      onClick={() => handleCompanySelect(company)}
                      className={cn(
                        'block w-full px-4 py-2 text-left hover:bg-gray-100',
                        selectedCompany === company && 'bg-gray-50'
                      )}
                    >
                      {company}
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
              {filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.userActivity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.videoRequests}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.clicks}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.newPoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.mergePoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.simulationRequests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}