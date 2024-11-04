import React from 'react';
import { DateTimeFilters } from '@/components/filters/DateTimeFilters';
import { exportToPDF } from '@/utils/export';

const MOCK_COMPANIES = [
  { id: 1, name: 'Railway Corp', type: 'Railway', status: 'Active', lastUpdate: '2024-03-15 10:30:00' },
  { id: 2, name: 'Metro Systems', type: 'Metro', status: 'Active', lastUpdate: '2024-03-15 09:45:00' },
  { id: 3, name: 'Tram Operations', type: 'Tram', status: 'Inactive', lastUpdate: '2024-03-14 15:20:00' },
];

const COLUMNS = ['ID', 'Name', 'Type', 'Status', 'Last Update'];

export function CompanyPage() {
  const handleExport = () => {
    exportToPDF('Company Report', MOCK_COMPANIES, ['id', 'name', 'type', 'status', 'lastUpdate']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Company</h1>
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
              {MOCK_COMPANIES.map((company) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{company.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}