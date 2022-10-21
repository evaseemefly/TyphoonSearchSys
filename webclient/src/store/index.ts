import Vue from 'vue'
import Vuex from 'vuex'

// 导入store/modules中的所有.ts，作为一个module引入
import modules from '@/store/modules'
// import map from './modules/map'

Vue.use(Vuex)

export default new Vuex.Store({
  modules
})
