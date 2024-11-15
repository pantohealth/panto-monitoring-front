import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToExcel, exportToPDF } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';

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

  const handleExportPDF = () => {
    exportToPDF('Company Report', filteredCompanies, [
      'id',
      'name',
      'userActivity',
      'videoRequests',
      'clicks',
      'newPoints',
      'mergePoints',
      'simulationRequests',
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Company Report', filteredCompanies, [
      'id',
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

  useEffect(() => {
    handleCompanySelect(selectedCompany);
  }, [selectedCompany]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Company Analytics</h1>
      </div>

      <DateTimeFilters onExport={handleExportPDF} onExportExcel={handleExportExcel} onSearch={() => {}} />

      <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200 flex gap-4">
          <Dropdown
            value={selectedCompany}
            onChange={setSelectedCompany}
            options={AVAILABLE_COMPANIES}
            placeholder="Select Company"
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