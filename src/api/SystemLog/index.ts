import { api } from '../../lib/axios';

interface SystemLogParams {
  page: number; 
  rowsPerPage: number; 
  type?: string; 
  fromDateTime?: string; 
  toDateTime?: string; 
  exactDateTime?: string; 
}

const PREFIX = "log";

export const SystemLogApi = {
  log: async (params:SystemLogParams) => {
    const query = new URLSearchParams({
      page: params.page.toString(),
      limit: params.rowsPerPage.toString(),
      ...(params.type && { type: params.type}),
      ...(params.fromDateTime && { start: params.fromDateTime }),
      ...(params.toDateTime && { end: params.toDateTime }),
      ...(params.exactDateTime && { date: params.exactDateTime }),
    }).toString();
    
    const response = await api.get(`${PREFIX}?${query}`);
    return response.data;
  },
};