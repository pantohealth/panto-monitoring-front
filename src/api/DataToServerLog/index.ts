import { api } from '../../lib/axios';


const PREFIX = "widgets?name=dataLog";

export const DataToServerLog = {
    serverLog: async () => {
    const response = await api.get(PREFIX);
    return response.data;
  }

};