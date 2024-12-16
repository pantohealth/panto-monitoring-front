import { api } from '../../lib/axios';


const PREFIX = "devices";

export const Devices = {
    devices: async () => {
    const response = await api.get(PREFIX);
    return response.data;
  }

};