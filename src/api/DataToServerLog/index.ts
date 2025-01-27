import { api } from '../../lib/axios';

interface SystemLogParams {
  page: number; 
  rowsPerPage: number; 
  fromDateTime?: string; 
  toDateTime?: string; 
  exactDateTime?: string; 
  deviceIds?: string;
}


const PREFIX = "devices/data-log";

export const DataToServerLog = {
    serverLog: async (params:SystemLogParams) => {
      const query = new URLSearchParams({
        page: params.page.toString(),
        limit: params.rowsPerPage.toString(),
        ...(params.deviceIds && { 'deviceIds[]': params.deviceIds }),
        ...(params.fromDateTime && { start: params.fromDateTime }),
        ...(params.toDateTime && { end: params.toDateTime }),
        ...(params.exactDateTime && { date: params.exactDateTime }),
      }).toString();
    const response = await api.get(`${PREFIX}?${query}`);
    return response.data;
  }

};