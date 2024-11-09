import { useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../utils/export';
import { UserActivityRow } from '../components/users/UserActivityRow';
import { RadioGroup } from '../components/ui/RadioGroup';
import { Dropdown } from '../components/ui/Dropdown';

const MOCK_USERS = [
  {
    id: 1,
    name: 'Davoud',
    company: 'PANTOhealth',
    lastSeen: '2024-03-15T10:30:00',
    clicks: 43,
    onlineTime: 5,
    clickHistory: [0, 5, 10, 43, 20, 15],
    onlineHistory: [0, 1, 3, 5, 2, 1],
    timeLabels: ['1h', '2h', '3h', '4h', '5h', 'Now']
  },
  {
    id: 2,
    name: 'Samira',
    company: 'PANTOhealth',
    lastSeen: '2024-03-15T10:45:00',
    clicks: 605,
    onlineTime: 48,
    clickHistory: [100, 200, 400, 605, 300, 250],
    onlineHistory: [10, 20, 30, 48, 25, 15],
    timeLabels: ['1h', '2h', '3h', '4h', '5h', 'Now']
  },
  {
    id: 3,
    name: 'Mety',
    company: 'PANTOhealth',
    lastSeen: '2024-03-14T23:30:00',
    clicks: 239,
    onlineTime: 24,
    clickHistory: [50, 100, 150, 239, 180, 120],
    onlineHistory: [5, 10, 15, 24, 18, 12],
    timeLabels: ['1h', '2h', '3h', '4h', '5h', 'Now']
  }
];

const AVAILABLE_COMPANIES = ['PANTOhealth', 'RailTech', 'TrainCorp'];

export function UsersPage() {
  const [selectedMetric, setSelectedMetric] = useState<'clicks' | 'online'>('clicks');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const filteredUsers = MOCK_USERS.filter(user => {
    if (selectedUser && user.name !== selectedUser) return false;
    if (selectedCompany && user.company !== selectedCompany) return false;
    return true;
  });

  const handleExportPDF = () => {
    const exportData = filteredUsers.map(user => ({
      name: user.name,
      company: user.company,
      lastSeen: new Date(user.lastSeen).toLocaleString(),
      clicks: user.clicks,
      onlineTime: `${user.onlineTime}h`
    }));

    exportToPDF('User Activity Report', exportData, ['name', 'company', 'lastSeen', 'clicks', 'onlineTime']);
  };

  const handleExportExcel = () => {
    const exportData = filteredUsers.map(user => ({
      name: user.name,
      company: user.company,
      lastSeen: new Date(user.lastSeen).toLocaleString(),
      clicks: user.clicks,
      onlineTime: `${user.onlineTime}h`
    }));

    exportToExcel('User Activity Report', exportData, ['name', 'company', 'lastSeen', 'clicks', 'onlineTime']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User Activity</h1>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex gap-4">
            <Dropdown
              value={selectedUser}
              onChange={setSelectedUser}
              options={MOCK_USERS.map(user => user.name)}
              placeholder="Select User"
              isOpen={isUserDropdownOpen}
              onToggle={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            />
            <Dropdown
              value={selectedCompany}
              onChange={setSelectedCompany}
              options={AVAILABLE_COMPANIES}
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
                  {selectedMetric === 'clicks' ? 'Clicks' : 'Online (h)'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Graph
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <UserActivityRow
                  key={user.id}
                  user={user}
                  selectedMetric={selectedMetric}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}