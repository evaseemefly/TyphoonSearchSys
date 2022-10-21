import axios from 'axios'
import { MenuType } from '@/common/enum/menu.ts'

// 后端的请求地址及端口
export const host = 'http://127.0.0.1:8000'
// 实际部署地址及端口
// export const host = 'http://128.5.10.26:8000'
// 实际部署地址及端口
// export const host = 'http://128.5.10.26:8000'
// 本地docker环境
// export const host = 'http://127.0.0.1:32773'
// export const host ="http://127.0.0.1:64807";
// export const host = 'http://128.5.6.112:8015'
// TODO:[-] 21-07-23 尝试不联网访问docker
// export const host = 'http://128.5.10.26:8000'

axios.defaults.withCredentials = true
axios.defaults.headers = {
  // 'Access-Control-Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept,access-control-allow-methods,access-control-allow-origin',
  // 'Access-Control-Allow-Headers': 'Content-Type',
  // 'Content-Type': 'application/json;charset=UTF-8',
  // 'Content-Type': 'application/x-www-form-urlencoded',
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
}
// 加载船舶状态信息列表
export interface ITyphoonParams extends IPage {
  latlon: number[]
  range: number
  //TODO:[*] 19-05-13 加入了分页
}
/**
 * 可分页接口
 *
 * @export
 * @interface IPage
 */
export interface IPage {
  // 页容积
  size: number
  // 当前页
  index: number
  // 跳转页
  to?: number
}

export interface ITyphoonRealDataParamas {
  code: string
}

// 选中台风（含时刻）
export interface ITyphoonRealBaseParams {
  code: string
  name: string
  date: Date
}

/**
 * 获取指定指定台风过程指定测站的数据的查询条件
 *
 * @export
 * @interface ITyphoonParams4Station
 */
export interface ITyphoonParams4Station {
  /**
   *台风code
   *
   * @type {string}
   * @memberof ITyphoonParams4Station
   */
  code: string
  /**
   *海洋站名字
   *
   * @type {string}
   * @memberof ITyphoonParams4Station
   */
  name: string
  /**
   * 是预报还是实测
   *
   * @type {MenuType}
   * @memberof ITyphoonParams4Station
   */
  type: MenuType
  /**
   * 台风编号（4位数字）
   *
   * @type {string}
   * @memberof ITyphoonParams4Station
   */
  num: string
}

export /**
 *
 *
 * @param {ITyphoonParams} par
 * @returns
 */
  const loadTyphoonList = (par: ITyphoonParams) => {
    let typhoonlistUrl = `${host}/gis/filter/range/`
    return axios.get(typhoonlistUrl, {
      params: par
    })
  }

export const loadTyphoonRealData = (par: ITyphoonRealDataParamas) => {
  let typhoonrealdataUrl = `${host}/gis/data/typhoonrealdata/`
  return axios.get(typhoonrealdataUrl, {
    params: par
  })
}

// 根据 台风（含时间信息）获取潮位站数据
export const loadStationTideDataList = (par: ITyphoonRealBaseParams) => {
  let stationTideUrl = `${host}/gis/data/stationtide/`
  return axios.get(stationTideUrl, {
    params: par
  })
}

export /**
 * 根据 台风(code) 加载指定测站(station name)的过程潮位数据
 *
 * @param {ITyphoonParams4Station} par
 * @returns
 */
  const loadStationDetailDataList = (par: ITyphoonParams4Station) => {
    let stationDataUrl = `${host}/gis/data/detaillist/`
    return axios.get(stationDataUrl, {
      params: par
    })
  }
export /**
 * 根据 台风（code）以及 测站名称（station name） 查询风暴增水极值及对应时间
 *
 * @param {ITyphoonParams4Station} par
 * @returns
 */
  const loadStationStatistics = (par: ITyphoonParams4Station) => {
    let stationStatisticsUrl = `${host}/gis/data/stationstatistics/`
    return axios.get(stationStatisticsUrl, {
      params: par
    })
  }

export /**
 * 根据台风（code）获取对应的灾情描述文本内容
 *
 * @param {ITyphoonRealDataParamas} par
 * @returns
 */
  const loadTyphoonWord = (par: ITyphoonRealDataParamas) => {
    let wordUrl = `${host}/gis/word/disaster/`
    return axios.get(wordUrl, {
      params: par
    })
  }

export /**
 *  根据传入的 typhon 判断是否有对应的 测站列表
 *  19-06-29
 * @param {string} par
 * @returns
 */
  const checkStationCount4Typhoon = (par: string) => {
    let url = `${host}/gis/data/CheckStation4Typhoon/`
    return axios.get(url, {
      params: {
        num: par
      }
    })
  }
  
export
  /**
   * 获取测站对应的中文名称字典
   *
   * @returns
   */
  const getStationNameCh = () => {
    let url = `${host}/gis/dict/station_ch/`
    return axios.get(url)
  }

