<template src="./text/text_form.html"></template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// 通过vuex-class的写法，引入vuex
import { Getter, Mutation, State } from "vuex-class";

// 部分model及middle model
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";
import { MeteorologyRealData_Mid_Model } from "@/middle_model/typhoon.ts";

// 自己写的一些公共组件
import collapse from "@/common/effectControls/collapse.ts";

// 后台请求的api
import { ITyphoonRealDataParamas, loadTyphoonWord } from "@/api/api.ts";

// TODO:[*] 19-05-04 将data从vue主文件中拆分
// 使用mixin的方式，不使用拓展分隔符的方式
import TextFormDataMixin from "./text/text_form_data_mixin";
import { mixins } from "vue-class-component";

@Component({
  components: { MyCollapse: collapse }
})
// TODO:[*] 19-05-04 将data拆分至外部的ts文件，并使用mixin的方式载入，此处备份
// export default class text_form extends Vue {
export default class text_form extends mixins(TextFormDataMixin) {
  // title: string = "";
  // text: string = "";
  // isActive: boolean = false;

  // 当前选择的台风(由vuex获取)
  get targetTyphoon(): MeteorologyRealData_Mid_Model {
    return this.$store.state.map.typhoon;
  }

  // 监听由vuex更新的targetTyphoon
  // 注意此处的watch不要写错，watch中的名字为监听的变量的名称
  // 此处的targetTyphoon是上面的computed的targetTyphoon
  @Watch("targetTyphoon")
  onTargetTyphoon(val: DataList_Mid_Model) {
    /*
      当前台风发生变化时，向后台请求并加载后台返回的json

    */
    var myself = this;
    this.title = val.code;
    loadTyphoonWord({ code: val.code }).then(res => {
      if (res.status === 200) {
        if (res.data.length === 1) {
          if ("wordDocument" in res.data[0]) {
            // 注意还需要替换换行符

            myself.text = res.data[0].wordDocument.replace(/[\n\r]/g, "<br>");
          }
        }
      }
      console.log(res.data);
    });
    // console.log(val);
  }
}
</script>

<style src="./text/text_form.css" scoped>
</style>
