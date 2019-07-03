<template src="./map_range/map.html"></template>

<script lang="ts">
// 引入fecha
import fecha from "fecha";

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  loadTyphoonList,
  ITyphoonParams,
  loadTyphoonRealData,
  ITyphoonRealDataParamas,
  loadStationTideDataList,
  ITyphoonRealBaseParams
} from "@/api/api.ts";

import {
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model,
  StationData_Mid_Model,
  EchartsScatterStationData_Mid_Model
} from "@/middle_model/typhoon.ts";

// 子组件
// 底图子组件
import MapBase from "@/views/content/map_base/map_base.vue";
// 底部rangeslider
import RangeSlider from "@/views/member/slider/rangeSlider.vue";
// 台风列表
import TyphoonList from "@/views/member/secondBar/typhoonListBar.vue";
// 海洋站icon
import StationIcon from "@/views/member/map/station_icon.vue";
import TextForm from "@/views/member/form/text_form.vue";
import ModalDetail from "@/views/member/modal/modal_detail.vue";
// 引入公共的枚举
import { TyphoonCircleStatus } from "@/common/Status.ts";
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";
// 引入枚举
import { AlarmLevel } from "@/common/enum/map.ts";

// 引入数据格式规范接口
import {
  IStation,
  IForecast,
  IEchartsScatterData
} from "@/interface/map/map.ts";

// TODO:[*] 19-05-05 使用mixin的方式拓展的data
import MapRangeDataMixin from "./map_range/map_data_mixin";
import MapRangeVuexMixin from "./map_range/map_vuex_mixin";
import MapTestMixin from "./map_range/map_test_mixin";
import MapCommonMixin from "./map_common/map_common_mixin";
// import "leaflet-tilelayer-mbtiles-ts";
// import "leaflet-tilelayer-mbtiles";

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
import { DivIcon, DivIconOptions } from "leaflet";

//  19-04-18 引入ehcarts以及leaflet-echarts——此插件无法加载，暂时放弃
// 此处不再使用
// import "echarts-leaflet/dist/echarts-leaflet";
// 使用 https://github.com/wandergis/leaflet-echarts
// import "leaflet-echarts";
// import "leaflet-echarts/dist/leaflet-echarts.js";
// import echarts from "echarts/lib/echarts";
// import "echarts/lib/chart/scatter";
// import "echarts/lib/chart/effectScatter";

// 19-04-18尝试使用超图的开源iclent插件
import { tiledMapLayer, echartsLayer } from "@supermap/iclient-leaflet";

import fechaObj from "fecha";
import { mixins } from "vue-class-component";
@Component({
  components: {
    "l-marker": LMarker,
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-polyline": LPolyline,
    "l-circle": LCircle,
    "l-icon": LIcon,
    MapBase,
    RangeSlider, // 范围range子组件
    TyphoonList, // 台风列表子组件
    ModalDetail, //modal子组件
    TextForm // 右侧的加载灾情信息的文本框
    // StationIcon
  }
})
export default class center_map_range extends mixins(
  MapRangeDataMixin,
  MapRangeVuexMixin
  // MapBaseDataMixin
  // MapTestMixin,
  // MapCommonMixin
) {
  // [-] 19-03-21 由子组件触发的根据lat,lon,range从后台获取typhoonlist的方法
  loadTyphoonListByRange(pageInfo): void {
    var myself = this;
    var range: number = this.range;
    let child = this.$refs.mybasemap;
    var latlon: number[] = child.targetMarkerLatlon;
    // TODO:[*] 19-05-13 分页写在此组件中，实际是为typhoonList 子组件传递to与from
    if (myself.typhoonCodeDataTotal < 0) {
      this.typhoonCodePageIndex = 0;
    }
    var size = this.typhoonCodePageSize;
    var index = this.typhoonCodePageIndex;
    var obj: ITyphoonParams = {
      latlon: latlon,
      range: range,
      size: size,
      index: index
      // to: to
    };
    loadTyphoonList(obj).then(res => {
      if (res.status === 200) {
        var data: any = res.data.list;
        myself.typhoonCodeDataTotal = res.data.total;
        myself.is_show_typhoon_list = false;
        myself.typhoon_code_list = [];
        // data中为台风列表
        data.forEach(obj => {
          myself.typhoon_code_list.push(
            new DataList_Mid_Model(obj.code, -1, obj.code, obj.year, obj.num)
          );
        });
        myself.is_show_typhoon_list = true;
      }
    });
  }

  // 由子组件触发的修改当前page index的方法
  setCurrentIndex(val: number) {
    this.typhoonCodePageIndex = val;
  }

  @Watch("typhoonCodePageIndex")
  onTyphoonCodePageIndex(val: number) {
    this.loadTyphoonListByRange(val);
  }
  stationTemp: IStation = null;
  @Watch("targetStation")
  onTargetStation(val: IStation) {
    this.stationTemp = val;
  }
}
</script>


<style>
/* <style src="./map_range/map.css"> */
</style>
