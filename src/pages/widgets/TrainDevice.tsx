import { useEffect, useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Dropdown } from '../../components/ui/Dropdown';
import { useQuery } from '@tanstack/react-query';
import { DeviceOnTrain } from '../../api/DeviceOnTrain';
import { AllDevices } from '../../api/allDevices';
import { TrainDevice } from '../../types/DeviceonTrain';
import { DEVICES } from '../../types/devices';
import moment from 'moment';


const COLUMNS = [
  'Device',
  'Carbon Strip',
  'Last Connection',
  'Speed',
  'Battery A',
  'Battery B',
  'Distance ',
  'Distance D',
  'A/p ',
  'A/p D',
  'Sensors'
];

export function TrainDevicePage() {
 
  const {data, isPending, error} = useQuery<TrainDevice[] , Error>({
    queryKey: ['trainDevices'],
    queryFn: DeviceOnTrain.deviceOnTrain
  })

  const {data:devices} = useQuery<DEVICES[]>({
    queryKey: ['devices'],
    queryFn: AllDevices.devices
})

  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [allData , setAllData] = useState<TrainDevice[]>([])


  useEffect(() => {
      const selectedDeviceObj = devices?.find(device => device.name === selectedDevice);
     
      if (selectedDeviceObj) {
        const filteredData = data?.data?.filter((device:TrainDevice[]) => (
          device?.name === selectedDeviceObj.name
        )
        ) || [];  
        setAllData(filteredData);
      } else {
        setAllData(data?.data);
      }
      
  },[selectedDevice,data,devices])

  const handleExportPDF = () => {
    const formatedData = allData.map(data => ({
      ...data,
      lastDates:data?.lastDates?.lastConnect || '~'
    }))
    exportToPDF('Train Devices Report', formatedData, [
      '_id',
      'name',
      'carbonStrip',
      'lastDates',
      'speed',
      'batteryA',
      'batteryB',
      'distanceD',
      'distance',
      'ip',
      'ipD',
      'defaultAccelerationSensor'
    ]);
  };

  const handleExportExcel = () => {
    const formatedData = allData.map(data => ({
      ...data,
      lastDates:data?.lastDates?.lastConnect || '~'
    }))
    exportToExcel('Train Devices Report', formatedData, [
      '_id',
      'name',
      'carbonStrip',
      'lastDates',
      'speed',
      'batteryA',
      'batteryB',
      'distanceD',
      'distance',
      'ip',
      'ipD',
      'defaultAccelerationSensor'
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
      setAllData(data?.data)
      return;
    }

  
    const filteredData = (data?.data || []).filter((item:TrainDevice) => {
      const localTime = moment(exactDateTime).format('YYYY-MM-DDTHH:mm');
      const localDate = moment(item.lastDates?.lastConnect).local().format('YYYY-MM-DDTHH:mm');

      if (isExactSearch && exactDateTime) {
        return localDate === localTime; 
      } else if (!isExactSearch && fromDateTime && toDateTime) {
        return localDate >= fromDateTime && localDate <= toDateTime;
      }
      return true; 
    });

    setAllData(filteredData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Device on Trains</h1>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={searchTimeHandler}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <Dropdown
            value={selectedDevice}
            onChange={setSelectedDevice}
            options={devices ? devices?.map(d => d.name || '') : []}
            placeholder="Select Device"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>

        <div className="overflow-x-auto">
        <div className="max-h-[calc(100vh-18rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className='flex flex-col'>
              {/* loading */}
              {isPending && <p className='loader mx-auto my-10 w-full h-full'></p>}
              {/* Error */}
              {!isPending && error && 
              <p className='items-center  mx-auto my-10 w-full h-full'>{error?.message}</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky z-10 top-0">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
             
              {allData?.map((device:TrainDevice) => (
                <tr key={device._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{device.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-sm bg-gray-100 rounded">
                      {device?.carbonStrip || '~'}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device?.lastDates?.lastConnect ? new Date(device.lastDates.lastConnect).toLocaleString() : '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device?.speed?.toFixed(0) || '~'} km/h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            device.batteryA >= 80 ? 'bg-red-500' :
                            device.batteryA >= 60 ? 'bg-yellow-500' : 
                            'bg-gray-200' 
                          }`}
                          style={{ width: `${device.batteryA}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{device?.batteryA || '~'}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            device.batteryB >= 80 ? 'bg-red-500' :
                            device.batteryB >= 60 ? 'bg-yellow-500' : 
                            device.batteryB >= 10 ? 'bg-green-500' :  'bg-gray-200' 
                          }`}
                          style={{ width: `${device.batteryB}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{device?.batteryB || '~'}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {device?.distanceD ? Math.floor(device?.distanceD) : '~'} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {device?.distance ? Math.floor(device?.distance) : '~'} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device?.ipD ? Math.floor(device.ipD) : '~'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {device?.ip ? Math.floor(device.ip) : '~'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                    {device.sensors
                    .filter(sensor => sensor.enabled) 
                    .map((sensor, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                        sensor?.status === 'OK'
                          ? 'bg-green-500 ' 
                          : sensor?.value === device?.defaultAccelerationSensor ?
                          'bg-[#FBB040]' : 'bg-[#7aa9f3]'
                      } ${sensor?.status === 'UNKNOWN' ? 'border-red-500' : 'border-transparent'}`}
                    >
                      {sensor.value}
                      </div>
                    ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}