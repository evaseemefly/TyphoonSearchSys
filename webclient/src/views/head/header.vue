<template>
  <div id="my-header">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a
        class="navbar-brand"
        href="#"
      >台风历史路径查询系统</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a
              class="nav-link"
              href="#"
            >地图 <span class="sr-only">(current)</span></a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="搜索"
            aria-label="搜索"
          >
          <button
            class="btn btn-outline-primary my-2 my-sm-0"
            type="submit"
          >搜索</button>
        </form>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class header extends Vue {}
</script>

<style scoped>
#my-header {
  /* background: red; */
  width: 100%;
  flex: 0.5;
  background: #2c3e50;
  display: flex;
  flex-direction: column;
}

#my-header .navbar {
  /* background: linear-gradient(to right, #1a6865, #2c3e50); */
  background: linear-gradient(to right, #2c3e50 30%, rgba(4, 107, 114, 0.639));
  /* height: 100%; */
  flex: 1;
}
.navbar-nav li {
  transition: 0.3s;
}
.navbar-brand {
  color: rgba(254, 203, 0, 0.934) !important;
  font-weight: bolder;
  text-shadow: 2px 2px 10px #000;
}
.navbar-nav > li > a {
  color: rgba(254, 233, 0, 0.851) !important;
  font-weight: bolder;
  text-shadow: 2px 2px 10px #000;
}
.activedli {
  background: #143b4d;
  transform: scale(1.1);
  box-shadow: 0px 1px 2px black;
}
.navbar-nav {
  float: right;
  margin-right: 200px;
}
</style>