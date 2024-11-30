import { api } from '../../lib/axios';


const PREFIX = "warnings";

export const Warnings = {
   getWarnings: async () => {
    const response = await api.get(PREFIX );
    return response.data;
  }

};