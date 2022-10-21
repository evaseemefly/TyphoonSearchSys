<template>
  <div
    id="disaster-base"
    class="col-md-3"
  >
    <div class="total-header">
      <div class="sort col-md-2">02</div>
      <div class="title col-md-10">灾情报告</div>
    </div>
    <div class="disaster-body">
      <div class="detail">
        <div class="died-info u-lof2">
          <div class="title">死亡人数</div>
          <div class="data my-font-contrast">54</div>
        </div>
        <div class="disaster">
          <div class="disaster-info">损坏船舶:<span>xx艘</span></div>
          <div class="disaster-info">受淹农田:<span>x亩</span></div>
          <div class="disaster-info">损坏房屋:<span>xx间</span></div>
        </div>
        <div class="disaster-list">
          <div class="title">受影响省份</div>
          <div class="list">
            <table rules=rows>
              <tr>
                <th>名称</th>
                <th>死亡人数</th>
                <th>损坏船舶</th>
                <th>受淹农田</th>
                <th>损坏房屋</th>
                <th>经济损失</th>
              </tr>
              <tr>
                <td>广东省</td>
                <td>21</td>
                <td>3000</td>
                <td>2100</td>
                <td>321</td>
                <td>10</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
// export default class SearchByStationMenu_Stations extends Vue {
export default class rightBarDisaster extends Vue {}
</script>

<style scoped>
#disaster-base {
  position: fixed;
  top: 350px;
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
#disaster-base .total-header {
  display: flex;
  color: black !important;
  text-shadow: -1px 1px -5px rgb(33, 32, 32) !important;
}
#disaster-base .total-header .sort {
  display: flex;
  flex: 1;
  background: rgba(10, 10, 167, 0.653);
  color: white;
  font-size: 120%;
  font-weight: 800;
  border-top-left-radius: 15px;
  text-shadow: -1px 1px -5px rgb(33, 32, 32) !important;
}
#disaster-base .total-header .title {
  display: flex;
  flex: 10;
  text-shadow: -1px 1px -5px rgb(33, 32, 32) !important;
  color: rgb(0, 0, 0);
  font-size: 110%;
  font-weight: 800;
}

#disaster-base .disaster-body {
  display: flex;
  flex-direction: column;
  padding: 5px;
}

#disaster-base .disaster-body .detail {
  display: flex;
  flex-direction: column;
}

#disaster-base .disaster-body .detail .title {
  display: flex;
  flex-direction: column;
  text-align: left;
  color: rgb(238, 236, 152);
  text-shadow: 1px 1px 5px rgb(0, 0, 0);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 110%;
  font-weight: 800;
}

/*死亡数字*/
#disaster-base .disaster-body .detail .data {
  display: flex;
  flex-direction: column;
  text-align: center;
  color: rgba(193, 23, 23, 0.872);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 110%;
  font-weight: 800;
}

#disaster-base .disaster-body .disaster {
  display: flex;
  flex-direction: row;
}
#disaster-base .disaster-body .disaster .disaster-info {
  display: flex;
  flex-direction: row;
  flex: 3;
  padding: 5px;
  text-align: center;
  color: rgb(113, 111, 109);
  font-family: "Courier New", Courier, monospace;
  font-size: 90%;
}

#disaster-base .disaster-body .disaster .disaster-info span {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue";
  color: rgb(60, 177, 113);
  text-shadow: 0px 0px 2px rgb(24, 24, 24);
  font-size: 130%;
  font-weight: 800;
  margin-left: 10px;
}

#disaster-base .disaster-body .disaster-list {
  display: flex;
  flex-direction: column;
}

#disaster-base .disaster-body .disaster-list table {
  table-layout: fixed;
}

#disaster-base .disaster-body th {
  font-size: 85%;
  color: rgb(113, 111, 109);
  padding-top: 8px;
  padding-bottom: 8px;
  font-family: "Courier New", Courier, monospace;
  font-size: 90%;
}

#disaster-base .disaster-body .disaster-list td {
  font-size: 85%;
  color: rgb(41, 77, 130);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 600;
  /* text-shadow: 2px 2px 8px rgb(33, 32, 32); */
}
.u-lof2 {
  flex: 1;
  /* background: rgba(0, 128, 0, 0.42); */
}
</style>
