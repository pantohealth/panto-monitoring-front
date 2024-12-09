import { useEffect, useState } from 'react';
import { FileCode2, Plus, RefreshCcw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { CreateModal } from './CreateModal';
import { ReportsTable } from './ReportsTable';
import { useDeveloperReports } from '../../../hooks/useDeveloperReports';
import { DateTimeFilters } from '../../../components/filters/DateTimeFilters';
import { exportToPDF, exportToExcel } from '../../../utils/export';
import { Task } from '../../../types/developerReports';
import moment from 'moment';

export function DeveloperReportsPage() {
  const {
    reportData,
    conditions,
    deleteReport,
    createReport,
    devices,
    queryClient,
    downloadReport,
    isDownloading,
    isPending,
  } = useDeveloperReports();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeSearch,setTimeSearch] = useState<Task[]>([])

  useEffect(() => {
    if (reportData) {
      setTimeSearch(reportData);
    }
  }, [reportData]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['developer-Report'] });
    toast.success('Data refreshed successfully');
  };

  const handleCreate = (newTask:Task) => {
    createReport(newTask, {
      onSuccess: () => {
        toast.success('Task created successfully');
        setIsModalOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data.message)
    }
    });
  };

  const handleExportPDF = () => {
    const formattedReports = timeSearch?.map(reports => ({
        ...reports,  
        device: reports.deviceId?.name || "~",  
        applicator: reports.applicator.username
      }));

    if(formattedReports){
    exportToPDF('Developer Report', formattedReports, [
      'name', 'applicator', 'device', 'condition', 'createdAt',
    ]);
    }
  };

  const handleExportExcel = () => {
    const formattedReports = timeSearch?.map(reports => ({
        ...reports,  
        device: reports.deviceId?.name || "~",  
        applicator: reports.applicator.username
      }));

    if(formattedReports){
    exportToExcel('Developer Report', formattedReports, [
      'name', 'applicator', 'device', 'condition', 'createdAt',
    ]);
    };
  };

  const searchTimeHandler = (filters: {
    fromDateTime: string;
    toDateTime: string;
    exactDateTime: string;
    isExactSearch: boolean;
  }) => {
    const { fromDateTime, toDateTime, exactDateTime, isExactSearch } = filters;

    if (!fromDateTime && !toDateTime && !exactDateTime && !isExactSearch) {
      setTimeSearch(reportData)
      return;
    }
  
    const filteredData = reportData?.filter((item) => {
      const localTime = moment(exactDateTime).format('YYYY-MM-DDTHH:mm');
      const localDate = moment(item.createdAt).format('YYYY-MM-DDTHH:mm');
      const startDate = moment(item.start).local().format('YYYY-MM-DDTHH:mm');
      const endDate = moment(item.end).local().format('YYYY-MM-DDTHH:mm');
      if (isExactSearch && exactDateTime) {
        return localDate === localTime; 
      } else if (!isExactSearch && fromDateTime && toDateTime) {
        return startDate >= fromDateTime && endDate <= toDateTime;
      }
      return true; 
    });

    setTimeSearch(filteredData);
  };

  return (
    <div className="space-y-6">
      <DateTimeFilters 
        onExport={handleExportPDF}
        onExportExcel={handleExportExcel}
        onSearch={searchTimeHandler}
      />

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-6 w-6 text-indigo-500" />
          <h1 className="md:text-2xl whitespace-nowrap font-semibold text-gray-900">
            Developer Reports
          </h1>
          <span className="bg-gray-300 text-gray-800 px-4 py-1 rounded-full whitespace-nowrap md:text-sm text-xs ">
            {reportData?.length} REPORTS
          </span>
        </div>
        <div className="md:flex-row flex-col gap-2 mt-2 md:mt-0">
          <Button variant="ghost" onClick={handleRefresh}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      <ReportsTable
        reports={timeSearch || reportData || []}
        onDelete={deleteReport}
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