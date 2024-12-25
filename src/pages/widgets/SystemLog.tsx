import { useState, useEffect } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { RadioGroup } from '../../components/ui/RadioGroup';
import { SystemLogApi } from '../../api/SystemLog';
import { useQuery } from '@tanstack/react-query';
import { SystemLogApiResponse, SystemLogEntry } from '../../types/systemLog';
import moment from 'moment';
import TablePagination from "@mui/material/TablePagination";


export function SystemLogPage() {
  const [logType, setLogType] = useState<'log' | 'error' | 'all'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [allLogs, setAllLogs] = useState<number | null>(null);
  const [filteredLogs,setFilteredLogs] = useState<SystemLogEntry[]>([])
  // const [timeSearch,setTimeSearch] = useState<SystemLogEntry[]>([])

 const { data, isPending, error } = useQuery<SystemLogApiResponse, Error>({
  queryKey: ['system-logs', page + 1, rowsPerPage, logType !== 'all' ? logType : " "], 
  queryFn: () => {
    const params = logType !== 'all' ? { page: page + 1, rowsPerPage, type: logType } : { page: page + 1, rowsPerPage };
    return SystemLogApi.log(params);
  },
  refetchInterval: 60000, // 1 hour
})

// get total numbers on first load and when filters change
useEffect(() => {
  if (allLogs === null && data?.total) setAllLogs(data?.total);

  if(data?.total! > 20 && logType === "error" || data?.total! > 20 && logType === "log") setAllLogs(data?.total!);
},[filteredLogs,logType])


useEffect(() => {
  let logsToFilter = data?.result;

  if (logType !== 'all') {
    logsToFilter = logsToFilter?.filter((log) => log.type === logType);
  }

  setFilteredLogs(logsToFilter || []);
}, [logType, data]);

const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newRowsPerPage = parseInt(event.target.value, 10);
  setRowsPerPage(newRowsPerPage);
  setPage(0);
};

  const searchTimeHandler = async (filters: {
    fromDateTime: string;
    toDateTime: string;
    exactDateTime: string;
    isExactSearch: boolean;
  }) => {
    const { fromDateTime, toDateTime, exactDateTime, isExactSearch } = filters;

    if (!fromDateTime && !toDateTime && !exactDateTime && !isExactSearch) {
      setFilteredLogs(filteredLogs)
      return;
    }

    
    const filteredData = filteredLogs.filter((item) => {
      const localTime = moment(exactDateTime).format('YYYY-MM-DDTHH:mm');
      const localDate = moment(item.time).local().format('YYYY-MM-DDTHH:mm');

      if (isExactSearch && exactDateTime) {
        return localDate === localTime; 
      } else if (!isExactSearch && fromDateTime && toDateTime) {
        return localDate >= fromDateTime && localDate <= toDateTime;
      }
      return true; 
    });
    setFilteredLogs(filteredData);
  };

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

  const handleTypeChange = (value: string) => {
    setLogType(value as 'log' | 'error' | 'all');
    setPage(0); // Reset to first page when changing type
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">System Log</h1>
      

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={searchTimeHandler}
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
          <div className='bg-gray-100 text-gray-800 flex items-center md:text-base text-xs md:px-4 pl-6 py-1 rounded-full'>{allLogs || "...."} Requests</div>
        </div>
        <div className="overflow-x-auto">

          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className='flex flex-col'>
          {/* loading */}
          {isPending && <p className='loader items-center  mx-auto my-10 w-full h-full'></p>}
          {/* Error */}
          {!isPending && error && <p className='items-center  mx-auto my-10 w-full h-full'>{error?.message}</p>}
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
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-wrap">
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
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <TablePagination
          component="div"
          count={allLogs || 0} // Total number of entries
          page={page} // Current page
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage} // Entries per page
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]} 
          labelRowsPerPage="Entries per page"
        />
          
        </div>
      </div>
    </div>
  );
}