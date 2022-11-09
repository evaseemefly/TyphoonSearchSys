import { SET_COMPLEX_OPTS_CURRENT_STATION, GET_COMPLEX_OPTS_CURRENT_STATION } from '../types'
import {
	DEFAULT_STATION_CODE,
	DEFAULT_STATION_NAME,
	DEFAULT_TY_NAME,
	DEFAULT_TY_CODE,
	DEFAULT_TY_NUM,
} from '@/const/default'
interface IComplex {
	currentStationOpts: { tyNum: string; tyCode: string; stationName: string; stationCode: string }
}

const state: IComplex = {
	currentStationOpts: {
		tyNum: DEFAULT_TY_NUM,
		tyCode: DEFAULT_TY_CODE,
		stationName: DEFAULT_STATION_NAME,
		stationCode: DEFAULT_STATION_CODE,
	},
}
const getters = {
	[GET_COMPLEX_OPTS_CURRENT_STATION](state: IComplex): {
		tyNum: string
		tyCode: string
		stationName: string
		stationCode: string
	} {
		return state.currentStationOpts
	},
}
// 使用dispatch调用
const actions = {}
// 使用commit调用
const mutations = {
	[SET_COMPLEX_OPTS_CURRENT_STATION](
		state: IComplex,
		val: {
			tyNum: string
			tyCode: string
			stationName: string
			stationCode: string
		}
	): void {
		state.currentStationOpts = val
	},
}

export default {
	namespaced: true,
	state: state,
	mutations,
	actions,
	getters,
}
