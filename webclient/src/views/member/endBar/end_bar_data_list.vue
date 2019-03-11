<template>
  <div
    id="end_bar_div"
    class="col-md-8 card-columns"
    @mouseleave="mouseleave"
    v-show="end_bar_show"
  >
    <div class="card bg-secondary col-md-12 ">
      <div class="card-header card-my-end-header text-white">台风编号{{target_typhoon.code}}</div>
      <div class="card-body card-my-end-body">
        <div class="row">
          <div class="col">
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(item,index) in date_list"
                :key="index"
                @click="onClick(item)"
              >
                {{item|formatDate}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <endData v-show="is_show"></endData>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DataList_Mid_Model } from "../../../middle_model/common";
// import endDataList from "@/views/member/endBar/end_data_list.vue";
import endDataList from "../endBar/end_data_list.vue";
@Component({
  components: { endData: endDataList },
  filters: {
    formatDate(date: Date): String {
      return date.toDateString();
    }
  },
  props: {
    target_typhoon: DataList_Mid_Model, // 由二级菜单传入的选中的台风
    code: String,
    end_bar_show: Boolean // 显示末级bar
    // is_show: Boolean
  }
})
// @Component({
//   components: {
//     endDataList
//   }
// })
// @Component({
//   components: { endDataList }
// })
// @Component({})
export default class end_bar_data_list extends Vue {
  date_list: Date[] = [
    new Date(2019, 2, 18),
    new Date(2019, 2, 19),
    new Date(2019, 2, 20)
  ]; // 加载的时间列表
  is_show: boolean = false; // 是否显示底部的 data_list 组件
  end_bar_show: boolean = this.end_bar_show; //是否显示整个组件
  loadDateList(target_typhoon: DataList_Mid_Model): void {
    // 1 后台请求加载当前的date_list
  }
  // 鼠标移开本组件时，不再显示本组件以及data_list 子组件（子组件的显示开关其实可去掉）
  mouseleave(): void {
    // alert("鼠标移出");
    this.is_show = false;
    this.end_bar_show = false;
  }
  // 点击时间list后显示data_list 子组件，并加载数据
  onClick(obj: DataList_Mid_Model): void {
    this.is_show = true;
    // 后台请求数据
    this.loadDateList(obj);
  }
}
</script>

<style scoped>
#end_bar_div {
  /* display: flex;
  flex-direction: column; */
  /* top: 0px; */
  /* margin-left: 460px; */
  /* background: rgb(166, 187, 187); */
  /* bottom: 12px; */
  display: -webkit-box;
  z-index: 1999;
}

.list-group-item {
  color: black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  /* 0.5s动画过渡的时间 */
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 自定义的末级菜单样式 */
.card-my-end-header {
  background: linear-gradient(to right, #07ae81 30%, rgba(8, 189, 126, 0.639));
}

.card-my-end-body {
  background: linear-gradient(to right, #07ae81 30%, rgba(8, 189, 126, 0.639));
}
</style>
