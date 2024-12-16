import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { DataToServerLog } from '../../api/DataToServerLog';
import { ServerLogEntry } from '../../types/serverLog';
import { useEffect, useState } from 'react';


export function ServerLogPage() {

  const {data, isPending, error} = useQuery<ServerLogEntry[], Error>({
    queryKey:['server-log'],
    queryFn: DataToServerLog.serverLog,
    refetchInterval:60000 //1 min
  })
  
  const [timeSearch,setTimeSearch] = useState<ServerLogEntry[]>([])

  useEffect(() => {
    if (data?.data?.length > 0) {
      setTimeSearch(data?.data || []); 
    } 
  }, [data]);

  
  const formatDateTime = (date: string) =>
    date ? moment(date).format("DD/MMM/YYYY") : "~";
  const formatTime = (date: string) => (date ? moment(date).format("HH:mm") : "~");

  const handleExportPDF = () => {
    const filteredLogs = timeSearch?.map(d => ({
      ...d,
      device:d?.device?.[0].name,
      time: moment(d.time).format("DD/MMM/YYYY HH:mm"),
      createdAt: moment(d.createdAt).format("DD/MMM/YYYY HH:mm")
    }))
    exportToPDF('Server Logs', filteredLogs, [
      'time',
      'createdAt',
      'device',
      'acc',
      'systemMetric',
      'battery',
      'temp',
      'gps',
      'laser',
      'laserV',
      'tower',
      'error',
      'abnormal'
    ]);
  };

  const handleExportExcel = () => {
    const filteredLogs = timeSearch?.map(d => ({
      ...d,
      device:d?.device?.[0].name,
      time: moment(d.time).format("DD/MMM/YYYY HH:mm"),
      createdAt: moment(d.createdAt).format("DD/MMM/YYYY HH:mm")
    }))
    exportToExcel('Server Logs', filteredLogs, [
      'time',
      'createdAt',
      'device',
      'acc',
      'systemMetric',
      'battery',
      'temp',
      'gps',
      'laser',
      'laserV',
      'tower',
      'error',
      'abnormal'
    ]);
  };

  const searchTimeHandler = async (filters: {
    fromDateTime: string;
    toDateTime: string;
    exactDateTime: string;
    isExactSearch: boolean;
  }) => {
    const { fromDateTime, toDateTime, exactDateTime, isExactSearch } = filters;

    if (!fromDateTime && !toDateTime && !exactDateTime && !isExactSearch) {
      setTimeSearch(data?.data)
      return;
    }

  
    const filteredData = (data?.data || []).filter((item:ServerLogEntry) => {
      const localTime = moment(exactDateTime).format('YYYY-MM-DDTHH:mm');
      const localDate = moment(item.time).local().format('YYYY-MM-DDTHH:mm');

      if (isExactSearch && exactDateTime) {
        return localDate === localTime; 
      } else if (!isExactSearch && fromDateTime && toDateTime) {
        return localDate >= fromDateTime && localDate <= toDateTime;
      }
      return true; 
    });

    setTimeSearch(filteredData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Data to Server Log</h1>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={searchTimeHandler}
      />

      <div className="bg-white shadow rounded-lg">

        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* loading */}
            {isPending && <p className='loader mx-auto my-10 w-full h-full'></p>}
            {/* Error */}
          {!isPending && error && <p className='loader items-center  mx-auto my-10 w-full h-full'>{error?.message}</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky z-10 top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receive</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Acc</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">System</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Battery</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Temp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Gps</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Laser</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase whitespace-nowrap">Laser V</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Tower</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Error</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-yellow-500 uppercase tracking-wider">Abnormal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSearch?.map((log: ServerLogEntry) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900  items-center">
                    <div className='flex flex-col items-center'>
                      {formatDateTime(log?.time)}
                      <span>{formatTime(log?.time)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 flex  items-center">
                    <div className='flex flex-col items-center'>
                      {formatDateTime(log?.createdAt)}
                      <span>{formatTime(log?.createdAt)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log?.device?.[0]?.name || "~"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.acc || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.systemMetric || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.battery || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.temp || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.gps || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.laser || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.laserV || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.tower || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{log?.error || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600">{log?.abnormal || '~'}</td>
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