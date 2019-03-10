<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>| -->
      <router-link to="/index">导航栏页面</router-link>|
      <router-link to="/map">地图页面</router-link>|
      <router-link to="/vue2map">vue2map</router-link>|
      <router-link to="/vue2mapclear">vue2mapclear</router-link>|
      <router-link to="/main">整合页面</router-link>|
    </div>
    <router-view />
  </div>
</template>
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #dbe347;
  background: #2c3e50;
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
</style>
