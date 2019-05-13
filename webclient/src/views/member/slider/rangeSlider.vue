<template src="./range/range.html"></template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// TODO [*] 19-03-21 通过vuex-class的写法，引入vuex
import { Getter, Mutation, State } from "vuex-class";

import { mixins } from "vue-class-component";
// 使用mixin的方式，拓展的data
import RangeDataMixin from "./range/range_data_mixin";
@Component({
  components: {}
})
@Component
export default class right_bar extends mixins(RangeDataMixin) {
  // export default class right_bar extends Vue {
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
    // this.$emit("loadTyphoonList", myself);
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

<style scoped src="./range/range.css">
</style>
