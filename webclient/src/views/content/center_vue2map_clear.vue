<template>
  <div id="mycontent">
    <l-map
      style="height: 100%; width: 600px"
      :zoom="zoom"
      :center="center"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-polyline
        :lat-lngs="polyline.latlngs"
        :color="polyline.color"
        :fill=false
      >
      </l-polyline>
      <l-circle
        v-for="latlng in polyline.latlngs"
        :key=latlng.id
        :lat-lng="latlng"
        :radius=3
      />
    </l-map>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model
} from "@/middle_model/typhoon.ts";

// 引入公共的枚举
import { TyphoonCircleStatus } from "@/common/Status.ts";

// import "leaflet-tilelayer-mbtiles-ts";
// import "leaflet-tilelayer-mbtiles";

import "leaflet";
import "Leaflet.TileLayer.MBTiles";
import L, { LatLng } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LPolyline,
  LCircle
} from "vue2-leaflet";
import { DivIcon, DivIconOptions } from "leaflet";
// 需要引入leaflet的样式
import "leaflet/dist/leaflet.css";

@Component({
  components: {
    "l-marker": LMarker,
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-polyline": LPolyline,
    "l-circle": LCircle
  }
})
export default class center_vue2map_clear extends Vue {
  zoom = 8;
  url: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
  center = [47.41322, -1.319482];
  markerLatLng = [47.31322, -1.319482];
  polyline = {
    latlngs: [
      [47.334852, -1.509485],
      [47.342596, -1.328731],
      [47.241487, -1.190568],
      [47.234787, -1.358337]
    ],
    color: "red"
  };
}
</script>

<style scoped>
#mycontent {
  /* position: absolute; */
  /* top: 188px; */
  /* height: 600px; */

  /* bottom: 0px; */
  height: 600px;
  width: 600px;
  overflow: hidden;
}
</style>