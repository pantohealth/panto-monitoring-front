import { useState } from 'react';
import { RefreshCcw, Plus, Database } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

interface Task {
  id: number;
  applicator: string;
  type: string;
  device: string;
  start: string;
  end: string;
  status: 'Done' | 'Failed';
}

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    start: '2024/11/01 12:00',
    end: '2024/11/07 20:15',
    status: 'Failed'
  },
  {
    id: 2,
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    start: '2024/11/01 12:00',
    end: '2024/11/07 17:04',
    status: 'Done'
  },
  {
    id: 3,
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    start: '2024/11/01 12:00',
    end: '2024/11/07 16:57',
    status: 'Failed'
  },
  {
    id: 4,
    applicator: 'Shayan',
    type: 'Add',
    device: 'Leipzig 3',
    start: '2024/10/06 12:00',
    end: '2024/10/07 12:00',
    status: 'Done'
  },
  {
    id: 5,
    applicator: 'Shayan',
    type: 'Remove',
    device: 'Leipzig 3',
    start: '2024/10/06 12:00',
    end: '2024/10/29 19:57',
    status: 'Done'
  },
  {
    id: 6,
    applicator: 'Shayan',
    type: 'Remove',
    device: 'Leipzig 3',
    start: '2024/10/06 19:55',
    end: '2024/10/29 19:56',
    status: 'Done'
  }
];

const DEVICES = ['Leipzig 3', 'Leipzig 2', 'Leipzig 1'];
const TYPES = ['Add', 'Remove'];

export function DataManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [data, setData] = useState<Task[]>(MOCK_TASKS);

  const handleRefresh = () => {
    toast.success('Data refreshed successfully');
  };

  const handleCreate = () => {
    if (!selectedDevice || !selectedType || !startTime || !endTime) {
      toast.error('Please fill in all fields');
      return;
    }

    const newEntry: Task = {
    id: data.length + 1,
    applicator: data.applicator,
    type: selectedType,
    device: selectedDevice,
    start: startTime,
    end: endTime,
    status: 'Done' ,
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

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-indigo-500" />
          <h1 className="md:text-2xl font-semibold text-gray-900">Data Management</h1>
          <span className="bg-gray-100 px-2 py-1 rounded whitespace-nowrap md:text-sm text-xs text-gray-600">
            {MOCK_TASKS.length} REQUESTS
          </span>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.applicator}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.device}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.start}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.end}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === 'Done' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </td>
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