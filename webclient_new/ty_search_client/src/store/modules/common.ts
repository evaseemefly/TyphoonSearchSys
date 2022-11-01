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
	SET_SELECTED_LOOP,
	GET_SELECTED_LOOP,
	SET_SHOW_STATION_DETAIL_FORM,
	SET_SHOW_STATION_EXTREMUM_FORM,
	SET_SHOW_TY_SEARCH_FORM,
	GET_SHOW_STATION_DETAIL_FORM,
	GET_SHOW_STATION_EXTREMUM_FORM,
	GET_SHOW_TY_SEARCH_FORM,
} from '../types'

import { DEFAULT_DATE_STEP } from '@/const/default'

interface Common {
	scaleRange: number[]
	isoSurgeScaleValRange: number[]
	isoSurgeScaleStrList: string[]
	isShowOptionsForm: boolean
	scaleDesc: string
	step: number
	/**
	 * @description 是否为选择圈选 t:进行圈选 ; f:未进行圈选
	 * @author evaseemefly
	 * @date 2022/10/30
	 * @type {boolean}
	 * @memberof Common
	 */
	isSelectedLoop: boolean
	/** 是否显示台风检索详情窗口 */
	isShowTySearchDetailForm: boolean
	/** 是否显示海洋站增水详情窗口 */
	isShowStationDetailForm: boolean
	/** 是否显示台风过程海洋站极值窗口 */
	isShowStationExtremumForm: boolean
}

const state: Common = {
	scaleRange: [],
	isShowOptionsForm: false,
	isoSurgeScaleStrList: [],
	isoSurgeScaleValRange: [],
	scaleDesc: '',
	step: DEFAULT_DATE_STEP,
	/** 是否为选择圈选 t:进行圈选 ; f:未进行圈选 */
	isSelectedLoop: false,
	isShowTySearchDetailForm: false,
	isShowStationDetailForm: false,
	isShowStationExtremumForm: false,
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
	[GET_SELECTED_LOOP](state: Common): boolean {
		return state.isSelectedLoop
	},
	[GET_SHOW_TY_SEARCH_FORM](state: Common): boolean {
		return state.isShowTySearchDetailForm
	},
	[GET_SHOW_STATION_EXTREMUM_FORM](state: Common): boolean {
		return state.isShowStationExtremumForm
	},
	[GET_SHOW_STATION_DETAIL_FORM](state: Common): boolean {
		return state.isShowStationDetailForm
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
	[SET_SELECTED_LOOP](state: Common, val: boolean): void {
		state.isSelectedLoop = val
	},
	[SET_SHOW_STATION_DETAIL_FORM](state: Common, val: boolean): void {
		state.isShowStationDetailForm = val
	},
	[SET_SHOW_STATION_EXTREMUM_FORM](state: Common, val: boolean): void {
		state.isShowStationExtremumForm = val
	},
	[SET_SHOW_TY_SEARCH_FORM](state: Common, val: boolean): void {
		state.isShowTySearchDetailForm = val
	},
}

export default {
	namespaced: true,
	state: state,
	mutations,
	actions,
	getters,
}
