import { FilterTyMidModel } from '@/middle_model/typhoon'
import { SET_CURRENT_TY, GET_CURRENT_TY } from '../types'
// export enum ProductType {
//     oil = 0,
//     rescue = 1
// }

interface ITyphoon {
	currentTy: FilterTyMidModel
}

// const actions={

// }
const state: ITyphoon = {
	currentTy: null,
}
const getters = {
	[GET_CURRENT_TY](state: ITyphoon): FilterTyMidModel {
		return state.currentTy
	},
}
// 使用dispatch调用
const actions = {}
// 使用commit调用
const mutations = {
	[SET_CURRENT_TY](state: ITyphoon, val: FilterTyMidModel): void {
		state.currentTy = val
	},
}

export default {
	namespaced: true,
	state: state,
	mutations,
	actions,
	getters,
}
