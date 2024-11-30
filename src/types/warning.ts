export interface Warning {
    _id: number,
    time: string,
    type: string,
    side: string,
    device: {name:string},
    action: string,
    status: string,
    message: string,
    detail:{
        deviceName:string,
        eventIds:string[],
        passedTime:number,
        signalId:string,
        time:string,
        type:string
    },
  }
