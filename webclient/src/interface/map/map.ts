
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
 * 测站的观测值接口
 *
 * @interface IStationTide
 */
interface IStationObservationTide{
    val:number,
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
/**
 * 为echarts散点图提供的数据接口
 *
 * @interface IEchartsScatterData
 */
interface IEchartsScatterData {
    // 测站名称
    name: String,
    /*
    0-精度
    1-纬度
    2-潮位值
    */
    value: Array<number>
}

export {
    IStation,
    IForecast,
    IStationForecast,
    IEchartsScatterData,
    IStationObservationTide
}