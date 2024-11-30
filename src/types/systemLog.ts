export interface SystemLogEntry {
    _id?: number;
     time: string;
     message: string;
     type: string;
     context: string;
     trace: string;
   }
   
export interface SystemLogApiResponse {
    result: SystemLogEntry[];
}