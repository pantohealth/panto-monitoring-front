import { api } from '../../lib/axios';


const PREFIX = "widgets?name=deviceOnTrains";

export const DeviceOnTrain = {
    deviceOnTrain: async () => {
    const response = await api.get(PREFIX);
    return response.data;
  }

};