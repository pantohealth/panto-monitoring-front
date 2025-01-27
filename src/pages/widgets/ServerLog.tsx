import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { DataToServerLog } from '../../api/DataToServerLog';
import { BaseParams, ServerLogEntry } from '../../types/serverLog';
import { useEffect, useState } from 'react';
import TablePagination from "@mui/material/TablePagination";
import { Dropdown } from '../../components/ui/Dropdown';
import { AllDevices } from '../../api/allDevices';
import { DEVICES } from '../../types/devices';

const COLUMNS = [
"Record",
"Receive",
"Device",
"Acc",
"System Metric",
"Battery",
"Temp",
"Events",
"roof Acceleration",
"Gps",
"Laser",
"Laser V",
"Tower",
"Error",
"Abnormal",
]

interface ServerLogResponse{
 results: ServerLogEntry[];
 total:number;
}

export function ServerLogPage() {
  
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logs,setLogs] = useState<ServerLogEntry[]>([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [allLogs, setAllLogs] = useState<number | null>(null);
  const [timeSearch,setTimeSearch] = useState({
    fromDateTime:'',
    toDateTime:'',
    exactDateTime:'',
    isExactSearch:false
  })

  const allParams = () => {
    const baseParams:BaseParams = { page: page + 1, rowsPerPage };

      
  if (selectedDevice) {
    const selectedDeviceId = devices?.find((device) => device.name === selectedDevice)?._id;
    if (selectedDeviceId) {
      baseParams.deviceIds = [selectedDeviceId]; 
    }
  }

    if (timeSearch.fromDateTime) baseParams.fromDateTime = timeSearch.fromDateTime;
    if (timeSearch.toDateTime) baseParams.toDateTime = timeSearch.toDateTime;
    if (timeSearch.exactDateTime) {
      delete baseParams.fromDateTime;
      delete baseParams.toDateTime;
      baseParams.exactDateTime = timeSearch.exactDateTime;
    }
    return baseParams;
  };

  const {data, isPending, error} = useQuery<ServerLogResponse, Error>({
    queryKey:[
    'server-log',
    page + 1, 
    rowsPerPage, 
    timeSearch.fromDateTime || null,
    timeSearch.toDateTime || null,
    timeSearch.exactDateTime || null,
    selectedDevice || null
    ],
    queryFn: () => DataToServerLog.serverLog(allParams()),
    refetchInterval:60000 //1 min
  })

    const {data: devices} = useQuery<DEVICES[]>({
      queryKey: ['all-devices'],
      queryFn: AllDevices.devices
    })


  useEffect(() => {
    if (data && data.results && data?.results?.length >= 0 ) {
      setLogs(data?.results || []); 
    } 

    // When there are no data for selected device
    if (data?.total === 0 && data?.results?.length >= 0) setAllLogs(data?.total);

    if (allLogs === null && data?.total) setAllLogs(data?.total);
    // when timeSearch get filled
    if(data?.total! > 20 && !!timeSearch.fromDateTime || data?.total! > 20 && !!timeSearch.exactDateTime ) setAllLogs(data?.total || 0)
    //when timeSearch get empty
    if(data?.total! > 20 && !timeSearch.fromDateTime || data?.total! > 20 && !timeSearch.exactDateTime ) setAllLogs(data?.total || 0)
  }, [data]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

const handleDeviceSelect = (deviceName: string) => {
  setSelectedDevice(deviceName);
  setPage(0);
};

  
  const formatDateTime = (date: string) =>
    date ? moment(date).format("DD/MMM/YYYY") : "~";
  const formatTime = (date: string) => (date ? moment(date).format("HH:mm") : "~");

  const handleExportPDF = () => {
    const filteredLogs = logs?.map(d => ({
      ...d,
      device:d?.device?.name,
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
      'events',
      'roofAcceleration',
      'gps',
      'laser',
      'laserV',
      'tower',
      'error',
      'abnormal'
    ]);
  };

  const handleExportExcel = () => {
    const filteredLogs = logs?.map((d) => ({
      ...d,
      device:d?.device?.name,
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
      'events',
      'roofAcceleration',
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
    if (!filters.fromDateTime && !filters.toDateTime && !filters.exactDateTime && !filters.isExactSearch) {
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
        return;
      } else if (!filters.isExactSearch && filters.fromDateTime && filters.toDateTime) {
        setTimeSearch({
          ...timeSearch,
          fromDateTime:  filters.fromDateTime,
          toDateTime: filters.toDateTime,
        });
        setPage(0)
        return;
      }
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
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <Dropdown
            value={selectedDevice}
            onChange={handleDeviceSelect}
            options={devices ? devices?.map(d => d.name) : []}
            placeholder="Select Device"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* loading */}
            {isPending && <p className='loader mx-auto my-10 w-full h-full'></p>}
            {/* Error */}
          {!isPending && error && <p className='items-center  mx-auto my-10 w-full h-full'>{error?.message}</p>}
          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50 sticky z-10 top-0">
              <tr>
                {COLUMNS.map((col,index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y  divide-gray-200">
              {logs.length > 0 ? logs?.map((log: ServerLogEntry) => (
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

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log?.device?.name || "~"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.acc || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.systemMetric || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.battery || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.temp || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.events || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.roofAcceleration || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.gps || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.laser || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.laserV || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{log?.tower || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{log?.error || '~'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600">{log?.abnormal || '~'}</td>
                </tr>
              )) : <p className='flex items-center mx-auto'>No data Found :(</p>}
            </tbody>
          </table>
        </div>
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