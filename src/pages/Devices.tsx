import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToExcel, exportToPDF } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';
import { useQuery } from '@tanstack/react-query';
import { Devices } from '../api/Devices';
import { AllDevices } from '../api/allDevices';
import { DEVICE_STATUS, DEVICES } from '../types/devices';


const COLUMNS = ['Device', 'Normal', 'Abnormal','Overlap', 'New Points', 'Total Events'];

export function DevicesPage() {

  const {data, isPending, error} = useQuery<DEVICE_STATUS[]>({
    queryKey: ['devices'],
    queryFn: Devices.devices,
    refetchInterval: 60000 //60 sec
  })

  const {data: devices} = useQuery<DEVICES[]>({
    queryKey: ['all-devices'],
    queryFn: AllDevices.devices
  })

  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState(data);

  const handleExportPDF = () => {
    const formatedFilteredDevices = filteredDevices?.map(device => ({
      ...device,
      normal:device?.eventStatusCounts.normal,
      abnormal:device?.eventStatusCounts.abnormal,
      overlap:device?.eventStatusCounts.overlap,
    }))
    if(formatedFilteredDevices){
    exportToPDF('Devices Report', formatedFilteredDevices, ['name', 'normal', 'abnormal','overlap', 'newPoint']);
    }
  };

  const handleExportExcel = () => {
    const formatedFilteredDevices = filteredDevices?.map(device => ({
      ...device,
      normal:device.eventStatusCounts.normal,
      abnormal:device.eventStatusCounts.abnormal,
      overlap:device.eventStatusCounts.overlap,
    }))
    if(formatedFilteredDevices){
    exportToExcel('Devices Report', formatedFilteredDevices, ['name', 'normal', 'abnormal','overlap', 'newPoint']);
    }
  };

  const handleDeviceSelect = (device: string) => {
    setSelectedDevice(device);
    setIsDropdownOpen(false);
    if (device) {
      setFilteredDevices(data?.filter(d => d.name === device));
    } else {
      setFilteredDevices(data);
    }
  };

  useEffect(() => {
    handleDeviceSelect(selectedDevice);
  }, [selectedDevice,data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
      </div>

      <DateTimeFilters onExport={handleExportPDF} onExportExcel={handleExportExcel} />

      <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200 flex gap-4">
          <Dropdown
            value={selectedDevice}
            onChange={setSelectedDevice}
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
            <thead className="bg-gray-50 sticky top-0 z-10">
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
              {filteredDevices?.map((device) => (
                <tr key={device._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{device.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device?.eventStatusCounts?.normal || '~'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device?.eventStatusCounts?.abnormal || '~'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device?.eventStatusCounts?.overlap || '~'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device?.newPoints || '~'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{device?.totalEvents || '~'}</td>
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