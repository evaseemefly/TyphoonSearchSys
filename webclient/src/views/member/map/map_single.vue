<template>
  <div v-if="isShow" id="singlecontent">
    <l-map :zoom="zoom" :center="center">
      <!-- <l-map
      ref="basemap"
      :zoom="zoom"
      :center="center"
      >-->
      <l-tile-layer :url="url"></l-tile-layer>
      <!-- 台风路径 -->
      <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color" :fill="false"></l-polyline>
      <!-- 台风中心的圆点 -->
      <l-circle
        v-for="typhoon in typhoon_realdata_list"
        :key="typhoon.id"
        :lat-lng="typhoon.latlon"
        :color="typhoon.getColor()"
        :weight="typhoon.getWeight()"
      />
    </l-map>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";

// 引入leaflet的相关依赖

// 解决默认icon找不到的问题
import "leaflet/dist/leaflet.css";
// 需要引入leaflet的样式
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet";
import "Leaflet.TileLayer.MBTiles";
import "leaflet-defaulticon-compatibility";
import L, { LatLng } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LPolyline,
  LCircle,
  LIcon
} from "vue2-leaflet";

// ------
import { MeteorologyRealData_Mid_Model } from "@/middle_model/typhoon.ts";

// 与后台交互的api
// 与后台交互的api
import { loadTyphoonRealData, ITyphoonRealDataParamas } from "@/api/api.ts";
// 缩小的map
@Component({
  components: {
    "l-marker": LMarker,
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-polyline": LPolyline,
    "l-circle": LCircle,
    "l-icon": LIcon
  },
  // 自定义过滤器
  filters: {
    //  时间格式化
    formatDate(date: Date): String {
      // var str_format = fecha.format(date, "YY-MM-DD HH:mm:ss");
      // return str_format;
      return null;
    },
    // TODO: [*] 19-04-13 对于type 为point的过滤器，还需要加入一个对于类型的判断
    formatPoint(point: any): Array<number> {
      var temp = point.coordinates;
      var latlon = [temp[1].toString(), temp[0].toString()];
      return latlon;
    }
  }
})
export default class map_base extends mixins() {
  polyline: any = {
    latlngs: [],
    color: "yellow"
  };
  typhoon_realdata_list: Array<MeteorologyRealData_Mid_Model> = []; // 台风气象实时数据列表
  zoom: number = 4;
  center: any = [17.6, 131.6];
  url: string =
    "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}";
  isShow: boolean = false;
  initMap(): void {}
  mounted() {
    // this.initMap();
    this.isShow = true;
  }

  get searchNum(): string {
    return this.$store.state.map.searchNum;
  }

  get isStaticEchartsShow(): boolean {
    return this.$store.state.chart.isStaticEchartsShow;
  }

  @Watch("searchNum")
  onSearchNum(val: string) {
    // console.log(val);
    var myself = this;
    var par = {
      code: val,
      num: val
    };
    loadTyphoonRealData(par).then(res => {
      // console.log(res.data);
      if (res.status === 200) {
        //记得每次需要清空
        myself.typhoon_realdata_list = [];
        myself.polyline.latlngs = [];
        res.data.map(temp => {
          var date_str = temp.date;
          myself.typhoon_realdata_list.push(
            new MeteorologyRealData_Mid_Model(
              temp.code,
              temp.num,
              new Date(date_str),
              [temp.latlon.coordinates[1], temp.latlon.coordinates[0]],
              temp.bp,
              temp.wsm
            )
          );
          myself.polyline.latlngs.push([
            temp.latlon.coordinates[1],
            temp.latlon.coordinates[0]
          ]);
        });
      }
    });
  }
  @Watch("isStaticEchartsShow")
  onIsStaticEchartsShow(val: boolean) {
    this.isShow = val;
  }
}
</script>

<style scoped>
#singlecontent {
  flex: 8;
  position: relative;
  height: 100%;
  /* height: 600px; */
}
</style>
