import { useState } from 'react';
import { RefreshCcw, Plus, FileCode2, Trash2, FileDown  } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToExcel, exportToPDF } from '../../utils/export';
import { api } from '../../lib/axios';

interface Task {
  id: number;
  name:string;
  applicator: string;
  type: string;
  device: string;
  condition: string;
  start: string;
  end: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    name:'najie',
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    condition:"somithing",
    start: '2024/11/01 12:00',
    end: '2024/11/07 20:15',
  },
  {
    id: 2,
    name:'najie',
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    condition:"somithing",
    start: '2024/11/01 12:00',
    end: '2024/11/07 17:04',
  },
  {
    id: 3,
    name:'najie',
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    condition:"somithing",
    start: '2024/11/01 12:00',
    end: '2024/11/07 16:57',
  },
  {
    id: 4,
    name:'najie',
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    condition:"somithing",
    start: '2024/10/06 12:00',
    end: '2024/10/07 12:00',
  },
  {
    id: 5,
    name:'najie',
    applicator: 'Shayan',
    type: 'Remove',
    device: 'Leipzig 3',
    condition:"somithing",
    start: '2024/10/06 12:00',
    end: '2024/10/29 19:57',
  },
  {
    id: 6,
    name:'najie',
    applicator: 'Shayan',
    type: 'Remove',
    device: 'Leipzig 3',
    condition:"somithing",
    start: '2024/10/06 19:55',
    end: '2024/10/29 19:56',
  }
];

const DEVICES = ['Leipzig 3', 'Leipzig 2', 'Leipzig 1'];
const TYPES = ['Add', 'Remove'];
const CONDITIONS = ['con1', 'con2','con3'];

export function DeveloperReportsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isConditionDropdownOpen, setIsConditionDropdownOpen] = useState(false);
  const [data, setData] = useState<Task[]>(MOCK_TASKS);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleRefresh = () => {
    toast.success('Data refreshed successfully');
  };

  const handleCreate = () => {
    if (!selectedDevice || !selectedType || !startTime || !endTime || !selectedCondition) {
      toast.error('Please fill in all fields');
      return;
    }

    const newEntry: Task = {
      id: data.length + 1,
      applicator: data.applicator,
      name: data.name,
      type: selectedType,
      device: selectedDevice,
      condition: selectedCondition,
      start: startTime,
      end: endTime,
      };

  
    // Add new task logic here
    setData(prevData => [...prevData, newEntry]);
    toast.success('Task created successfully');
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDevice('');
    setSelectedType('');
    setStartTime('');
    setEndTime('');
  };

  const handleExportPDF = () => {
    exportToPDF('Developer Report', MOCK_TASKS, [
      'id',
      'name',
      'applicator',
      'type',
      'device',
      'condition',
      'start',
      'end',
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Developer Report', MOCK_TASKS, [
      'id',
      'name',
      'applicator',
      'type',
      'device',
      'condition',
      'start',
      'end',
    ]);
  };

  const deleteHandler = (id: number) => {
   const deleteTask = data.filter(task => task.id !== id)
   setData(deleteTask)
  }

  // const downloadExcelFile = (base64File:string, fileName:string) => {
  //   const link = document.createElement("a");
  //   link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64File}`;
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // const downloadHandler = (id: number) => {
  //   setIsDownloading(true)
    
  //   console.log(id)
  //   api.getDeveloperReportById(id, res => {
  //     if (res.status === 200) {
  //       const base64File = res.data.base64File;
  //       const fileName = "download.xlsx";

  //       downloadExcelFile(base64File, fileName);

  //       setIsDownloading(false);
  // }

  return (
    <div className="space-y-6">

      <DateTimeFilters onExport={handleExportPDF} 
      onExportExcel={handleExportExcel} onSearch={() => {}} />

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-2">
        <FileCode2 className="h-6 w-6 text-indigo-500" />
        <h1 className="md:text-2xl whitespace-nowrap font-semibold text-gray-900">Developer Reports</h1>
          <span className="bg-gray-100 whitespace-nowrap px-2 py-1 rounded md:text-sm text-xs text-gray-600">
            {MOCK_TASKS.length} REQUESTS
          </span>
        </div>
        <div className="md:flex-row flex-col gap-2 mt-2 md:mt-0">
          <Button
            variant="ghost"
            onClick={handleRefresh}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            
          >
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
      <p className="text-gray-500 tracking-tighter md:tracking-normal">You can create automatic tasks in different types.</p>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.applicator}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.device}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.condition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.start}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.end}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                    variant='ghost'
                    onClick={() => deleteHandler(task.id)}
                    >
                      <Trash2/>
                    </Button>
                  </td>
                  {/* <td className="px-6 py-4 flex flex-col whitespace-nowrap text-sm text-gray-500">
                    <Button
                    variant='ghost'
                    onClick={() => downloadHandler(task.id)}
                    >
                      <FileDown />
                    {isDownloading && 
                    <span className='text-xs text-center'>Downloading...</span>
                    }
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Create New Task"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
            <Dropdown
              value={selectedDevice}
              onChange={(value) => {
                setSelectedDevice(value);
                setIsDeviceDropdownOpen(false);
              }}
              options={DEVICES}
              placeholder="Select Device"
              isOpen={isDeviceDropdownOpen}
              onToggle={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <Dropdown
              value={selectedType}
              onChange={(value) => {
                setSelectedType(value);
                setIsTypeDropdownOpen(false);
              }}
              options={TYPES}
              placeholder="Select Type"
              isOpen={isTypeDropdownOpen}
              onToggle={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <Dropdown
              value={selectedCondition}
              onChange={(value) => {
                setSelectedCondition(value);
                setIsConditionDropdownOpen(false);
              }}
              options={CONDITIONS}
              placeholder="Select Condition"
              isOpen={isConditionDropdownOpen}
              onToggle={() => setIsConditionDropdownOpen(!isConditionDropdownOpen)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}