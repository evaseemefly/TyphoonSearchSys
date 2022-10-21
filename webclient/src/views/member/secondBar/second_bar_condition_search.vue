<template src="@/views/member/secondBar/typhoon_list_bar/typhoon_list_bar.html"></template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

// 引入element
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import { DataList_Mid_Model } from "../../../middle_model/common";

import endBar from "../endBar/end_bar_data_list.vue";
// import endDataList from "../endBar/end_data_list.vue";
import endBarTest from "../endBar/end_bar_test.vue";

// 使用mixin的方式拓展data
import TyphoonListBarDataMixin from "./typhoon_list_bar/typhoon_list_bar_data_mixin";
import { mixins } from "vue-class-component";

@Component({
  components: { endBar, endBarTest }
})
export default class second_bar_condition_search extends mixins(
  TyphoonListBarDataMixin
) {
  // 初始数据可以直接声明为实例的属性
  data_list: DataList_Mid_Model[] = [];
  is_show: boolean = false;
  end_bar_show: boolean = false;
  code: string = "";
  typhoon: DataList_Mid_Model = null;
  // 组件方法也可以直接声明为实例的方法
  onClick(obj: DataList_Mid_Model): void {
    var myself = this;
    myself.code = obj.code;
    myself.end_bar_show = true;
    myself.typhoon = obj;
  }
}
</script>

<style scoped src="@/views/member/secondBar/typhoon_list_bar/typhoon_list_bar.css">
</style>
