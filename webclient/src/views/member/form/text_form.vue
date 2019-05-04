<template>
  <form id="main">
    <button type="button" @click="isActive=!isActive" class="btn btn-info ani">灾情信息</button>
    <MyCollapse>
      <div v-show="isActive" id="textform" class="card" style="width: 18rem;">
        <div class="card-body" v-html="text">
          <h5 class="card-title">{{title}}</h5>
          <h6 class="card-subtitle mb-2 text-muted">台风编号</h6>
          <p class="card-text">{{text}}</p>
          <!-- <p class="card-text">{{targetTyphoon}}</p> -->
          <a href="#" class="card-link">当前台风</a>
        </div>
      </div>
    </MyCollapse>
  </form>
</template>

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

@Component({
  components: { MyCollapse: collapse }
})
export default class text_form extends Vue {
  title: string = "";
  text: string = "";
  isActive: boolean = false;

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

<style scoped>
#main {
  position: fixed;
  top: 100px;
  right: 50px;
  /* height: 200px; */
  /* background: red; */
  z-index: 9999;
}
#main button {
  margin-bottom: 10px;
}
#textform {
  background: linear-gradient(to right, #2c3e50 30%, rgba(4, 107, 114, 0.639));
  max-height: 600px;
  overflow-y: scroll;
}
/* 设置自定义的滚动条效果： */
#textform::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #2c3e50;
  border-radius: 10px;
}

#textform::-webkit-scrollbar {
  width: 10px;
  background-color: #2c3e50;
}

/* 这么设置滚动条的透明度无效 */
/* #textform::-webkit-scrollbar-track {
  opacity: 0.4;
} */

/* #textform::-webkit-scrollbar-track {
  opacity: 0.4;
} */

#textform::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122, 153, 217)),
    color-stop(0.72, rgb(73, 125, 189)),
    color-stop(0.86, rgb(28, 58, 148))
  );
}

/* btn加入呼吸效果  */
.ani {
  -webkit-animation: blink 2s infinite ease-in-out;
}

@-webkit-keyframes blink {
  0% {
    box-shadow: 0px 0px 10px rgb(243, 196, 40);
  }

  50% {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
    border-width: 0;
  }

  100% {
    box-shadow: 0px 0px 10px rgb(243, 196, 40);
  }
}
</style>
