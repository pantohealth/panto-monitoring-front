import { api } from '../../lib/axios';


const PREFIX = "devices/pops";

export const DevicesPop = {
    pointsVsPop: async () => {
    const response = await api.get(PREFIX);
    return response.data;
  }

};