
// 定义的stationtideData的接口
interface IStation {
    code: string,
    startdate: Date,
    stationname: string,
    //
    jw: number,
    lev: number,
    point: any
}

// 定义的forecast Data的接口
interface IForecast {
    // 实测潮位
    val: number,
    occurred: Date
}

export {
    IStation,
    IForecast
}