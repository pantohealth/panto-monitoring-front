import moment from 'moment';

import { Button } from '../../../components/ui/Button';
import { FileDown, Trash2 } from 'lucide-react';

import { Task } from '../../../types/developerReports';

interface ReportsTableProps {
  reports: Task[];
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
  isDownloading: Record<number, boolean>;
  isPending:boolean;
}


export function ReportsTable({ reports, onDelete,  onDownload, isDownloading, isPending }: ReportsTableProps) {
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
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CreatedAt</th> */}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">starttime</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">endtime</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports?.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{task.applicator.username}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.deviceId?.name || "~"}
                </td>
                <td className="px-2 py-4 text-sm text-gray-900">{task.condition}</td>
                {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {moment(task.createdAt).format('YYYY-MM-DDTHH:mm')}
                </td> */}
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.start ? moment(task.start).format('YYYY-MM-DDTHH:mm') : '~'}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.end ? moment(task.end).format('YYYY-MM-DDTHH:mm') : '~'}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button variant="ghost" onClick={() => task._id && onDelete(task?._id)}>
                    <Trash2 />
                  </Button>
                  <Button
                      variant="ghost"
                      onClick={() => task._id && onDownload(task?._id)}
                      disabled={task._id && isDownloading[task?._id]}
                    >
                      <div className="flex flex-col items-center">
                        <FileDown />
                        {task._id && isDownloading[task._id] && (
                          <span className="text-xs">Downloading...</span>
                        )}
                      </div>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}