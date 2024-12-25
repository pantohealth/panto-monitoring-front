export interface Task {
    deviceId?: number,
    name:string,
    applicator: {_id?:number,username:string},
    condition: string,
    base64File?: string
  }

export interface NewEntery {
    name:string,
    deviceId: { _id:string, name:string }
    condition: string,
    start?:string,
    end?:string,
  }
