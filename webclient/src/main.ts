import Vue from "vue";
import App from "./App.vue";
// 引入element样式
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import store from "./store";
import jquery from "jquery";
// 引入bt
// 注意引入bt需要引入jquery以及（popper.js？——之前没用过）
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
