import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts';

import { useState } from 'react';
import { Dropdown } from '../Dropdown';

interface ChartProps {
    dataTypes: Record<string, string>;
    xAxisType:string;
    handleDateChange: (deviceId: number, date: string) => void;
    handleDataTypeChange: (deviceId: number, dataType: string) => void;
    selectedDate: Record<string, string>;
    chartData: any;
    device: any;
}

const PointChart = ({dataTypes,
    xAxisType,
    handleDataTypeChange,
    selectedDate,
    handleDateChange,
    chartData,
    device
}:ChartProps) => {

    const [isDataTypeDropdownOpen, setIsDataTypeDropdownOpen] = useState(false);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  
    const dataTypeOptions = ['eventCount', 'pointCount', ...(xAxisType === 'pop' ? ['points'] : [])];
    const dateOptions = chartData?.map((item:{date:number}) => item.date) || [];

    return (
        <>
            <div className='flex py-1 pl-7 gap-4'>
                
            {/* Data Type Dropdown */}
            <Dropdown
              value={dataTypes[device._id] || 'eventCount'}
              onChange={(value) => handleDataTypeChange(device._id, value)}
              options={dataTypeOptions}
              placeholder="Data Type"
              isOpen={isDataTypeDropdownOpen}
              onToggle={() => setIsDataTypeDropdownOpen(!isDataTypeDropdownOpen)}
              disabled={xAxisType === 'pop'} // Disable when xAxisType is 'pop'
              showAllOption={false}
            />

            {/* Date Dropdown */}
            {xAxisType === 'date' && (
              <Dropdown
                value={selectedDate[device._id] || ''}
                onChange={(value) => handleDateChange(device._id, value)}
                options={dateOptions}
                placeholder="Select Date"
                isOpen={isDateDropdownOpen}
                onToggle={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              />
            )}
        </div>
            {/* Chart */}
            {chartData?.length > 0 ? (
             <LineChart width={600} height={240} data={chartData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey={xAxisType === 'date' ? 'date' : 'pop'} />
               <YAxis />
               <Tooltip />
               <Legend />
               <Line
                 type="monotone"
                 dataKey={xAxisType === 'date' ? 'count' : 'points'} 
                 stroke="#8884d8"
                 activeDot={{ r: 8 }}
                 
            />
            </LineChart>
            ) : (
            <p>No data available for this device on this date.</p>
            )}    
        </>
    );
};

export default PointChart;