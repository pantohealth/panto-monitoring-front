import { api } from '../../lib/axios';

// interface Login {
// email:string,
// password:string
// }

const PREFIX = "log";

export const SystemLogApi = {
   log: async () => {
    const response = await api.get(PREFIX );
    return response.data;
  }

};