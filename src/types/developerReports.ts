export interface Task {
    _id?: number,
    name:string,
    applicator: {_id?:number,username:string},
    deviceId?: {_id?:string,name:string}
    condition: string,
    createdAt?:string,
    start?:string,
    end?:string,
  }


export interface NewEntery {
    name:string,
    deviceId: { _id:string, name:string }
    condition: string,
    start?:string,
    end?:string,
  }
