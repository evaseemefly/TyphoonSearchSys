<template>
  <div
    id="realtime-base"
    class="col-md-3"
  >
    <div class="total-header">
      <div class="sort col-md-2">03</div>
      <div class="title col-md-10">实测数据</div>
    </div>
    <div class="realtime-body">
      <div class="detail">
        <div class="title">极值详情</div>
        <div class="list">
          <table rules=rows>
            <tr>
              <th>名称</th>
              <th>最大增水</th>
              <th>出现时间</th>
            </tr>
            <tr>
              <td>汕头</td>
              <td>2.9</td>
              <td>1950 02-19 14:00</td>
            </tr>
            <tr>
              <td>汕头</td>
              <td>2.9</td>
              <td>1950 02-19 14:00</td>
            </tr>
            <tr>
              <td>汕头</td>
              <td>2.9</td>
              <td>1950 02-19 14:00</td>
            </tr>
            <tr>
              <td>汕头</td>
              <td>2.9</td>
              <td>1950 02-19 14:00</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
// export default class SearchByStationMenu_Stations extends Vue {
export default class rightBarRealData extends Vue {}
</script>

<style scoped>
#realtime-base {
  position: fixed;
  top: 620px;
  right: 20px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    to right,
    #c6cad5 30%,
    rgba(176, 191, 211, 0.639)
  );
  font-size: 90%;
  padding: 0px;
  padding-bottom: 15px;
  /*text-shadow: 2px 2px 8px rgb(33, 32, 32);*/
  border-top-left-radius: 15px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 2px 2px 10px rgb(109, 96, 96);
}
#realtime-base .total-header {
  display: flex;
  color: black !important;
  text-shadow: -1px 1px -5px rgb(33, 32, 32) !important;
}
#realtime-base .total-header .sort {
  display: flex;
  flex: 1;
  background: rgba(10, 10, 167, 0.653);
  color: white;
  font-size: 120%;
  font-weight: 800;
  border-top-left-radius: 15px;
  text-shadow: -1px 1px -5px rgb(33, 32, 32) !important;
}
#realtime-base .total-header .title {
  display: flex;
  flex: 10;
  text-shadow: -1px 1px -5px rgb(33, 32, 32) !important;
  color: rgb(0, 0, 0);
  font-size: 110%;
  font-weight: 800;
}

#realtime-base .realtime-body {
  display: flex;
  flex-direction: column;
  padding: 5px;
}

#realtime-base .realtime-body .detail {
  display: flex;
  flex-direction: column;
  flex: 10;
  margin-left: 10px;
}

#realtime-base .realtime-body .detail .title {
  display: flex;
  flex-direction: column;
  text-align: left;
  color: rgb(238, 236, 152);
  text-shadow: 1px 1px 5px rgb(1, 1, 1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 110%;
  font-weight: 800;
}
#realtime-base .realtime-body .list {
  padding: 10px;
}
#realtime-base .realtime-body table {
  width: 90%;
}

#realtime-base .realtime-body th {
  font-size: 85%;
  color: rgb(249, 209, 68);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 600;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}

#realtime-base .realtime-body .list tr {
}

#realtime-base .realtime-body .list td {
  font-size: 85%;
  color: rgb(41, 77, 130);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 600;
  /* text-shadow: 1px 0px 1px rgb(33, 32, 32); */
}
.u-lof2 {
  flex: 1;
  /* background: rgba(0, 128, 0, 0.42); */
}
</style>
