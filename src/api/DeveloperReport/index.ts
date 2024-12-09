import { api } from '../../lib/axios';
import { Task } from '../../types/developerReports';


const PREFIX = "reports";

export const DeveloperReports = {
    getReports: async () => {
    const response = await api.get(PREFIX);
    return response.data;
  },

  getConditions: async () => {
    const response = await api.get(`${PREFIX}/conditions` );
    return response.data;
  },

  deleteReports: async(id:number) => {
    const response = await api.delete(`${PREFIX}/${id}`);
    return response.data;
  },

  postReports: async (data:Task) => {
    const response = await api.post(PREFIX,data);
    return response.data;
  },

  downloadReport: async (id:number) => {
    const response = await api.get(`${PREFIX}/${id}`);
    return response.data;
  },

};