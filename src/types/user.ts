export interface User {
  _id: number,
  username: string,
  company: {id:number,name:string},
  clicks: number,
  email?: string,
  lastOnline: string,
  points:number[]
  }

export interface ExportUser {
    username: string;
    company: string; 
    lastOnline: string;
    clicks: number;
  }