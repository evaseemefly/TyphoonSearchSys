<template>
  <div id="map_range_slider">
    <el-slider v-model="range" :min="min" :max="max" :step="step" show-stops></el-slider>
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-success" @click="getRangeTyphoonList">
        <span class="glyphicon glyphicon-play" aria-hidden="true">搜索</span>
      </button>
      <button type="button" class="btn btn-danger">
        <span class="glyphicon glyphicon glyphicon-stop" aria-hidden="true">清除</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// TODO [*] 19-03-21 通过vuex-class的写法，引入vuex
//import { Getter, Mutation, State } from "vuex-class";
@Component({
  components: {}
})
@Component
export default class right_bar extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = "Hello!";
  min: number = 10000;
  max: number = 100000;
  step: number = 10000;
  // range: number = 6000;
  is_show_condition_bar: boolean = false;
  // TODO [*] 19-03-21 通过vuex-class的写法，引入vuex
  // @State("range") range;
  // @Mutation("range") range;
  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }

  // 根据当前的range以及经纬度提交后台返回对应的台风列表
  getRangeTyphoonList(): void {
    var myself = this;
    // 触发父组件的请求方法
    this.$emit("loadTyphoonList");
  }

  // TODO [*] 19-03-21 暂时使用此种方式get和set sotre（回头在使用vuex-class的方式）
  get range(): number {
    return this.$store.state.map.range;
  }
  set range(val: number) {
    // this.$store.state.saveRange = val;
    // TODO [*] 19-03-21 暂时去掉namespace，注意不要有重名（namespace的问题稍后解决）
    this.$store.commit("range", val);
  }
  // set range(value: any) {
  //   console.log(value);
  // }
}
</script>

<style scoped>
#map_range_slider {
  /* position: relative; */
  z-index: 19999;
  position: absolute;
  bottom: 50px;
  left: 50px;
  width: 250px;
  height: 50px;
  /* background: rgba(47, 68, 84, 0.331); */
}
</style>
