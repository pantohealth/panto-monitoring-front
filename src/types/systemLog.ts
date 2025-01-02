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
    total: number;
    page: number;
    limit: number;
    start?:string;
    end?:string;
    date?:string
}

export interface BaseParams {
    page: number;
    rowsPerPage: number;
    type?: string;
    fromDateTime?: string;
    toDateTime?: string;
    exactDateTime?: string;
  }


     
