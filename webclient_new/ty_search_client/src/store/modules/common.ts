import {
	SET_PRODUCT_TYPE,
	GET_PRODUCT_TYPE,
	SET_SCALE_KEY,
	GET_SCALE_KEY,
	GET_SCALE_RANGE,
	SET_SCALE_RANGE,
	SET_SCALE_DESC,
	GET_SCALE_DESC,
	GET_SHOW_OPTS_FORM,
	SET_SHOW_OPTS_FORM,
	SET_ISOSURGE_COLOR_SCALE_VAL_RANGE,
	GET_ISOSURGE_COLOR_SCALE_VAL_RANGE,
	SET_ISOSURGE_COLOR_SCALE_STR_LIST,
	GET_ISOSURGE_COLOR_SCALE_STR_LIST,
	SET_DATE_STEP,
	GET_DATE_STEP,
} from '../types'

import { DEFAULT_DATE_STEP } from '@/const/default'
// export enum ProductType {
//     oil = 0,
//     rescue = 1
// }

interface Common {
	scaleRange: number[]
	isoSurgeScaleValRange: number[]
	isoSurgeScaleStrList: string[]
	isShowOptionsForm: boolean
	scaleDesc: string
	step: number
}

// const actions={

// }
const state: Common = {
	scaleRange: [],
	isShowOptionsForm: false,
	isoSurgeScaleStrList: [],
	isoSurgeScaleValRange: [],
	scaleDesc: '',
	step: DEFAULT_DATE_STEP,
}
const getters = {
	[GET_SCALE_RANGE](state: Common): number[] {
		return state.scaleRange
	},
	[GET_SHOW_OPTS_FORM](state: Common): boolean {
		return state.isShowOptionsForm
	},
	[GET_ISOSURGE_COLOR_SCALE_VAL_RANGE](state: Common): number[] {
		return state.isoSurgeScaleValRange
	},
	[GET_ISOSURGE_COLOR_SCALE_STR_LIST](state: Common): string[] {
		return state.isoSurgeScaleStrList
	},
	[GET_SCALE_DESC](state: Common): string {
		return state.scaleDesc
	},
	[GET_DATE_STEP](state: Common): number {
		return state.step
	},
}
// 使用dispatch调用
const actions = {}
// 使用commit调用
const mutations = {
	[SET_SCALE_RANGE](state: Common, range: number[]): void {
		state.scaleRange = range
	},
	[SET_SCALE_DESC](state: Common, desc: string): void {
		state.scaleDesc = desc
	},
	[SET_SHOW_OPTS_FORM](state: Common, val: boolean): void {
		state.isShowOptionsForm = val
	},
	[SET_ISOSURGE_COLOR_SCALE_VAL_RANGE](state: Common, range: number[]): void {
		state.isoSurgeScaleValRange = range
	},
	[SET_ISOSURGE_COLOR_SCALE_STR_LIST](state: Common, scaleList: string[]): void {
		state.isoSurgeScaleStrList = scaleList
	},
	[SET_DATE_STEP](state: Common, val: number): void {
		state.step = val
	},
}

export default {
	namespaced: true,
	state: state,
	mutations,
	actions,
	getters,
}
