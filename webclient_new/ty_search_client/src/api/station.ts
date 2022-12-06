import axios from 'axios'
import { host } from './common'
import authHeader from './auth_header'

import { ITyphoonParams4Station } from '@/interface/station'

// 后端的请求地址及端口
// export const host = host
axios.defaults.withCredentials = true

const area = '/gis'

/**
 * 获取指定站点的过程增水集合
 * @param params
 * @returns
 */
const loadStationDetailDataList = (params: ITyphoonParams4Station) => {
	const url = `${host}${area}/data/detaillist/`
	return axios.get(url, {
		headers: authHeader(),
		params: params,
	})
}

/**
 * 根据 tyNum 获取该过程的海洋站增水极值集合
 *
 * @param tyNum 台风编号
 * @returns
 */
const loadStationExtremumDataList = (tyNum: string) => {
	const url = `${host}${area}/data/station/extremum/list/`
	return axios.get(url, {
		headers: authHeader(),
		params: { num: tyNum },
	})
}

/**
 * + 22-12-06 根据 tyNum 获取该过程的海洋站实况极值集合
 * {max_date: "2012-08-05T16:00:00Z"
   max_val: 实况增水极值
   realdata_val: 实况增水极值
   station_code: "AOJIANG"
   tide_val: 天文潮}[]
 * @param tyNum 台风编号
 * @returns 
 */
const loadStationExtremumRealDataist = (tyNum: string) => {
	const url = `${host}${area}/data/station/extremum/realdata/list/`
	return axios.get(url, {
		headers: authHeader(),
		params: { num: tyNum },
	})
}

/**
 * 根据 codes(station) 获取该站点的四色警戒潮位信息
 * @param codes
 * @returns
 */
const loadStationAlertLevelDataList = (codes: string[]) => {
	const url = `${host}${area}/data/station/alert/list/`
	return axios.get(url, {
		headers: authHeader(),
		params: { codes: codes },
	})
}

/**
 * 获取海洋站中英文字典
 * @returns  [{
        "name": "AOJIANG",
        "chname": "鳌江"
    },]
 */
const loadStationNameDict = () => {
	const url = `${host}${area}/dict/station_ch/`
	return axios.get(url, {
		headers: authHeader(),
		params: {},
	})
}

export {
	loadStationDetailDataList,
	loadStationExtremumDataList,
	loadStationNameDict,
	loadStationAlertLevelDataList,
	loadStationExtremumRealDataist,
}
