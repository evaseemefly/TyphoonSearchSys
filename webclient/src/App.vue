<template>
  <div id="app">
    <!-- <div id="my-header"></div> -->
    <Header></Header>
    <!-- 测试时需要，注释掉 -->
    <!-- <div id="nav">
      <router-link to="/index">导航栏页面</router-link>|
      <router-link to="/map">地图页面</router-link>|
      <router-link to="/vue2map">vue2map</router-link>|
      <router-link to="/vue2mapclear">vue2mapclear</router-link>|
      <router-link to="/main">整合页面</router-link>|
    </div> -->
    <div id="index_map">
      <rightBar></rightBar>
      <router-view></router-view>
    </div>
    <!-- <div id="my-footer"></div> -->
    <Footer></Footer>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Footer from "@/views/footer/footer.vue";
import Header from "@/views/head/header.vue";
import rightBar from "@/views/member/bar/right_bar.vue";
@Component({
  components: { Footer, Header, rightBar }
})
export default class right_bar extends Vue {}
</script>

<style scoped>
/* 顶部及底部预留的空间 */
/* #my-header {
  background: red;
  width: 100%;
  flex: 1;
} */
/* 顶部及底部放在组件中 */
/* #my-footer {
  background: green;
  width: 100%;
  flex: 1;
} */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #dbe347;
  background: #2c3e50;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #dbe347;
}
#nav a.router-link-exact-active {
  color: #42b983;
}

#index_map {
  /* position: fixed;
  top: 80px;
  left: 0px;
  right: 0px;
  bottom: 20px; */
  flex: 12;
  display: flex;
  background: #2c3e50;
}
</style>
