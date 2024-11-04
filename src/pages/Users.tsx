import React from 'react';
import { DateTimeFilters } from '@/components/filters/DateTimeFilters';
import { exportToPDF } from '@/utils/export';

const MOCK_USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', lastLogin: '2024-03-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', lastLogin: '2024-03-14' },
];

const COLUMNS = ['ID', 'Name', 'Email', 'Role', 'Last Login'];

export function UsersPage() {
  const handleExport = () => {
    exportToPDF('User Management Report', MOCK_USERS, ['id', 'name', 'email', 'role', 'lastLogin']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
      </div>
      
      <DateTimeFilters onExport={handleExport} />
      
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
              {MOCK_USERS.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}