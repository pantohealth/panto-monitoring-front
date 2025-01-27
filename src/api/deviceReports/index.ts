import { api } from '../../lib/axios';


interface EventCountParams {
    deviceIds?: string[];
    fromDateTime?: string; 
    toDateTime?: string;  
    exactDateTime?:string;
    isExactSearch?:boolean;
  }


const PREFIX = "devices";

export const DeviceReports = {
    eventCounts: async ({deviceIds, fromDateTime, toDateTime, exactDateTime, isExactSearch}:EventCountParams) => {
        const params: Record<string, string> = {};

        // Add parameters conditionally
        if (deviceIds && deviceIds.length > 0) {
          params.deviceIds = deviceIds.join(","); 
        }
        if (fromDateTime) {
          params.start = fromDateTime;
        }
        if (toDateTime) {
          params.end = toDateTime;
        }
        if (exactDateTime) {
          params.date = exactDateTime;
        }

    const query = new URLSearchParams(params).toString();

    const response = await api.get(`${PREFIX}/event-count?${query}`);
    return response.data;
  },


  eventPoints: async ({deviceIds, fromDateTime, toDateTime, exactDateTime, isExactSearch}:EventCountParams) => {
    const params: Record<string, string> = {};

    // Add parameters conditionally
    if (deviceIds && deviceIds.length > 0) {
      params.deviceIds = deviceIds.join(","); 
    }
    if (fromDateTime) {
      params.start = fromDateTime;
    }
    if (toDateTime) {
      params.end = toDateTime;
    }
    if (exactDateTime) {
      params.date = exactDateTime;
    }

const query = new URLSearchParams(params).toString();

const response = await api.get(`${PREFIX}/point-count?${query}`);
return response.data;
},

pointsVsPop: async ({deviceIds, fromDateTime, toDateTime, exactDateTime, isExactSearch}:EventCountParams) => {
  const params: Record<string, string> = {};

  // Add parameters conditionally
  if (deviceIds && deviceIds.length > 0) {
    params.deviceIds = deviceIds.join(","); 
  }
  if (fromDateTime) {
    params.start = fromDateTime;
  }
  if (toDateTime) {
    params.end = toDateTime;
  }
  if (exactDateTime) {
    params.date = exactDateTime;
  }

  const query = new URLSearchParams(params).toString();
    const response = await api.get(`${PREFIX}/pops?${query}`);
    return response.data;
  }

};