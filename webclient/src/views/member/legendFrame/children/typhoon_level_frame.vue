<template>
  <!-- <div id="frame">
        <div class="frameHeader">台风级别</div>
        <div class="frameBody">
            <div>热带低压 <10 ms</div>
            <div>热带风暴 <20 ms</div>
        </div>
  </div>-->
  <div id="frame" class="card mt-10">
    <div class="card-header card-my-header">台风级别</div>
    <div class="card-body card-my-body frame-body">
      <!-- <div v-for="item in typhoonLevel">
                {{item.name}} <{{item.val}} ms
      </div>-->
      <div>热带低压 10.8-17.1</div>
      <div>热带风暴 17.2-24.4</div>
      <div>强热带风暴 24.5-32.6</div>
      <div>台风 32.7-41.4</div>
      <div>强台风 41.5-50.9</div>
      <div>超强台风 >=51.0</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// 台风登记图例
@Component
export default class typhoonLevelFrame extends Vue {
  // typhoonLevel:any=[{val:'10',name:'热带低压'},
  //             {val:'10',name:'热带低压'},
  //             {val:'10',name:'热带低压'}
  //             {val:'10',name:'热带低压'}];
  // typhoonLevel:any=[];
  mounted() {
    // this.typhoonLevel=[{val:'10',name:'热带低压'},
    //         {val:'10',name:'热带低压'},
    //         {val:'10',name:'热带低压'}
    //         {val:'10',name:'热带低压'}]
  }
}
</script>

<style scoped>
/* 台风图例的样式 */
#frame {
  position: absolute;
  bottom: 100px;
  /* left: 50px; */
  right: 50px;
  z-index: 1500;
  /* ceshikabuka */
  /* ceshikabuka */
  /* 测试测试 */
  /* ceshiceshi */
  /* maosibutaikale */
}
#frame .frame-body {
  background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639));
  border-radius: 0.25rem;
}
</style>
