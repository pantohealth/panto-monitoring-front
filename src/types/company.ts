export interface COMPANIES {
    _id: string,
    name: string,
    totalOnlineHours: number,
    videoRequestNumber: number,
    totalClicks: number,
    newPoints: number,
    // mergePoints: number,
    simulationRequests: number,
    totalEvents: number,
    numberOfCatenary:number,
    eventStatusCounts:{normal?:number,abnormal?:number,overlap?:number}
}