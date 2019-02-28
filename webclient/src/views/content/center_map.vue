<template>
  <div id="mycontent">
    <div id="basemap"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MeteorologyRealData_Mid_Model } from "@/middle_model/typhoon.ts";

import "leaflet";
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

// 需要引入leaflet的样式
import "leaflet/dist/leaflet.css";

@Component({})
export default class center_map extends Vue {
  typhoon_data: MeteorologyRealData_Mid_Model[];
  mymap: any;
  // 根据指定时间及code查询对应台风的实时数据
  loadTyphoonData(targetdate: Date, code: String): void {}

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
  }

  //将typhoon_data 加载值地图中
  loadTyphoonLine(): void {}

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
