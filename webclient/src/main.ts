<<<<<<< HEAD
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import jquery from 'jquery'
// 引入bt
// 注意引入bt需要引入jquery以及（popper.js？——之前没用过）
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
=======
>>>>>>> pr/1

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import jquery from "jquery";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
