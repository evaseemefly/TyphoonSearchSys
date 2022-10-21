<template>
  <form class="form-horizontal">
    <div class="col-sm-12">
      <div class="panel panel-default boxshadow">
        <div class="panel-heading">潮位站信息</div>
        <div class="panel-body table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <th>测站名称</th>
              <th>风暴增水极值</th>
              <th>对应时间</th>
              <!-- <th>吨位</th> -->
            </thead>
            <tbody>
              <tr>
                <td>{{stationName}}</td>
                <td>{{maxVal}}</td>
                <td>{{maxDate|formatDate}}</td>
                <!-- <td class="my-th-warm">{{ton}}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// 引入fecha
import fecha from "fecha";

@Component({
  props: {
    stationName: String,
    maxVal: Number,
    maxDate: Date
  },
  filters: {
    //  时间格式化
    formatDate(date: Date): String {
      var str_format = fecha.format(date, "YY-MM-DD HH:mm:ss");
      return str_format;
    }
  }
})
export default class detail_tab extends Vue {}
</script>

<style scoped>
.my-th-normal {
  color: #4154de;
}
.table {
  border: 0px;
  color: aliceblue;
}
.table th {
  color: blanchedalmond;
}
.my-th-warm {
  color: rgba(255, 0, 0, 0.838);
}
/* 带一个阴影 */
.boxshadow {
  box-shadow: 2px 2px 10px grey;
}
/* 顶部字体加粗加大 */
.panel-heading {
  font-weight: bolder;
  font-size: large;
}
</style>
