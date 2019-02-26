<template>
  <div id="end_bar_div">
    <div>
      <ul>
        <!-- 时间列表 -->
        <li
          v-for="(item, index) in date_list"
          :key="index"
        >
          {{item|formatDate}}</li>
      </ul>
    </div>
    <div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DataList_Mid_Model } from "../../../middle_model/common";
// import { DataList_Mid_Model } from "@/middle_model/common";
@Component({
  props: {
    target_typhoon: DataList_Mid_Model // 由二级菜单传入的选中的台风
  }
})
@Component({
  filters: {
    formatDate(date: Date): String {
      return date.toDateString();
    }
  }
})
export default class end_bar_data_list extends Vue {
  date_list: Date[] = [
    new Date(2019, 2, 18),
    new Date(2019, 2, 19),
    new Date(2019, 2, 20)
  ]; // 加载的时间列表
  loadDateList(target_typhoon: DataList_Mid_Model): void {
    // 1 后台请求加载当前的date_list
  }
}
</script>

<style>
#end_bar_div {
  position: absolute;
  top: 0px;
  margin-left: 460px;
  background: rgb(166, 187, 187);
  bottom: 12px;
}
</style>
