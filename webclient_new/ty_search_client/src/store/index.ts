import Vue from 'vue'
import Vuex from 'vuex'

// 导入store/modules中的所有.ts，作为一个module引入
import mapStore from './modules/map'
import common from './modules/common'
import typhoon from './modules/typhoon'
import station from './modules/station'
import complex from './modules/complex'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		map: mapStore,
		common: common,
		typhoon: typhoon,
		station: station,
		complex: complex,
	},

	state: {
		current: '',
	},
})
