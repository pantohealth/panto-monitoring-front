import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToExcel, exportToPDF } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';
import { useQuery } from '@tanstack/react-query';
import { Company } from '../api/Company';
import { COMPANIES } from '../types/company';

const COLUMNS = [
  'Company',
  'User Activity/Hour',
  'Video Requests',
  'Clicks',
  'New Points',
  'Merge Points',
  // 'Simulation Requests',
  'Normal',
  'Abnormal',
  'Overlap'
];

export function CompanyPage() {

  const {data, isPending, error} = useQuery<COMPANIES[]>({
    queryKey: ['companies'],
    queryFn: Company.companies
  })

  //extract company name from data  
  const COMPANIES = (data?.map(data => data.name))

  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState(data);

  const handleExportPDF = () => {
    if(filteredCompanies){
    exportToPDF('Company Report', filteredCompanies, [
      '_id',
      'name',
      'totalOnlineHours',
      'videoRequestNumber',
      'totalClicks',
      'newPoints',
      'mergePoints',
      'simulationRequests',
    ]);
  }
  };

  const handleExportExcel = () => {
    if(filteredCompanies){
    exportToExcel('Company Report', filteredCompanies, [
      '_id',
      'name',
      'totalOnlineHours',
      'videoRequestNumber',
      'totalClicks',
      'newPoints',
      'mergePoints',
      'simulationRequests',
    ]);
  }
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setIsDropdownOpen(false);
    if (company) {
      setFilteredCompanies(data?.filter(c => c.name === company));
    } else {
      setFilteredCompanies(data);
    }
  };

  useEffect(() => {
    handleCompanySelect(selectedCompany);
  }, [selectedCompany,data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Company Analytics</h1>
      </div>

      <DateTimeFilters onExport={handleExportPDF} onExportExcel={handleExportExcel} />

      <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200 flex gap-4">
          <Dropdown
            value={selectedCompany}
            onChange={setSelectedCompany}
            options={COMPANIES}
            placeholder="Select Company"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* loading */}
          {isPending && <p className='loader mx-auto my-10 w-full h-full'></p>}
          {/* Error */}
          {!isPending && error && <p className='loader items-center  mx-auto my-10 w-full h-full'>{error?.message}</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies?.map((company) => (
                <tr key={company._id}>
                  <td className="px-2 py-4 whitespace-nowrap font-medium">{company.name}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{company.totalOnlineHours.toFixed()}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{company.videoRequestNumber}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{company.totalClicks}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{company.newPoints || '~'}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{company.mergePoints || '~'}</td>
                  {/* <td className="px-2 py-4 whitespace-nowrap">{company.simulationRequests || '~'}</td> */}
                  <td className="px-2 py-4 whitespace-nowrap">{company?.eventStatusCounts.normal || '~'}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{company?.eventStatusCounts.abnormal || '~'}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{company?.eventStatusCounts.overlap || '~'}</td>
                  {/* eventStatusCounts:{normal?:number,abnormal?:number,overlap?:number} */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}