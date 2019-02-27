<template>
  <div
    id="end_bar_div"
    class="col-md-6 card-group"
  >
    <div class="card bg-info">
      <div class="card-header">指定台风名称</div>
      <div class="card-body">
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
    <endDataList></endDataList>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DataList_Mid_Model } from "../../../middle_model/common";
import endDataList from "../endBar/end_data_list.vue";

@Component({
  components: { endDataList },
  filters: {
    formatDate(date: Date): String {
      return date.toDateString();
    }
  }
})
// @Component({
//   filters: {
//     formatDate(date: Date): String {
//       return date.toDateString();
//     }
//   }
// })
export default class end_bar_test extends Vue {
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
</style>
