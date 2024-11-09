export interface User {
    id: number;
    name: string;
    company: string;
    lastSeen: string;
    clicks: number;
    onlineTime: number;
    clickHistory: number[];
    onlineHistory: number[];
    timeLabels: string[];
  }