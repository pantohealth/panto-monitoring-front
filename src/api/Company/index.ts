import { api } from '../../lib/axios';


const PREFIX = "companies";

export const Company = {
    companies: async () => {
    const response = await api.get(PREFIX);
    return response.data;
  }
};