<template>
  <div id="my_content">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <rightBar></rightBar>
        </el-aside>
        <el-main>
          <centerMap></centerMap>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import rightBar from "@/views/member/bar/right_bar.vue";
import centerMap from "@/views/content/center_vue2map.vue";

@Component({
  components: {
    rightBar,
    centerMap
  }
})
export default class index_bar extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = "Hello!";

  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }
}
</script>

<style scoped>
#my_content {
  /* position: absolute;
  left: 0px;
  right: 0px;
  top: 100px;
  bottom: 0px; */
}
</style>
