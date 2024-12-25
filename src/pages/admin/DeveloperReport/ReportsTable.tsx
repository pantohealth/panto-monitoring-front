
import { Button } from '../../../components/ui/Button';
import { FileDown } from 'lucide-react';

import { Task } from '../../../types/developerReports';

interface ReportsTableProps {
  reports: Task;
  onDownload: () => void;
  isDownloading:  boolean;
  isPending:boolean;
}


export function ReportsTable({ reports, onDownload, isDownloading, isPending }: ReportsTableProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="overflow-x-auto">
        {/* loading */}
        {isPending && <p className='loader mx-auto my-10 w-full h-full'></p>}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicator</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                {
                  reports?.name && <>
                
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{reports.name}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{reports?.applicator?.username}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{reports.name&& "~" }</td>
                
                <td className="px-2 py-4 text-sm text-gray-900">{reports.condition}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button
                      variant="ghost"
                      onClick={() => onDownload()}
                      disabled={isDownloading}
                    >
                      <div className="flex flex-col items-center">
                        <FileDown />
                        {isDownloading && (
                          <span className="text-xs">Downloading...</span>
                        )}
                      </div>
                    </Button>
                </td> 
                </>
                }
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}