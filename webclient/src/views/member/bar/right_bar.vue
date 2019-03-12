<template>
  <div id="all_left_bar">
    <!-- 此处使用bt的手风琴效果实现 -->
    <el-col :span="4">
      <!-- <h5>自定义颜色</h5> -->
      <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu index="1">

          <template slot="title">
            <i class="el-icon-location"></i>
            <span>历史台风风暴潮查询</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1" @click="is_show_condition_bar=!is_show_condition_bar">条件搜索</el-menu-item>
            <el-menu-item index="1-2">条件搜索2</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item> -->
      </el-menu>
    </el-col>
    <SecondBar v-show="is_show_condition_bar"></SecondBar>
    <!-- <router-view></router-view> -->
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// import { menu } from "../src/middle_model/common.ts";
// import { menu } from "../src/middle_model/common";
import { Menu_Mid_Model } from "../../../middle_model/common";

import SecondBar from "@/views/member/secondBar/second_bar_condition_search.vue";

@Component({
  components: { SecondBar }
})
export default class right_bar extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = "Hello!";
  menu_index: number = 0;
  menu_list: Menu_Mid_Model[] = [
    new Menu_Mid_Model("条件搜索", "/search/condition"),
    new Menu_Mid_Model("搜索2", "/search/conditionByStation")
  ];
  is_show_condition_bar: boolean = false;
  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }
}
</script>

<style scoped>
#all_left_bar {
  position: relative;
}
</style>
