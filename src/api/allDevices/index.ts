import { api } from '../../lib/axios';


const PREFIX = "devices/simple";

export const AllDevices = {
    devices: async () => {
    const response = await api.get(PREFIX);
    return response.data;
  }

};