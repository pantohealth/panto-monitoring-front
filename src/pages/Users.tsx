import React, { useState } from 'react';
import { DateTimeFilters } from '@/components/filters/DateTimeFilters';
import { exportToPDF } from '@/utils/export';
import type { FilterState } from '@/store/filters';
import { isWithinInterval, parseISO, isEqual } from 'date-fns';

const ALL_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', lastLogin: '2024-03-15T10:30:00' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', lastLogin: '2024-03-14T15:45:00' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', lastLogin: '2024-03-13T09:15:00' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Admin', lastLogin: '2024-03-12T14:20:00' },
];

const COLUMNS = ['ID', 'Name', 'Email', 'Role', 'Last Login'];

export function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState(ALL_USERS);

  const handleSearch = (filters: FilterState) => {
    let filtered = ALL_USERS;

    if (filters.isExactSearch && filters.exactDateTime) {
      const exactDate = parseISO(filters.exactDateTime);
      filtered = ALL_USERS.filter(user => 
        isEqual(parseISO(user.lastLogin), exactDate)
      );
    } else if (!filters.isExactSearch && (filters.fromDateTime || filters.toDateTime)) {
      filtered = ALL_USERS.filter(user => {
        const loginDate = parseISO(user.lastLogin);
        const start = filters.fromDateTime ? parseISO(filters.fromDateTime) : new Date(0);
        const end = filters.toDateTime ? parseISO(filters.toDateTime) : new Date();
        
        return isWithinInterval(loginDate, { start, end });
      });
    }

    setFilteredUsers(filtered);
  };

  const handleExport = () => {
    exportToPDF('User Management Report', filteredUsers, ['id', 'name', 'email', 'role', 'lastLogin']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
      </div>
      
      <DateTimeFilters onExport={handleExport} onSearch={handleSearch} />
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.lastLogin).toLocaleString()}
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