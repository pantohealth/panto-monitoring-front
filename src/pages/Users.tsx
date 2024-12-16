import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../utils/export';
import { UserActivityRow } from '../components/users/UserActivityRow';
import { RadioGroup } from '../components/ui/RadioGroup';
import { Dropdown } from '../components/ui/Dropdown';
import { UserActivity } from '../api/UserActivity';
import { useQuery } from '@tanstack/react-query';
import { ExportUser, User } from '../types/user';
import moment from 'moment';

export function UsersPage() {
  const [selectedMetric, setSelectedMetric] = useState<'clicks' | 'online'>('clicks');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [filteredUsers,setFilteredUsers] = useState<User[]>([])
  const [timeSearch,setTimeSearch] = useState<User[]>([])

 
  const {data,isPending,error} = useQuery<User[], Error>({
      queryKey:['users'],
      queryFn: UserActivity.getUsersActivity,
      refetchInterval:60000 //1 min
    })
    console.log({data,isPending,error})


  //extract company name from data  
  const companyName = [...new Set(data?.map(data => data.company.name))].filter(item => item)

  useEffect(() => {
    const currentUsers = data?.filter((user) => {
      if (selectedUser && user.username !== selectedUser) return false;
      if (selectedCompany && user.company.name !== selectedCompany) return false;
      return true;
    }) || [];
    setFilteredUsers(currentUsers)
  },[data,timeSearch,selectedUser,selectedCompany])
   

  const handleExportPDF = () => {
    const exportData: ExportUser[] = (filteredUsers || [])?.map(user => ({
      username: user.username,
      company:  user.company.name || "Unknown",
      lastOnline: new Date(user.lastOnline).toLocaleString(),
      clicks: user.clicks,
    }));

    exportToPDF('User Activity Report', exportData, ['username', 'company', 'lastOnline', 'clicks']);
  };

  const handleExportExcel = () => {
    const exportData: ExportUser[] = (filteredUsers || [])?.map(user => ({
      username: user.username,
      company: user.company.name || "Unknown",
      lastOnline: new Date(user.lastOnline).toLocaleString(),
      clicks: user.clicks,
    }));

    exportToExcel('User Activity Report', exportData, ['username', 'company', 'lastOnline', 'clicks']);
  };
  
  const searchTimeHandler = async (filters: {
    fromDateTime: string;
    toDateTime: string;
    exactDateTime: string;
    isExactSearch: boolean;
  }) => {
    const { fromDateTime, toDateTime, exactDateTime, isExactSearch } = filters;
    if (!fromDateTime && !toDateTime && !exactDateTime && !isExactSearch) {
      setTimeSearch(filteredUsers)
      return;
    }

  
    const filteredData = filteredUsers.filter((item) => {
      const localTime = moment(exactDateTime).format('YYYY-MM-DDTHH:mm');
      const localDate = moment(item.lastOnline).local().format('YYYY-MM-DDTHH:mm') ;

      if (isExactSearch && exactDateTime) {
        return localDate === localTime; 
      } else if (!isExactSearch && fromDateTime && toDateTime) {
        return localDate >= fromDateTime && localDate <= toDateTime;
      }
      return true; 
    });

    setFilteredUsers(filteredData);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User Activity</h1>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={searchTimeHandler}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex gap-4">
            <Dropdown
              value={selectedUser}
              onChange={setSelectedUser}
              options={data?.map(user => user.username) || []}
              placeholder="Select User"
              isOpen={isUserDropdownOpen}
              onToggle={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            />
            <Dropdown
              value={selectedCompany}
              onChange={setSelectedCompany}
              options={companyName}
              placeholder="Select Company"
              isOpen={isCompanyDropdownOpen}
              onToggle={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
            />
          </div>
          <RadioGroup
            options={[
              { label: 'Click Rate', value: 'clicks' },
              { label: 'Online Rate', value: 'online' }
            ]}
            value={selectedMetric}
            onChange={(value) => setSelectedMetric(value as 'clicks' | 'online')}
          />
        </div>
        

        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className='flex flex-col'>
          {/* loading */}
          {isPending && <p className='loader mx-auto my-10 w-full h-full'></p>}
          {/* Error */}
          {!isPending && error && <p className='loader items-center  mx-auto my-10 w-full h-full'>{error?.message}</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Online
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Online
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedMetric === 'clicks' ? 'Clicks' : 'Clicks'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Graph
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers?.map((user) => (
                <UserActivityRow
                  key={user._id}
                  user={user}
                  selectedMetric={selectedMetric}
                />
              ))}
            </tbody>
          </table>
          </div>  
        </div>
        </div>
      </div>
    </div>
  );
}