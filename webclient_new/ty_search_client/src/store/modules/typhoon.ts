import { FilterTyMidModel } from '@/middle_model/typhoon'
import {
	SET_CURRENT_TY,
	GET_CURRENT_TY,
	SET_CURRENT_TY_FORECAST_DT,
	GET_CURRENT_TY_FORECAST_DT,
} from '../types'
// export enum ProductType {
//     oil = 0,
//     rescue = 1
// }

interface ITyphoon {
	currentTy: FilterTyMidModel
	forecastDt: Date
}

// const actions={

// }
const state: ITyphoon = {
	currentTy: null,
	forecastDt: new Date(),
}
const getters = {
	[GET_CURRENT_TY](state: ITyphoon): FilterTyMidModel {
		return state.currentTy
	},
	[GET_CURRENT_TY_FORECAST_DT](state: ITyphoon): Date {
		return state.forecastDt
	},
}
// 使用dispatch调用
const actions = {}
// 使用commit调用
const mutations = {
	[SET_CURRENT_TY](state: ITyphoon, val: FilterTyMidModel): void {
		state.currentTy = val
	},
	[SET_CURRENT_TY_FORECAST_DT](state: ITyphoon, val: Date): void {
		state.forecastDt = val
	},
}

export default {
	namespaced: true,
	state: state,
	mutations,
	actions,
	getters,
}
