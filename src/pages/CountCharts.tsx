import { useMemo, useState } from 'react';
import { DateTimeFilters } from '../components/filters/DateTimeFilters';
import { exportToExcel } from '../utils/export';
import { Dropdown } from '../components/ui/Dropdown';
import { useQuery } from '@tanstack/react-query';
import { AllDevices } from '../api/allDevices';
import {  DEVICES } from '../types/devices';
import { PopData } from '../types/pointvspop';
import { DeviceReports } from '../api/deviceReports';
import PointChart from '../components/ui/pointChart/PointChart';

const COLUMNS = ['Device', 'Reports'];
const XAxisOptions = ['date', 'pop'];

export function CountCharts() {

    const [deviceIds, setDeviceIds] = useState<string[]>([]);
    const [dataTypes, setDataTypes] = useState<Record<number, string>>("eventCount");
    const [selectedDevice, setSelectedDevice] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownXAxisOpen, setIsDropdownXAxisOpen] = useState(false);
    // State for selected date (for X-axis filtering)
    const [selectedDate, setSelectedDate] = useState<Record<string, string>>({});
    const [fromDateTime, setFromDateTime] = useState<string>('');
    const [toDateTime, setToDateTime] = useState<string>('');
    const [exactDateTime, setExactDateTime] = useState<string>('');
    const [isExactSearch, setIsExactSearch] = useState<boolean>(false);
    const [xAxisType, setXAxisType] = useState<string>('date'); // 'date' or 'pop'

  const {data: devices} = useQuery<DEVICES[]>({
    queryKey: ['all-devices'],
    queryFn: AllDevices.devices
  })

  const {
    data:eventcount,
    isPending: eventcountLoading, 
    error:eventcountError
} = useQuery({
    queryKey: [
        "event-count", 
        deviceIds, 
        fromDateTime, 
        toDateTime, 
        exactDateTime, 
        isExactSearch
    ],
    queryFn: () => DeviceReports.eventCounts({ deviceIds, fromDateTime, toDateTime, exactDateTime, isExactSearch }),

  });

  
  const {data:pointcount} = useQuery({
    queryKey: [
        "point-count", 
        deviceIds, 
        fromDateTime, 
        toDateTime, 
        exactDateTime, 
        isExactSearch
    ],
    queryFn: () => DeviceReports.eventPoints({ deviceIds, fromDateTime, toDateTime, exactDateTime, isExactSearch }),
  });

  const {data:poppoint, } = useQuery<PopData[]>({
    queryKey: [
      'pop',
      deviceIds, 
      fromDateTime, 
      toDateTime, 
      exactDateTime, 
      isExactSearch
    ],
    queryFn:() => DeviceReports.pointsVsPop({deviceIds,  fromDateTime,  toDateTime,  exactDateTime, 
      isExactSearch}),
  })

  const filteredDevice = selectedDevice
  ? eventcount?.filter((device: any) => device.name === selectedDevice)
  : eventcount;

  // Handler to update dataType for a specific device
  const handleDataTypeChange = (deviceId:number, newDataType:string) => {
    setDataTypes({
      [deviceId]: newDataType,
    });
  };


  const handleExportExcel = () => {
    let selectedData;

    if (xAxisType === 'date' && Object.values(dataTypes)[0] === 'eventCount' || xAxisType === 'date' && dataTypes === 'eventCount') {
      selectedData = eventcount || [];
    } else if (xAxisType === 'date' && Object.values(dataTypes)[0] === 'pointCount') {
      selectedData = pointcount || [];
    }else if(xAxisType === 'pop'){
      selectedData = poppoint || [];
    }

    if (selectedDevice) {
      selectedData = selectedData.filter((device: any) => device.name === selectedDevice);
    }

    let tableHeaders:string[] = [];
    let tableRows = [];
  
    if (xAxisType === 'date') {
      // Handle date case
      const uniqueDates: string[] = [
        ...new Set(
          selectedData.flatMap((device:any) => device?.countsByDate?.map((count:any) => count.date) || [])
        ),
      ];
  
      // Generate table headers
      tableHeaders = ['Device Name', ...uniqueDates];
  
      // Generate table rows
      tableRows = selectedData.map((device:any) => {
        const row: Record<string, string | number> = { 'Device Name': device.name };
        uniqueDates.forEach(date => {
          const countData = device?.countsByDate?.find((count:any) => count.date === date);
          row[date] = countData ? countData.count : '-'; // Use '-' for missing data
        });
        return row;
      });
    } else if (xAxisType === 'pop') {
      // Handle pop case
      const maxPopLength = Math.max(...selectedData.map((device:any) => device.points?.length || 0)); // Find the maximum length of the points array
      tableHeaders = ['Device Name', ...Array.from({ length: maxPopLength }, (_, i) => `Pop ${i}`)]; // Generate headers like "Pop 0", "Pop 1", etc.
  
      // Generate table rows
      tableRows = selectedData.map((device:any) => {
        const row:Record<string, string | number> = { 'Device Name': device.name };
        device.points?.forEach((point:number, index:number) => {
          row[`Pop ${index}`] = point; // Assign each point to its corresponding pop index
        });
        return row;
      });
    }
  
    // Export to Excel
    exportToExcel(
      'Device Reports',
      tableRows,
      tableHeaders
    );
  };

// Handler for device selection
const handleDeviceSelect = (deviceName: string) => {
     setSelectedDevice(deviceName);
   };

const handleXAxisType = (value: string) => {
    setXAxisType(value);
  };

  const searchTimeHandler = (filters: {
    fromDateTime: string;
    toDateTime: string;
    exactDateTime: string;
    isExactSearch: boolean;
  }) => {
    setFromDateTime(filters.fromDateTime);
    setToDateTime(filters.toDateTime);
    setExactDateTime(filters.exactDateTime);
    setIsExactSearch(filters.isExactSearch);
  };

    // Handler to update the selected date for the X-axis
    const handleDateChange = (deviceId: number, date: string) => {
      setSelectedDate((prev) => ({
        ...prev,
        [deviceId]: date,
      }));
    };
    
      // Memoized function to get chart data for a specific device
      const getChartData = useMemo(
        () => (device: any) => {
          const dataType = dataTypes[device._id] || "eventCount"; // Default to eventCount
          let data = [];
          if (xAxisType === 'date') {
            if (dataType === "eventCount") {
              data = device.countsByDate || [];
            } else if (dataType === "pointCount" && pointcount) {
              data = pointcount.find((pc: any) => pc._id === device._id)?.countsByDate || [];
            }
    
        // Filter data for the selected date
        const selectedDates = selectedDate[device._id];
        if (selectedDates) {
          data = data.filter((item: any) => {
            return item.date === selectedDates;
          });
        }
        } else if (xAxisType === 'pop') {
        // Use the points vs pop data for the selected device
        const devicePopData = poppoint?.find((d: any) => d._id === device._id);
        if (devicePopData) {
          data = devicePopData.points.map((point: number, index: number) => ({
            pop: index,
            points: point,
          }));
        }
      }
    
          return data;
        },
        [dataTypes, pointcount, selectedDate,xAxisType,poppoint] 
      );

  return (
    <div >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Devices Report</h1>
      </div>

      <DateTimeFilters
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

          <Dropdown
            value={xAxisType}
            onChange={handleXAxisType}
            options={XAxisOptions}
            placeholder="Select Xaxis Type"
            isOpen={isDropdownXAxisOpen}
            onToggle={() => setIsDropdownXAxisOpen(!isDropdownXAxisOpen)}
            showAllOption={false}
          />
        </div>
        
        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-17rem)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
           {/* loading */}
           {eventcountLoading && <p className='loader mx-auto my-10 w-full h-full'></p>}
          {/* Error */}
          {eventcountError && !eventcountLoading && <p className='items-center mx-auto my-10 w-full h-full'>{eventcountError?.message}</p>}
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

        {filteredDevice?.map((device:any, deviceIndex:number) => {
        const chartData = getChartData(device);

        return (
          <tr key={deviceIndex}>
            <td className='px-6'>{device.name}</td>
            <td>
              <PointChart 
              dataTypes={dataTypes}
              xAxisType={xAxisType}
              handleDataTypeChange={handleDataTypeChange}
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              chartData={chartData}
              device={device}
              />
            </td>
            </tr>
              );
            })}
    
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}