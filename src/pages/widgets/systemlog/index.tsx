import { useState, useEffect } from 'react';
import { DateTimeFilters } from '../../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../../utils/export';
import { RadioGroup } from '../../../components/ui/RadioGroup';
import { SystemLogApi } from '../../../api/SystemLog';
import { useQuery } from '@tanstack/react-query';
import { BaseParams, SystemLogApiResponse, SystemLogEntry } from '../../../types/systemLog';
import TablePagination from "@mui/material/TablePagination";
import LogItems from './LogItem';

const TableHeads = ["Time","Message","Type","Context","Trace"]

export function SystemLogPage() {
  const [logType, setLogType] = useState<'log' | 'error' | 'all'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [allLogs, setAllLogs] = useState<number | null>(null);
  const [filteredLogs,setFilteredLogs] = useState<SystemLogEntry[]>([])
  const [timeSearch,setTimeSearch] = useState({
    fromDateTime:'',
    toDateTime:'',
    exactDateTime:'',
    isExactSearch:false
  })

  const allParams = () => {
    const baseParams:BaseParams = { page: page + 1, rowsPerPage };

    if (logType !== 'all') baseParams.type = logType;
    if (timeSearch.fromDateTime) baseParams.fromDateTime = timeSearch.fromDateTime;
    if (timeSearch.toDateTime) baseParams.toDateTime = timeSearch.toDateTime;
    if (timeSearch.exactDateTime) {
      delete baseParams.fromDateTime;
      delete baseParams.toDateTime;
      baseParams.exactDateTime = timeSearch.exactDateTime;
    }
    return baseParams;
  };

 const { data, isPending, error, refetch } = useQuery<SystemLogApiResponse, Error>({
  queryKey: [
    'system-logs', 
    page + 1, 
    rowsPerPage, 
    logType !== 'all' ? logType : " ",
    timeSearch.fromDateTime || null,
    timeSearch.toDateTime || null,
    timeSearch.exactDateTime || null
  ], 
  queryFn: () => SystemLogApi.log(allParams()),
  refetchInterval: 60000, // 1 min
})


// get total numbers on first load and when filters change
useEffect(() => {
  if (allLogs === null && data?.total) setAllLogs(data?.total);

  if(data?.total! > 20 && logType === "error" || 
    data?.total! > 20 && logType === "log") setAllLogs(data?.total!);

  // when timeSearch get filled
  if(data?.total! > 20 && !!timeSearch.fromDateTime || data?.total! > 20 && !!timeSearch.exactDateTime ) setAllLogs(data?.total || 0)
  //when timeSearch get empty
  if(data?.total! > 20 && !timeSearch.fromDateTime || data?.total! > 20 && !timeSearch.exactDateTime ) setAllLogs(data?.total || 0)
},[filteredLogs,logType])


useEffect(() => {
  let logsToFilter = data?.result;

  if (logType !== 'all') {
    logsToFilter = logsToFilter?.filter((log) => log.type === logType);
  }

  setFilteredLogs (logsToFilter || []);
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

    if (!filters.fromDateTime && !filters.toDateTime && !filters.exactDateTime && !filters.isExactSearch) {
      refetch()
      setPage(0);
      setTimeSearch({
        fromDateTime:  '',
        toDateTime: '',
        exactDateTime: '',
        isExactSearch: false,
      });
      return;
    }

      if (filters.isExactSearch && filters.exactDateTime) {
        setTimeSearch({
          ...timeSearch,
          exactDateTime:  filters.exactDateTime,
        });
        setPage(0)
        refetch()
        return;
      } else if (!filters.isExactSearch && filters.fromDateTime && filters.toDateTime) {
        setTimeSearch({
          ...timeSearch,
          fromDateTime:  filters.fromDateTime,
          toDateTime: filters.toDateTime,
        });
        setPage(0)
        refetch()
        return;
      }

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
    setAllLogs(null)// set to null to set new total number on changing filter
    setPage(0); // reset to first page when changing type
    refetch()
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
                {
                  TableHeads.map((head,index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {head}
                  </th>
                  ))
                }
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                filteredLogs.length > 0 &&  
                <LogItems filteredLogs={filteredLogs} />
              }
              
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