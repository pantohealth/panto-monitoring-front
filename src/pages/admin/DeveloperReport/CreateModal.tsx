import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Dropdown } from '../../../components/ui/Dropdown';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { NewEntery, Task } from '../../../types/developerReports';
import { useDeveloperReports } from '../../../hooks/useDeveloperReports';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  devices: [{ _id: string, name?: string }];
  conditions: string[];
}

export function CreateModal({ isOpen, onClose, onSubmit, devices, conditions }: CreateTaskModalProps) {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
  const [isConditionDropdownOpen, setIsConditionDropdownOpen] = useState(false);

  const {isPending,error} = useDeveloperReports()


  const resetForm = () => {
    setSelectedDevice('');
    setSelectedName('');
    setSelectedCondition('');
    setStartTime('');
    setEndTime('');
  };

  const handleValidate = () => {
    if (!selectedDevice || !selectedName || !selectedCondition) {
      toast.error('Please fill in all fields');
      return;
    }

    if (selectedName.trim().length === 0) {
      toast.error('Please type a name');
      return;
    }

    if (startTime && !endTime) {
      toast.error('Please select end date');
      return;
    }

    handleCreate();
  };

  const handleCreate = () => {
    const selectedDeviceObj = devices.find(device => device.name === selectedDevice);

    const newTask: NewEntery = {
      name: selectedName,
      condition: selectedCondition,
      deviceId: selectedDeviceObj ? selectedDeviceObj?._id : "" ,
    };

    if (startTime) {
      newTask.start = moment(startTime).seconds(0).milliseconds(0).toISOString();
    }
    if (endTime) {
      newTask.end = moment(endTime).seconds(0).milliseconds(0).toISOString();
    }

    onSubmit(newTask);
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); resetForm(); }} title="Create New Report">
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="block mr-[60px] text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            value={selectedName}
            onChange={e => setSelectedName(e.target.value)}
            placeholder='Name'
          />
        </div>
        
        <div className="flex">
          <label className="block mr-14 text-sm font-medium text-gray-700 mb-1">Device</label>
          <Dropdown
            value={selectedDevice}
            onChange={(value) => {
              setSelectedDevice(value);
              setIsDeviceDropdownOpen(false);
            }}
            options={devices.map(d => d.name || '')}
            placeholder="Select Device"
            isOpen={isDeviceDropdownOpen}
            onToggle={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
          />
        </div>

        <div className="flex">
          <label className="block mr-[35px] text-sm font-medium text-gray-700 mb-1">Condition</label>
          <Dropdown
            value={selectedCondition}
            onChange={(value) => {
              setSelectedCondition(value);
              setIsConditionDropdownOpen(false);
            }}
            options={conditions}
            placeholder="Select Condition"
            isOpen={isConditionDropdownOpen}
            onToggle={() => setIsConditionDropdownOpen(!isConditionDropdownOpen)}
            
          />
        </div>

        <div className="flex">
          <div className="flex flex-col">
            <label className="block mr-[34px] text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <span className="text-xs text-gray-500">(optional)</span>
          </div>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="flex">
          <div className="flex flex-col">
            <label className="block mr-10 text-sm font-medium text-gray-700 mb-1">End Time</label>
            <span className="text-xs text-gray-500">(optional)</span>
          </div>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => { onClose(); resetForm(); }}>
            Cancel
          </Button>
          <Button type="button" isLoading={isPending} onClick={handleValidate}>
            Create Task
            {error && toast.error(error.message)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}