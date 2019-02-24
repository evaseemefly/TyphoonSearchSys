<template>
  <div>
    <!-- <ul class="nav nav-pills nav-stacked">
      <li
        v-for="(item, index) in menu_list"
        :key="index"
      >
        {{item}}
      </li>
    </ul> -->
    <div
      class="nav flex-column nav-pills col-md-1"
      id="v-pills-tab"
      role="tablist"
      aria-orientation="vertical"
    >
      <a
        class="nav-link active"
        id="v-pills-home-tab"
        data-toggle="pill"
        href="#v-pills-home"
        role="tab"
        aria-controls="v-pills-home"
        aria-selected="true"
        v-for="item in menu_list"
        :key="item.id"
      >{{item.name}}</a>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// import { menu } from "../src/middle_model/common.ts";
// import { menu } from "../src/middle_model/common";
import { Menu_Mid_Model } from "../../../middle_model/common";

@Component({
  components: {}
})
export default class right_bar extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = "Hello!";
  menu_index: number = 0;
  menu_list: Menu_Mid_Model[] = [
    new Menu_Mid_Model("测试菜单1"),
    new Menu_Mid_Model("测试菜单2")
  ];
  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }
}
</script>

<style>
</style>
