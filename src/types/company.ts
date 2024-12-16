export interface COMPANIES {
    _id: string,
    name: string,
    totalOnlineHours: number,
    videoRequestNumber: number,
    totalClicks: number,
    newPoints: number,
    mergePoints: number
    simulationRequests: number
    eventStatusCounts:{normal?:number,abnormal?:number,overlap?:number}
}