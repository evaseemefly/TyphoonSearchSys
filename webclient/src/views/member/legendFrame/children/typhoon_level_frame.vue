<template>
  <div id="level_frame">
    <transition name="fade">
      <button type="button" v-show="!isShow" @click="isShow=!isShow" class="btn btn-info ani">
        展开图例 
        <i class="fa fa-plus-square icon-white" aria-hidden="true"></i>
      </button>
    </transition>
    <transition name="fade">
      <div v-show="isShow" id="frame" class="card mt-10">
        <div class="card-header card-my-header">
          台风级别
          <i
            class="fa fa-minus-circle icon-white corner-mark"
            aria-hidden="true"
            @click="isShow=!isShow"
          ></i>
        </div>
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
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// 台风登记图例
@Component
export default class typhoonLevelFrame extends Vue {
  isShow:boolean=true
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
#level_frame {
  position: absolute;
  bottom: 100px;
  right: 50px;
  z-index: 1500;
}
/* #frame {
  position: absolute;
  bottom: 100px;
  right: 50px;
  z-index: 1500;
} */
#frame .frame-body {
  background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639));
  border-radius: 0.25rem;
}
.corner-mark {
  float: right;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}
</style>
