import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeveloperReports } from '../api/DeveloperReport';
import { downloadExcelFile } from '../utils/download';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AllDevices } from '../api/allDevices';
import { Task } from '../types/developerReports';

export function useDeveloperReports() {
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [reportData, setReportData] = useState<Task>();

  const { data: conditions } = useQuery({
    queryKey: ['developer-conditions'],
    queryFn: DeveloperReports.getConditions,
  });

  const { mutate: createReport, isPending, error } = useMutation({
    mutationFn: DeveloperReports.postReports,
    onSuccess: (response) => {
      setReportData(response)
    },
  });

  const downloadReport = () => {
    setIsDownloading(true);
    try {
      if (reportData && reportData.base64File) {
        downloadExcelFile(reportData.base64File, `report-${reportData.deviceId}.xlsx`);
        toast.loading('Downloading report...',{  duration: 2000 });
        toast.success('Report downloaded successfully');
      } else {
        toast.error('Failed to download report');
      }
    } catch (error) {
      toast.error('Error downloading report');
    } finally {
      setIsDownloading(false);
    }
  };

const {data:devices} = useQuery({
    queryKey: ['all-devices'],
    queryFn: AllDevices.devices
})

  return {
    conditions,
    createReport,
    isPending,
    devices,
    downloadReport,
    isDownloading,
    queryClient,
    error
  };
}