import { Commit, Dispatch } from "vuex";

// 用来存储应用状态的数据对象
const state = {
  isStaticEchartsShow: false
};

// 用来改变应用状态的函数
const mutations = {
  isStaticEchartsShow(state: any, isShow: boolean) {
    state.isStaticEchartsShow = isShow;
  }
};

// 异步调用api的函数（暂时不用）
const actions = {};

export default {
  // TODO [*] 19-03-21 暂时取消namespaced，先实现功能
  // namespaced: true,
  state,
  mutations,
  actions
};
