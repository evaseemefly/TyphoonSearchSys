<template>
  <div id="all_left_bar">
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
      id="left_top_bar"
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
      >
        <router-link :to="{path:item.url}">
          {{item.name}}
        </router-link>
      </a>

    </div>
    <router-view>
    </router-view>

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
    new Menu_Mid_Model("条件搜索", "/search/condition"),
    new Menu_Mid_Model("搜索2", "")
  ];
  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }
}
</script>

<style>
#all_left_bar {
  position: relative;
}
#left_top_bar {
  position: absolute;
  margin-top: 0px;
  margin-left: 5px;
}
</style>
