
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";

// state的接口
// tslint:disable-next-line:interface-name
export interface State {
  range: number;
  typhoon: DataList_Mid_Model;
  typhoonRealBase: TyphoonRealBase_Mid_Model;
}

// 用来存储应用状态的数据对象
const state: State = {
  // 地图中使用的指定经纬度的范围半径
  range: 20000,
  typhoon: null,
  // 当前选择的台风的实时model（加入了date字段）
  typhoonRealBase: null
};

// 用来改变应用状态的函数
// tslint:disable-next-line:typedef
const mutations = {
  // tslint:disable-next-line:typedef
  range(state: State, range: number) {
    state.range = range;
  },
  // tslint:disable-next-line:typedef
  typhoon(state: State, typhoon: DataList_Mid_Model) {
    state.typhoon = typhoon;
  },
  // tslint:disable-next-line:typedef
  typhoonRealBase(state: State, typhoon: TyphoonRealBase_Mid_Model) {
    state.typhoonRealBase = typhoon;
  }
};

// 异步调用api的函数（暂时不用）
// tslint:disable-next-line:typedef
const actions = {};

export default {
  // tODO [*] 19-03-21 暂时取消namespaced，先实现功能
  // namespaced: true,
  state,
  mutations,
  actions
};
