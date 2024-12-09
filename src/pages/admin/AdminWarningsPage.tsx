import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import TablePagination from "@mui/material/TablePagination";
import moment from 'moment';

import { Warnings } from '../../api/Warnings';

import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { Dropdown } from '../../components/ui/Dropdown';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

import { exportToPDF, exportToExcel } from '../../utils/export';

import { Warning } from '../../types/warning';
import { AllDevices } from '../../api/allDevices';
import { DEVICES } from '../../types/devices';


const WARNING_TYPES = ['Device','System', 'Ai'];
const SIDES = ['Backend', 'Frontend'];
const ACTIONS = ['Notice', 'Remove'];

export function AdminWarningsPage() {

  const {data, isPending, error} = useQuery({
    queryKey: ['warnings'],
    queryFn: Warnings.getWarnings
  })

  const { data:devices } = useQuery<DEVICES[]>({
    queryKey: ['devices'],
    queryFn: AllDevices.devices
  })

  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSideDropdownOpen, setIsSideDropdownOpen] = useState(false);
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [filteredWarnings, setFilteredWarnings] = useState<Warning[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warningDetails,setWarningDetails] = useState<Warning | null>(null)
  const [timeSearch,setTimeSearch] = useState<Warning[]>([])

  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); // Items per page


  // Update filtered warnings when filters change
  useEffect(() => {
    const filtered = data?.result.filter((warning:Warning) => {
      if (selectedType.toLowerCase() && warning.type !== selectedType.toLowerCase() ) return false;
      if (selectedSide.toLowerCase() && warning.side !== selectedSide.toLowerCase()) return false;
      if (selectedDevice && warning.device?.name !== selectedDevice) return false;
      if (selectedAction.toLowerCase() && warning.action !== selectedAction.toLowerCase()) return false;
      return true;
    });
    setFilteredWarnings(filtered);
  }, [data,selectedType, selectedSide, selectedDevice, selectedAction,timeSearch]);

  
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage:number):void => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  

  // Paginated data
  const paginatedWarnings = filteredWarnings?.length > 0
  ? filteredWarnings?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  : [];


  const handleExportPDF = () => {
    const formattedWarnings = filteredWarnings.map(warning => ({
      ...warning,  
      device: warning.device?.name || "~",  
    }));

    exportToPDF('System Warnings Report', formattedWarnings, [
      'time',
      'type',
      'side',
      'device',
      'action',
      'status',
      'message',
    ]);
  };

  const handleExportExcel = () => {
    const formattedWarnings = filteredWarnings.map(warning => ({
      ...warning,  
      device: warning.device?.name || "~",  
    }));
  
    exportToExcel('System Warnings Report', formattedWarnings, [
      'time',
      'type',
      'side',
      'device',  
      'action',
      'status',
      'message',
    ]);
  };

  const searchTimeHandler = (filters: {
    fromDateTime: string;
    toDateTime: string;
    exactDateTime: string;
    isExactSearch: boolean;
  }) => {
    const { fromDateTime, toDateTime, exactDateTime, isExactSearch } = filters;

    if (!fromDateTime && !toDateTime && !exactDateTime && !isExactSearch) {
      setTimeSearch(filteredWarnings)
      return;
    }
  
    const filteredData = filteredWarnings.filter((item) => {
      const localTime = moment(exactDateTime).format('YYYY-MM-DDTHH:mm');
      const localDate = moment(item.time).local().format('YYYY-MM-DDTHH:mm') ;
      if (isExactSearch && exactDateTime) {
        return localDate === localTime; 
      } else if (!isExactSearch && fromDateTime && toDateTime) {
        return localDate >= fromDateTime && localDate <= toDateTime;
      }
      return true; 
    });

    setFilteredWarnings(filteredData);
  };

  const detailModal = (id:number) => {
    const modalId = filteredWarnings.find(warning => warning._id === id)
    if(modalId){
      setIsModalOpen(true)
      setWarningDetails(modalId)
    } 
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        
        <h1 className="text-2xl font-semibold text-gray-900">Warnings page</h1>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={searchTimeHandler}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 grid grid-cols-4 gap-2">
        {/*  Modal */}
        <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Details Report"
      >
        <div className="space-y-4">
          {
            warningDetails ?
            <div>
             <span className='flex my-2'>
              <strong>DeviceName:</strong>
              <p className='px-2 mx-2 bg-slate-300 rounded-md'>{warningDetails?.detail.deviceName || '~'}</p></span> 
              <span className='flex my-2'><strong>Type:</strong>
              <p className='px-2 mx-2 bg-slate-300 rounded-md'>{warningDetails?.detail.type || '~'}</p></span>
              <div className='my-2'>
              <strong>EventIds:</strong>
              {
                warningDetails?.detail?.eventIds?.map(e => (
                    <p className='px-2 my-2 w-fit bg-slate-300 rounded-md'>{e}</p>
                  )
                )
              }
              </div>
              <span className='flex my-2'><strong>SignalId:</strong>
              <p className='px-2 mx-2 bg-slate-300 rounded-md'>{warningDetails.detail.signalId || '~'}</p></span>
              <span className='flex my-2'><strong>PassedTime:</strong>
              <p className='px-2 mx-2 bg-slate-300 rounded-md'>{warningDetails.detail.passedTime || '~'}</p></span>
              <span className='flex my-2'><strong>Time:</strong>
              <p className='px-2 mx-2 bg-slate-300 rounded-md'>{new Date(warningDetails.detail.time).toLocaleString()}</p></span>
            </div> : <p>Loading</p>
          }
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        </Modal>
          <Dropdown
            value={selectedType}
            onChange={setSelectedType}
            options={WARNING_TYPES}
            placeholder="Filter Type"
            isOpen={isTypeDropdownOpen}
            onToggle={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          />
          <Dropdown
            value={selectedSide}
            onChange={setSelectedSide}
            options={SIDES}
            placeholder="Filter Side"
            isOpen={isSideDropdownOpen}
            onToggle={() => setIsSideDropdownOpen(!isSideDropdownOpen)}
          />
          <Dropdown
            value={selectedDevice}
            onChange={setSelectedDevice}
            options={devices?.map((d) => d.name)}
            placeholder="Filter Device"
            isOpen={isDeviceDropdownOpen}
            onToggle={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
          />
          <Dropdown
            value={selectedAction}
            onChange={setSelectedAction}
            options={ACTIONS}
            placeholder="Filter Action"
            isOpen={isActionDropdownOpen}
            onToggle={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
          />
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className='flex flex-col'>
          {/* loading */}
          {isPending && <p className='loader mx-auto my-10 w-full h-full'></p>}
          {/* Error */}
          {error && <p className='loader items-center  mx-auto my-10 w-full h-full'>Somthing Went Wrong,Please Try again.</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedWarnings?.map((warning) => (
                <tr key={warning?._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(warning.time).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><span className='text-xs'>from</span> {warning.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.side}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.device?.name || "~"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warning.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {warning.status}
                    </span>
                  </td>
                  <td className="px-6 py-4  text-sm text-gray-900">{warning.message || "~"}</td>
                  {
                    warning?.detail ? 
                    <td className="px-6 py-4 text-sm text-gray-900"><Button onClick={() => {
                      detailModal(warning?._id)
                    }}>Details</Button></td> :
                    <td className="px-6 py-4 text-sm text-gray-900">~</td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <TablePagination
          component="div"
          count={filteredWarnings?.length} // Total number of entries
          page={page} // Current page
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage} // Entries per page
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]} 
          labelRowsPerPage="Entries per page"
        />
          
        </div>
        </div>
      </div>
    </div>
  );
}