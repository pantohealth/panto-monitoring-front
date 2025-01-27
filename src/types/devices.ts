export interface DEVICES{
_id: string,
name: string
}

export interface DEVICE_STATUS {
    _id: string,
    name:string,
    eventStatusCounts:{normal?:number,abnormal?:number,overlap?:number}
    newPoints:number,
    totalEvents:number,
}