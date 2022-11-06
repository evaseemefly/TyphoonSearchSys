import axios from 'axios'
import { host } from './common'
import authHeader from './auth_header'
import { ISearchTyStationParams } from '@/middle_model/api_params'
// 后端的请求地址及端口
// export const host = host
axios.defaults.withCredentials = true

const area = '/gis'

/**
 * @description
 * @author evaseemefly
 * @date 2022/10/18
 * 台风参数接口:
 * latlon,range,size,index
 * @export
 * @interface ITyphoonParams
 * @extends {IPage}
 */
export interface ITyphoonParams extends IPage {
	latlon: number[]
	range: number
	//TODO:[*] 19-05-13 加入了分页
}
/**
 * 可分页接口:
 * size,index
 * @export
 * @interface IPage
 */
export interface IPage {
	// 页容积
	size?: number
	// 当前页
	index?: number
	// 跳转页
	to?: number
}

/** + 22-10-18 默认page */
const DEFAULT_PAGE: IPage = {
	size: -1,
	index: -1,
}

/**
 * + 22-10-18
 * 获取经过对应范围的台风列表
 * @param params
 * @returns
 */
const loadTyListByRange = (params: ITyphoonParams) => {
	const url = `${host}${area}/filter/range/`
	const getData = { ...params, ...DEFAULT_PAGE }
	return axios.get(url, {
		headers: authHeader(),
		params: {
			latlon: getData.latlon,
			range: getData.range,
			size: getData.size,
			index: getData.index,
		},
	})
}

/**
 * + 22-10-19 根据 code 加载对应的台风的路径及气象信息
 * @param code
 * @returns
 */
const loadTyRealDataList = (code: string, num: string) => {
	const url = `${host}${area}/data/typhoonrealdata/`
	return axios.get(url, {
		headers: authHeader(),
		params: {
			code: code,
			num: num,
		},
	})
}

/**
 * 根据 code name date 获取该时刻对应的全部站点
 * @param par :{
	code: string
	name: string
	date: Date
}
 * @returns
 */
const loadStationTideDataList = (par: ISearchTyStationParams) => {
	const url = `${host}${area}/data/stationtide/`
	return axios.get(url, {
		params: par,
	})
}

export { loadTyListByRange, loadTyRealDataList, loadStationTideDataList }
