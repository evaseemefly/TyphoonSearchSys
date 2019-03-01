<template>
  <div>
    <rightBar></rightBar>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import rightBar from "@/views/member/bar/right_bar.vue";

@Component({
  components: {
    rightBar
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

<style>
</style>
