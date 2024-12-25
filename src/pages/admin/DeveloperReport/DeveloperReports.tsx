import { useState } from 'react';
import { FileCode2, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { CreateModal } from './CreateModal';
import { ReportsTable } from './ReportsTable';
import { useDeveloperReports } from '../../../hooks/useDeveloperReports';
import { DateTimeFilters } from '../../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../../utils/export';
import { Task } from '../../../types/developerReports';

export function DeveloperReportsPage() {
  const {
    conditions,
    createReport,
    devices,
    downloadReport,
    isDownloading,
    isPending,
  } = useDeveloperReports();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports,setReports] = useState<Task>({
    name: "",  
    applicator: { username: "" },  
    condition: "",  
  })

 
  //   queryClient.invalidateQueries({ queryKey: ['developer-Report'] });
  //   toast.success('Data refreshed successfully');
  // };

  const handleCreate = (newTask:Task) => {
    toast.loading('Creating report...',{  duration: 2000 });
    createReport(newTask, {
      onSuccess: (response) => {
        toast.success('Task created successfully');
        setReports(response)
        setIsModalOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data.message)
    }
    });
  };

  const handleExportPDF = () => {
    if (!reports) return;

    const formattedReports = {
        name: reports.name,
        applicator: reports.applicator.username,
        condition: reports.condition,
        deviceId: reports.deviceId
      };

    if(formattedReports){
    exportToPDF('Developer Report', [formattedReports], [
      'name', 'applicator', 'condition', 'deviceId'
    ]);
    }
  };

  const handleExportExcel = () => {
    if (!reports) return;

    const formattedReports = {
        name: reports.name,
        applicator: reports.applicator.username,
        condition: reports.condition,
        deviceId: reports.deviceId
      };

    if(formattedReports){
    exportToExcel('Developer Report', [formattedReports], [
      'name', 'applicator', 'condition', 'deviceId'
    ]);
    };
  };

  return (
    <div className="space-y-6">
      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-6 w-6 text-indigo-500" />
          <h1 className="md:text-2xl whitespace-nowrap font-semibold text-gray-900">
            Developer Reports
          </h1>
        </div>
        <div className="md:flex-row flex-col gap-2 mt-2 md:mt-0">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      <ReportsTable
        reports={reports || []}
        onDownload={downloadReport}
        isDownloading={isDownloading}
        isPending={isPending}
      />

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        devices={devices || []}
        conditions={conditions || []}
      />
    </div>
  );
}