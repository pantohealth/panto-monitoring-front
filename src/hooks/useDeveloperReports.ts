import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeveloperReports } from '../api/DeveloperReport';
import { Task } from '../types/developerReports';
import { downloadExcelFile } from '../utils/download';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AllDevices } from '../api/allDevices';

export function useDeveloperReports() {
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState<Record<number, boolean>>({});

  const {
    data: reportData,
    isPending,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ['developer-Report'],
    queryFn: DeveloperReports.getReports,
  });

  const { data: conditions } = useQuery({
    queryKey: ['developer-conditions'],
    queryFn: DeveloperReports.getConditions,
  });

  const { mutate: deleteReport } = useMutation({
    mutationFn: DeveloperReports.deleteReports,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-Report'] });
    },
  });

  const { mutate: createReport, isPending: isPosting, error:notPosting } = useMutation({
    mutationFn: DeveloperReports.postReports,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer-Report'] });
    },
  });

  const downloadReport = async (id: number) => {
    setIsDownloading(prev => ({ ...prev, [id]: true }));
    try {
      const response = await DeveloperReports.downloadReport(id);
      if (response && response.base64File) {
        downloadExcelFile(response.base64File, `report-${id}.xlsx`);
        toast.success('Report downloaded successfully');
      } else {
        toast.error('Failed to download report');
      }
    } catch (error) {
      toast.error('Error downloading report');
    } finally {
      setIsDownloading(prev => ({ ...prev, [id]: false }));
    }
  };

const {data:devices} = useQuery({
    queryKey: ['devices'],
    queryFn: AllDevices.devices
})

  return {
    reportData,
    isPending,
    error,
    conditions,
    deleteReport,
    createReport,
    isPosting,
    devices,
    downloadReport,
    isDownloading,
    queryClient,
    notPosting
  };
}