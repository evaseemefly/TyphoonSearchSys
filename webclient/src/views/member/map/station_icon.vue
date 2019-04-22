<template>
  <div id="main">
    <l-icon :options="icon_div_station_option">
      <div id="station_form" v-show="is_show" class="fade_enter">
        <table class="table table-bordered" border="1">
          <tr>
            <td class="station_name" rowspan="2">{{station.name}}</td>
            <td class="surge">{{station.ws}}</td>
            <td class="surge">{{station.wd}}</td>
          </tr>
          <tr>
            <td class="tide">{{station.ybg}}</td>
            <td class="tide">{{station.bx}}</td>
          </tr>
        </table>
      </div>
      <div id="station_detail" v-show="is_show_detial" class="card box-shadow">
        <div class="card-header">{{station.name+index}}</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">时间</div>
            <div class="col-md-8">{{station.date|formatDate}}</div>
          </div>
          <div class="row">
            <div class="col-md-4">风向</div>
            <div class="col-md-8">{{station.wd}}</div>
          </div>
          <div class="row">
            <div class="col-md-4">波向</div>
            <div class="col-md-8">{{station.bx}}</div>
          </div>
          <div class="row row_footer">
            <div class="typhoon_footer">
              <div class="columnar">
                <div class="subitem_top">{{station.ws}}</div>
                <div class="subitem_foot">风向</div>
              </div>
              <div class="columnar">
                <div class="subitem_top">{{station.ybg}}</div>
                <div class="subitem_foot">有效波高</div>
              </div>
              <div class="columnar">
                <div class="subitem_top">{{station.tide}}</div>
                <div class="subitem_foot">潮位</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </l-icon>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model
} from "@/middle_model/typhoon.ts";

import { LIcon } from "vue2-leaflet";

@Component({
  components: { "l-icon": LIcon },
  props: {
    // 防止海洋站偏移
    icon_div_station_option: Object,
    // 当前的海洋站
    station: TideRealData_Mid_Model,
    // 是否显示
    is_show: Boolean,
    // 是否显示海洋站详细信息
    is_show_detial: Boolean,
    index: Number
  }
})
export default class right_bar extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = "Hello!";
  menu_index: number = 0;
  is_show_condition_bar: boolean = false;
  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }
}
</script>

<style scoped>
</style>
