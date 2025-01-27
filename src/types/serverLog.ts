export interface ServerLogEntry {
    _id: number;
    time: string;
    createdAt: string;
    device: {_id:string,name:string};
    acc: string;
    systemMetric: number;
    battery: string;
    temp: string;
    gps: string;
    laser: string;
    laserV: string;
    tower: string;
    error: string;
    abnormal: string;
    roofAcceleration: string;
    events: string;
  }

export interface BaseParams {
  page: number;
  rowsPerPage: number;
  fromDateTime?: string;
  toDateTime?: string;
  exactDateTime?: string;
  deviceIds?: string[];
}