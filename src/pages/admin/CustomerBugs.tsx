import { useState } from 'react';
import { DateTimeFilters } from '../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../utils/export';
import { Bug, Check, Pencil, Trash2, Calendar, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ActionLog {
  id: number;
  applicator: string;
  timestamp: string;
  route: string;
  isConfirmed: boolean;
}

const MOCK_LOGS: ActionLog[] = [
  {
    id: 1,
    applicator: 'Samira',
    timestamp: '2024-11-12T11:31:26',
    route: '/archive/catenary-points/points',
    isConfirmed: false
  },
  {
    id: 2,
    applicator: 'Samira',
    timestamp: '2024-11-12T11:23:58',
    route: '/archive/catenary-points/points',
    isConfirmed: false
  },
  {
    id: 3,
    applicator: 'Ali',
    timestamp: '2024-11-06T10:39:38',
    route: 'Simulation',
    isConfirmed: false
  },
  {
    id: 4,
    applicator: 'Ali',
    timestamp: '2024-11-06T10:39:09',
    route: 'Simulation',
    isConfirmed: false
  },
  {
    id: 5,
    applicator: 'Najieh',
    timestamp: '2024-11-05T16:41:02',
    route: 'Pointdetail',
    isConfirmed: false
  },
  {
    id: 6,
    applicator: 'Javad',
    timestamp: '2024-11-05T15:22:41',
    route: 'Pointdetail',
    isConfirmed: false
  }
];

const formatDisplayDate = (isoString: string) => {
  const date = parseISO(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', ' -');
};

export function CustomerBugsPage() {
  const [logs, setLogs] = useState<ActionLog[]>(MOCK_LOGS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    applicator: '',
    route: ''
  });
  const [editingLog, setEditingLog] = useState<ActionLog | null>(null);

  const handleExportPDF = () => {
    exportToPDF('Action Logs Report', logs, [
      'applicator',
      'timestamp',
      'route',
      'isConfirmed'
    ]);
  };

  const handleExportExcel = () => {
    exportToExcel('Action Logs Report', logs, [
      'applicator',
      'timestamp',
      'route',
      'isConfirmed'
    ]);
  };

  const handleConfirm = (id: number) => {
    setLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === id ? { ...log, isConfirmed: true } : log
      )
    );
    toast.success('Action confirmed');
  };

  const handleDelete = (id: number) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    toast.success('Action deleted');
  };

  const handleEdit = (id: number) => {
    const logToEdit = logs.find(log => log.id === id);
    if (logToEdit) {
      setEditingLog(logToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (!editingLog) return;

    if (!editingLog.applicator || !editingLog.route) {
      toast.error('Please fill in all fields');
      return;
    }

    setLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === editingLog.id ? { ...editingLog } : log
      )
    );
    setIsEditModalOpen(false);
    setEditingLog(null);
    toast.success('Action updated successfully');
  };

  const handleSchedule = (id: number) => {
    toast.success('Schedule functionality will be implemented');
  };

  const handleAdd = () => {
    if (!newLog.applicator || !newLog.route) {
      toast.error('Please fill in all fields');
      return;
    }

    const newEntry: ActionLog = {
      id: logs.length + 1,
      applicator: newLog.applicator,
      timestamp: new Date().toISOString(),
      route: newLog.route,
      isConfirmed: false
    };

    setLogs(prevLogs => [...prevLogs, newEntry]);
    setIsAddModalOpen(false);
    setNewLog({ applicator: '', route: '' });
    toast.success('New action added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bug className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Action Logs</h1>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={() => {}}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.applicator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDisplayDate(log.timestamp)}</div>
                    <div className="text-xs text-gray-400">
                      ({formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true })})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfirm(log.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(log.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(log.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSchedule(log.id)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewLog({ applicator: '', route: '' });
        }}
        title="Add New Action"
      >
        <div className="space-y-4">
          <Input
            label="Applicator"
            value={newLog.applicator}
            onChange={(e) => setNewLog(prev => ({ ...prev, applicator: e.target.value }))}
          />
          <Input
            label="Route"
            value={newLog.route}
            onChange={(e) => setNewLog(prev => ({ ...prev, route: e.target.value }))}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                setNewLog({ applicator: '', route: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              Add Action
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLog(null);
        }}
        title="Edit Action"
      >
        <div className="space-y-4">
          <Input
            label="Applicator"
            value={editingLog?.applicator || ''}
            onChange={(e) => setEditingLog(prev => 
              prev ? { ...prev, applicator: e.target.value } : null
            )}
          />
          <Input
            label="Route"
            value={editingLog?.route || ''}
            onChange={(e) => setEditingLog(prev => 
              prev ? { ...prev, route: e.target.value } : null
            )}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingLog(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}