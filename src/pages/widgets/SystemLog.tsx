import { useState, useEffect } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { RadioGroup } from '../../components/ui/RadioGroup';
import { SystemLogApi } from '../../api/SystemLog';
import { useQuery } from '@tanstack/react-query';
import { SystemLogApiResponse, SystemLogEntry } from '../../types/systemLog';


export function SystemLogPage() {
  const [logType, setLogType] = useState<'log' | 'error' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLogs,setFilteredLogs] = useState<SystemLogEntry[]>([])
  const itemsPerPage = 20;

 const {data ,isPending ,error} = useQuery<SystemLogApiResponse , Error>({
  queryKey: ['system-logs'],
  queryFn: SystemLogApi.log,
  refetchInterval:60000 // 1hour
 })

  useEffect(() => {
    if (data?.result) {  
      if (logType === 'all') {
        setFilteredLogs(data.result); 
      } else {
        setFilteredLogs(data.result.filter(log => log?.type === logType));  
      }
    }
  }, [logType, data?.result]);



  const handleExportPDF = () => {
    if(filteredLogs){
      exportToPDF('System Logs', filteredLogs, ['time', 'message', 'type', 'context', 'trace']);
    }
  };

  const handleExportExcel = () => {
    if(filteredLogs){
      exportToExcel('System Logs', filteredLogs, ['time', 'message', 'type', 'context', 'trace']);
    }
  };

  // const handleSearch = async () => {
  //   try {
  //     const params = new URLSearchParams({
  //       page: currentPage.toString(),
  //       limit: itemsPerPage.toString(),
  //       type: logType
  //     });

  //     // In a real app, you would use these parameters to fetch data
  //     const url = `https://apiv4dev.pantohealth.com/api/v4/log?${params}`;
  //     console.log('Fetching logs from:', url);
  //   } catch (error) {
  //     console.error('Failed to fetch logs:', error);
  //   }
  // };

  const handleTypeChange = (value: string) => {
    setLogType(value as 'log' | 'error' | 'all');
    setCurrentPage(1); // Reset to first page when changing type
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">System Log</h1>
      

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        // onSearch={handleSearch}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg">
      
        <div className="p-4 border-b border-gray-200 flex justify-between">
          <RadioGroup
            options={[
              { label: 'All Logs', value: 'all' },
              { label: 'Errors Only', value: 'error' },
              { label: 'Logs Only', value: 'log' },
            ]}
            value={logType}
            onChange={handleTypeChange}
          />
          <div className='bg-gray-100 text-gray-800 px-4 py-1 rounded-full'>{filteredLogs.length} Requests</div>
        </div>
        <div className="overflow-x-auto">

          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className='flex flex-col'>
          {/* loading */}
          {isPending && <p className='loader items-center  mx-auto my-10 w-full h-full'></p>}
          {/* Error */}
          {error && <p className='loader items-center  mx-auto my-10 w-full h-full'>Somthing Went Wrong,Please Try again.</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Context
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trace
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs?.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log?.time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log?.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log?.type === 'error' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {log?.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log?.context || "~"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-lg overflow-hidden ">
                      {log?.trace?.slice(0,140) || "~"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </div>
        </div>
          

        {/* <div className="px-6 py-4 border-t border-gray-200"> */}
          {/* <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50"
            >
              Next
            </button>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}