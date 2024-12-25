import { api } from '../../lib/axios';
import { Task } from '../../types/developerReports';


const PREFIX = "reports";

export const DeveloperReports = {
  getConditions: async () => {
    const response = await api.get(`${PREFIX}/conditions` );
    return response.data;
  },

  postReports: async (data:Task) => {
    const response = await api.post(PREFIX,data);
    return response.data;
  },

};