import { api } from '../../lib/axios';

// interface Login {
// email:string,
// password:string
// }

const PREFIX = "log";

export const SystemLogApi = {
   log: async (params: {page:number,rowsPerPage:number,type:string | ""}) => {
    const response = await api.get
    (`${PREFIX}?page=${params.page}&limit=${params.rowsPerPage}&type=${params?.type ? params?.type : ""}`);
    return response.data;
  },


};