<template>
  <div id="index_map">
    <rightBar></rightBar>
    <centerMap></centerMap>
    <rightBarDetail></rightBarDetail>
    <rightBarDisaster></rightBarDisaster>
    <rightBarRealData></rightBarRealData>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import rightBar from "@/views/member/bar/right_bar.vue";
import centerMap from "@/views/content/center_vue2map.vue";
import rightBarDetail from "@/views/member/bar/rightBarDetail.vue";
import rightBarDisaster from "@/views/member/bar/rightBarDisaster.vue";
import rightBarRealData from "@/views/member/bar/rightBarRealData.vue";
@Component({
  components: {
    rightBar,
    centerMap,
    rightBarDetail,
    rightBarDisaster,
    rightBarRealData
  }
})
export default class index_map extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = "Hello!";

  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }
}
</script>

<style scoped>
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
