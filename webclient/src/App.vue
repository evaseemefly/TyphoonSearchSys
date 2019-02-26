<template>
  <div id="app">
<<<<<<< HEAD
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>|
      <router-link to="/index">测试页面</router-link>
    </div>
    <router-view />
=======
    <LeftBar/>
    <!-- <router-view/> -->
>>>>>>> pr/1
  </div>
</template>
<script>
import LeftBar from "@/views/Main/LeftBar/LeftBar";

<<<<<<< HEAD
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
=======
export default {
  components: {
    LeftBar
  }
};
</script>
>>>>>>> pr/1

<style scoped>
</style>
