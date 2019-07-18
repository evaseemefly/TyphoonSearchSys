import Vue from "vue";
import App from "./App.vue";
// 引入element样式
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import store from "./store";
import jquery from "jquery";
// 引入bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
// 引入fecha
import fecha from "fecha";
// 引入echarts
// window.echarts = require("echarts");
// import "echarts/";
// import echarts from "echarts";
import "echarts";
// 引入bt
// 注意引入bt需要引入jquery以及（popper.js？——之前没用过）
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

//引入滑动模块
import VueAwesomeSwiper from "vue-awesome-swiper"
import "swiper/dist/css/swiper.css"

// 引入font-awesome
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueAwesomeSwiper)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
