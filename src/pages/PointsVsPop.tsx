import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToExcel, exportToPDF } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';
import { useQuery } from '@tanstack/react-query';
import { AllDevices } from '../api/allDevices';
import {  DEVICES } from '../types/devices';
import { DevicesPop } from '../api/pointsVsPop';

import {  ResponsiveContainer } from 'recharts';
import PointChart from '../components/ui/pointChart/PointChart';
import { PopData } from '../types/pointvspop';


const COLUMNS = ['Device', 'Pop Analysis'];

export function Points() {

  const {data, isPending, error} = useQuery<PopData[]>({
    queryKey: ['pop'],
    queryFn: DevicesPop.pointsVsPop,
    // refetchInterval: 60000 //60 sec
  })

  const {data: devices} = useQuery<DEVICES[]>({
    queryKey: ['all-devices'],
    queryFn: AllDevices.devices
  })

  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState(data);


  const handleExportPDF = () => {
    const formatedFilteredPoints = filteredDevices?.map(device => ({
        ...device,
        points:device.points.join(", "),
      }))
    if(formatedFilteredPoints){
    exportToPDF('Points Report', formatedFilteredPoints, ['name', 'points']);
    }
  };

  const handleExportExcel = () => {
    const formatedFilteredPoints = filteredDevices?.map(device => ({
      ...device,
      points:device.points.join(", "),
    }))
    if(formatedFilteredPoints){
    exportToExcel('Points Report', formatedFilteredPoints, ['name', 'points']);
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
        <h1 className="text-2xl font-semibold text-gray-900">Points vs Pop</h1>
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
          {error && !isPending && <p className='items-center mx-auto my-10 w-full h-full'>{error?.message}</p>}
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

                  <ResponsiveContainer width="100%" height="100%">
                  <td className="px-2 py-4 whitespace-nowrap">
                    <PointChart data={device}/>
                  </td>
                </ResponsiveContainer>
                    
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