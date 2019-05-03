<template>
  <form id="textform">
    <div>
      <h2>{{title}}</h2>
      <p>
        {{text}}
      </p>
    </div>
  </form>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
//   props: {
//     // 标题
//     title: String,

//     // 内容
//     text: String
//   }
})
export default class text_form extends Vue {
  title: string = "测试题目";
  text: string = "测试内容";
}
</script>

<style>
#textform {
  position: fixed;
  top: 100px;
  right: 50px;
  height: 200px;
  background: red;
  z-index: 9999;
}
</style>
