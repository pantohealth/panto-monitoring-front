import { useEffect, useState } from 'react';
import TablePagination from "@mui/material/TablePagination";
import { FootprintsIcon, User } from 'lucide-react';

import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Dropdown } from '../../components/ui/Dropdown';


const MOCK_JOURNEYS = [
  {
    id: 1,
    userId: 'USR-001',
    username: 'John Doe',
    company: 'panto',
    time: '2024-03-15T10:00:00',
    keyinteraction:'Login',
  },
  {
    id: 2,
    userId: 'USR-002',
    username: 'Jane Smith',
    company: 'test',
    time: '2024-03-15T10:00:00',
    keyinteraction:'Login',
  },
  {
    id: 3,
    userId: 'USR-002',
    username: 'Matt Smith',
    company: 'test',
    time: '2024-03-16T10:00:00',
    keyinteraction:'Report',
  }
];

const AVAILABLE_INTERACTIONS = [
  'Login',
  'Report',
  'Go Check Status',
  'Add User',
];


export function UserJourneyPage() {
  const [selectedInteractoin, setSelectedInteractoin] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredInteractions, setFilteredInteractions] = useState(MOCK_JOURNEYS);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); // Items per page

  useEffect(() => {
    handleInteractionSelect(selectedInteractoin);
  }, [selectedInteractoin]);


  const handleInteractionSelect = (inter: string) => {
    setSelectedInteractoin(inter);
    setIsDropdownOpen(false);
    if (inter) {
      const filtered = MOCK_JOURNEYS.filter(c => c.keyinteraction === inter);
      setFilteredInteractions(filtered);
    } else {
      setFilteredInteractions(MOCK_JOURNEYS);
    }
  };


const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage:number) => {
  setPage(newPage);
};
        
// Handle rows per page change
const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0); // Reset to the first page
};
      
// Paginated data
const paginatedUsers = filteredInteractions.
slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  const handleExportPDF = () => {
    exportToPDF('User Journey Report', filteredInteractions, [
      'userId',
      'username',
      'company',
      'time',
      'keyinteraction',
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('User Journey Report', filteredInteractions, [
      'userId',
      'username',
      'company',
      'time',
      'keyinteraction',
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

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <Dropdown
            value={selectedInteractoin}
            onChange={setSelectedInteractoin}
            options={AVAILABLE_INTERACTIONS}
            placeholder="Select Interaction"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UserName</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Interactions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((journey) => (
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
                    {journey.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{journey.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{journey.keyinteraction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <TablePagination
          component="div"
          count={filteredInteractions.length} // Total number of entries
          page={page} // Current page
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage} // Entries per page
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]} 
          labelRowsPerPage="Entries per page"
        />
        </div>
      </div>
    </div>
  );
}