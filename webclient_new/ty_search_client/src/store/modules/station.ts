import { SET_STATION_CODE, GET_STATION_CODE } from '../types'
import { DEFAULT_STATION_CODE } from '@/const/default'
interface IStation {
	stationCode: string
}

const state: IStation = {
	stationCode: DEFAULT_STATION_CODE,
}
const getters = {
	[GET_STATION_CODE](state: IStation): string {
		return state.stationCode
	},
}
// 使用dispatch调用
const actions = {}
// 使用commit调用
const mutations = {
	[SET_STATION_CODE](state: IStation, val: string): void {
		state.stationCode = val
	},
}

export default {
	namespaced: true,
	state: state,
	mutations,
	actions,
	getters,
}
