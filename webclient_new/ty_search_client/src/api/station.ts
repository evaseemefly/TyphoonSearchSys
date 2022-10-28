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
 * 根据 tyNum 获取该过程的海洋站极值集合
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

export { loadStationDetailDataList, loadStationExtremumDataList }
