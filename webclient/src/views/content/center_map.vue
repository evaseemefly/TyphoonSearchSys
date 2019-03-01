<template>
  <div id="mycontent">
    <div id="basemap"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MeteorologyRealData_Mid_Model } from "@/middle_model/typhoon.ts";

import "leaflet";
import L, { LatLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

// 需要引入leaflet的样式
import "leaflet/dist/leaflet.css";

@Component({})
export default class center_map extends Vue {
  typhoon_data: MeteorologyRealData_Mid_Model[];
  mymap: any;
  latlons: Array<LatLng> = []; // 经纬度的数组(数组嵌套数组)
  typhoon_list: Array<MeteorologyRealData_Mid_Model> = [];

  // 根据指定时间及code查询对应台风的实时数据
  loadTyphoonData(targetdate: Date, code: String): void {}
  // latlons: Array<number[]> = []; // 经纬度的数组(数组嵌套数组)
  // 初始化map
  initMap(): void {
    var myself = this;
    if (myself.mymap == null) {
      myself.mymap = L.map("basemap").setView([30.09, 127.75], 4);
      // var mymap = L.map('basemap').setView([51.505, -0.09], 13)
      // mapLink = "../static/mapfiles/";

      // var mapfilesPath = '../../../mapfiles/{z}/{x}/{y}.jpg'
      var mapfilesPath = "/mapfiles/{z}/{x}/{y}.jpg";
      L.tileLayer(mapfilesPath, {
        attribution: "",
        maxZoom: 8,
        minZoom: 2
      }).addTo(myself.mymap);
      this.$emit("update:basemap", myself.mymap);
    }

    // 暂时将读取台风路径写在此处
    this.loadTyphoonLine();
    this.loadTyphoonPoint();
  }

  // 将typhoon_list 加载值地图中
  loadTyphoonLine(): void {
    var myself = this;
    // 1 从后台读取台风路径信息
    // 此处只做模拟
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [30.09, 127.75],
        1001.2,
        4.5
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [31.1, 128.2],
        1001.2,
        4.5
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [31.98, 126.75],
        1001.2,
        4.5
      )
    );

    //2 将当前的typhoon_data中获取latlongs
    this.typhoon_list.map(temp => {
      myself.latlons.push(new LatLng(temp.latlon[0], temp.latlon[1]));
    });

    //3 获取了经纬度数组之后，需要在地图上画线
    // var temp = new LatLng();
    var polyline = L.polyline(myself.latlons, { color: "red" }).addTo(
      myself.mymap
    );
  }

  // 将typhoon_list 的点加载至地图中
  loadTyphoonPoint(): void {
    var myself = this;
    // var points = L.point(myself.latlongs);
    var point = L.circle(myself.latlons[0], { color: "blue" }).addTo(
      myself.mymap
    );
  }
  mounted() {
    this.initMap();
  }
}
</script>

<style>
#mycontent {
  /* position: absolute; */
  /* top: 188px; */
  /* height: 600px; */

  /* bottom: 0px; */
  height: 100%;
  width: 100%;
  overflow: hidden;
}
#basemap {
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
