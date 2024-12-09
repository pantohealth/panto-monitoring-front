export interface TrainDevice { 
    _id: string;
    name: string;
    // carbonStrip: number;
    lastDates: {lastSeen:string, lastConnect?:string} | null;
    speed: number;
    batteryA: number;
    batteryB: number;
    distanceD: number;
    distance: number;
    ipD: number;
    ip: number;
    defaultAccelerationSensor:number;
    carbonStrip?:number;
    sensors:[{
      enabled: boolean, value: number, status: 'CONSTANT' | 'UNKNOWN' | "OK"
    }];
    accelerationSensors:[{
      type: string, enabled: boolean, value: number
    }]
  }
  
  