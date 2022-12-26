import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
// 注意引入 vue2-leaflet 需要在入口文件手动引入 leaflet.css!
import 'leaflet/dist/leaflet.css'
// elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueInteract from 'vue-interact'
import 'vue-interact/dist/vue-interact.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHatWizard } from '@fortawesome/free-solid-svg-icons'

// import {
// 	FontAwesomeIcon,
// 	FontAwesomeLayers,
// 	FontAwesomeLayersText,
// } from '@fortawesome/vue-fontawesome'
// import solid from '@fortawesome/fontawesome-free-solid'
// import regular from '@fortawesome/fontawesome-free-regular'
// import brands from '@fortawesome/fontawesome-free-brands'

// Vue.config.productionTip = false
// // @ts-ignore
// library.add(solid)
// // @ts-ignore
// library.add(regular)
// // @ts-ignore
// library.add(brands)

// Vue.component('font-awesome-icon', FontAwesomeIcon)
// Vue.component('font-awesome-layers', FontAwesomeLayers)
// Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.use(ElementUI)
Vue.use(VueInteract)

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')
