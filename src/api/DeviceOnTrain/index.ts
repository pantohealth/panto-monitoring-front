import { api } from '../../lib/axios';



interface deviceOnTrains {
  fromDateTime?: string; 
  toDateTime?: string; 
  exactDateTime?: string; 
}

const PREFIX = "devices/device-on-trains";

export const DeviceOnTrain = {
    deviceOnTrain: async (params:deviceOnTrains) => {
      const query = new URLSearchParams({
        ...(params.fromDateTime && { start: params.fromDateTime }),
        ...(params.toDateTime && { end: params.toDateTime }),
        ...(params.exactDateTime && { date: params.exactDateTime }),
      }).toString();
    const response = await api.get(`${PREFIX}?${query}`);
    return response.data;
  }

};