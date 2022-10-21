<template>
  <!-- <div class="card bg-secondary card-my-end col-md-12 text-white"> -->
  <div class="card col-md-12 text-white">
    <div class="card-header card-my-end">
      观测数据
    </div>
    <div class="card-body card-my-end">
      <table class="table text-white table-my-typhoon">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">当前时间</th>
            <th scope="col">气压</th>
            <th scope="col">最大风速</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>2019-02-27</td>
            <td>1002.2</td>
            <td>3.5</td>
          </tr>

        </tbody>
      </table>
      <table class="table text-white table-my-station">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">站位</th>
            <th scope="col">波向</th>
            <th scope="col">有效波高</th>
            <th scope="col">潮位</th>
            <th scope="col">风速</th>
            <th scope="col">风向</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>福鼎</td>
            <td>35</td>
            <td>2.5</td>
            <td>1.7</td>
            <td>5.2</td>
            <td>120</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>平潭</td>
            <td>35</td>
            <td>2.5</td>
            <td>1.7</td>
            <td>5.2</td>
            <td>120</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import {
  TyphoonData_Mid_Model,
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model
} from "../../../middle_model/typhoon";

@Component({
  props: {
    target_date: Date, //由父组件传入的选中的时间
    code: String //由父组件传入的选择的台风
  }
})
export default class end_data_list extends Vue {
  typhoon_data: TyphoonData_Mid_Model[] = [];
  //根据时间以及台风编号获取指定台风在指定时间其观测值
  loadTargeDateData(target_date: Date, code: String): void {
    // 此处先录入假数据
    var date_temp = new Date();
    this.typhoon_data.push(
      new TyphoonData_Mid_Model(
        new MeteorologyRealData_Mid_Model(
          "ty_a",
          "5601",
          date_temp,
          [20.5, 112.2],
          1002.3,
          6
        ),
        new TideRealData_Mid_Model(
          "天竺",
          "ty_a",
          [20.5, 112.2],
          date_temp,
          10.2,
          90,
          2.3,
          2.5,
          5.6,
          ""
        )
      )
    );
  }
}
</script>

<style scoped>
.card-my-end {
  background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.639));
  font-size: 90%;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}
.card-my-end-body {
  background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639));
  padding: 8px 8px 8px 8px;
}
.table-my-typhoon {
  background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.639));
}
.table-my-typhoon th {
  font-size: 85%;
  color: rgb(255, 196, 0);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 400;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}

.table-my-typhoon td {
  font-size: 85%;
  color: rgb(255, 255, 255);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 400;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}
.table-my-station {
  background: linear-gradient(to right, #328a87 30%, rgba(47, 113, 118, 0.639));
}
.table-my-station th {
  font-size: 85%;
  color: rgb(255, 196, 0);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 400;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}

.table-my-station td {
  font-size: 95%;
  color: rgb(255, 255, 255);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 500;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}
.table-my-station tr:hover {
  font-size: 105%;
  color: rgb(255, 255, 255);
  background: rgba(111, 238, 204, 0.557);
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}
</style>
