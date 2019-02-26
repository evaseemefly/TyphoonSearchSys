<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Username</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Larry</td>
          <td>the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table>

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
          5.6
        )
      )
    );
  }
}
</script>

<style>
</style>
