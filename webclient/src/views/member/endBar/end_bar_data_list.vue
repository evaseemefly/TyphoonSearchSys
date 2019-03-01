<template>
  <div id="end_bar_div" class="col-md-6 card-group">
    <div class="card bg-info col-md-12">
      <div class="card-header">台风编号{{target_typhoon.code}}</div>
      <div class="card-body">
        <div class="row">
          <div class="col">
            <ul class="list-group">
              <li class="list-group-item-sm" v-for="(item,index) in date_list" :key="index" @click="onClick(item)">
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
    code: String
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
  is_show: boolean = false;
  loadDateList(target_typhoon: DataList_Mid_Model): void {
    // 1 后台请求加载当前的date_list
  }
  onClick(obj: DataList_Mid_Model): void {
    this.is_show = true;
  }
}
</script>

<style>
#end_bar_div {
  /* position: absolute; */
  display: flex;
  flex-direction: column;
  top: 0px;
  /* margin-left: 460px; */
  /* background: rgb(166, 187, 187); */
  bottom: 12px;
}
</style>
