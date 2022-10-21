import { Commit, Dispatch } from 'vuex'
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from '@/middle_model/common.ts'
// 引入数据格式规范接口
import { IStation } from '@/interface/map/map.ts'

// state的接口
export interface State extends ISearch, IDisplay, IRange, ITyphoon {
  // range: number
  // typhoon: DataList_Mid_Model
  // typhoonRealBase: TyphoonRealBase_Mid_Model
}
/**
 * 台风范围接口
 *
 * @export
 * @interface IRange
 */
export interface IRange {
  range: number
}

export interface ITyphoon {
  typhoon: DataList_Mid_Model
  typhoonRealBase: TyphoonRealBase_Mid_Model
  station: IStation
}

export interface ISearch {
  searchNum: string
  searchStationName: string
  completeData: object
}

export interface IDisplay {
  displayData: object
}

// 用来存储应用状态的数据对象
const state: State = {
  // 地图中使用的指定经纬度的范围半径
  range: 20000,
  typhoon: null,
  // 当前选择的台风的实时model（加入了date字段）
  // typhoonRealBase: null
  typhoonRealBase: null,
  // 由历史测站数据查询选中的台风编号（num）
  searchNum: null,
  // 由历史测站数据查询选中的测站name（str）
  searchStationName: null,
  completeData: {},
  // testState: 0,
  // 当前选中的测站
  station: null,
  displayData: {
    forecastdata: [],
    realdata: [],
    startdate: null
  }
}

// 用来改变应用状态的函数
const mutations = {
  range(state: State, range: number) {
    state.range = range
  },
  typhoon(state: State, typhoon: DataList_Mid_Model) {
    state.typhoon = typhoon
  },
  typhoonRealBase(state: State, typhoon: TyphoonRealBase_Mid_Model) {
    state.typhoonRealBase = typhoon
  },
  station(state: State, station: IStation) {
    state.station = station
  },
  /**
   * 历史测站数据查询 页面 的台风编号（string）类型
   *
   * @param {State} state
   * @param {string} num
   */
  searchNum(state: State, num: string) {
    state.searchNum = num
  },
  /**
   * 历史测站数据查询 页面中的 选择的测站的名字
   *
   * @param {State} state
   * @param {string} name
   */
  searchStationName(state: State, name: string) {
    state.searchStationName = name
  },
  setData(state, data) {
    state.displayData = data
    return state.displayData
  },
  setCompleteData(state, data) {
    state.completeData = data
    return state.completeData
  },
  trigger(state, increment) {
    state.testState += increment
  }
}

// tslint:disable-next-line:typedef
const getters = {
  getData(state: any): any {
    return state.displayData
  },
  getTest(state: any): number {
    return state.testState
  }
}

// 异步调用api的函数（暂时不用）
const actions = {}

export default {
  // TODO [*] 19-03-21 暂时取消namespaced，先实现功能
  // namespaced: true,
  state,
  mutations,
  actions,
  getters
}
