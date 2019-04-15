
/**
 *定义的stationtide Data的接口
 *
 * @interface IStation
 */
interface IStation {
    code: string,
    startdate: Date,
    stationname: string,
    // 警戒潮位
    jw: number,
    // 平均潮位
    lev: number,
    point: any
}

/**
 * 定义的forecast Data的接口
 *
 * @interface IForecast
 */
interface IForecast {
    // 预报潮位
    val_forecast: number,
    // 实测潮位
    val_real: number,
    occurred: Date
}
/**
 * 组合了forecast Data + stationtide Data的接口
 *
 * @interface IStationForecast
 * @extends {IStation}
 * @extends {IForecast}
 */
interface IStationForecast extends IStation, IForecast {

}

export {
    IStation,
    IForecast,
    IStationForecast
}