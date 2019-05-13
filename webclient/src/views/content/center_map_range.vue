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
    RangeSlider, // 范围range子组件
    TyphoonList, // 台风列表子组件
    ModalDetail, //modal子组件
    TextForm // 右侧的加载灾情信息的文本框
    // StationIcon
  },
  // 自定义过滤器
  filters: {
    //  时间格式化
    formatDate(date: Date): String {
      var str_format = fecha.format(date, "YY-MM-DD HH:mm:ss");
      return str_format;
    },
    // TODO: [*] 19-04-13 对于type 为point的过滤器，还需要加入一个对于类型的判断
    formatPoint(point: any): Array<number> {
      var temp = point.coordinates;
      var latlon = [temp[1].toString(), temp[0].toString()];
      return latlon;
    }
  }

  // @Mutation()
})
export default class center_map_range extends mixins(
  MapRangeDataMixin,
  MapRangeVuexMixin,
  MapTestMixin,
  MapCommonMixin
) {
  convertData(data: any): any {
    var myself = this;
    var res = [];
    for (var i = 0; i < myself.data_echarts.length; i++) {
      var geoCoord = myself.geoCoordMap[myself.data_echarts[i].name];
      if (geoCoord) {
        res.push({
          name: myself.data_echarts[i].name,
          value: geoCoord.concat(myself.data_echarts[i].value)
        });
      }
    }
    return res;
  }
  // TODO: [*] 准备去掉！将typhoon_list 加载值地图中
  loadTyphoonLine(): void {
    var myself = this;
    /*
              使用以下第一种方式会提示出错:
                Property 'mapObject' does not exist on type 'Vue | Element | Vue[] | Element[]'.
          Property 'mapObject' does not exist on type 'Vue'.
              推荐使用方式2
            */
    //  方式1
    // var mymap: any = this.$refs.basemap.mapObject;
    // 方式2
    var mymap: any = this.$refs.basemap["mapObject"];
    // 1 从后台读取台风路径信息
    myself.loadTyphoonData();
    //2 将当前的typhoon_data中获取latlongs
    this.typhoon_list.map(temp => {
      var typhoon_status = new TyphoonCircleStatus(temp.wsm, temp.bp);
      myself.polyline.latlngs.push(temp.latlon);
      // myself.latlons.push(new LatLng(temp.latlon[0], temp.latlon[1]));
      var circle_temp = L.circle(new LatLng(temp.latlon[0], temp.latlon[1]), {
        color: typhoon_status.getColor(),
        // radius: 20
        weight: typhoon_status.getWeight()
      });
      //加入鼠标移入时的操作
      circle_temp.on("mouseover", function(e) {
        myself.addTyphoonDiv2Map(temp);
      });

      //加入鼠标移出时的操作
      circle_temp.on("mouseout", function(e) {
        myself.clearDivIcon();
      });

      //加入点击鼠标时的操作
      circle_temp.on("click", function(e) {
        myself.typhoon_temp = temp;
      });
    });
  }

  // [-] 19-03-21 由子组件触发的根据lat,lon,range从后台获取typhoonlist的方法
  loadTyphoonListByRange(pageInfo): void {
    var myself = this;
    var range: number = this.range;
    var latlon: number[] = this.targetMarkerLatlon;
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
        var data: any = res.data;
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

  // 计算圆柱体的偏移量
  iconStationCylinderAnchor(val): Array<number> {
    return [40, 10 + val * 5];
  }

  //  19-03-21 鼠标在地图上点击后，加载marker
  createMarker(event: any): void {
    // 鼠标点击地图上后，向该位置加入一个marker
    this.targetMarkerLatlon = [
      parseFloat(event.latlng.lat.toFixed(4)),
      parseFloat(event.latlng.lng.toFixed(4))
    ];
    this.is_show_typhoon_list = false;
  }

  // [-] 19-04-12 获取警报级别对应的颜色
  getStationAlarmClass(station: StationData_Mid_Model): string {
    let alarm_class = "";
    // 实测潮位 - 警戒潮位
    var abs: number = station.tide - station.jw;
    var alarm: AlarmLevel = AlarmLevel.Green;
    switch (true) {
      case abs <= -300:
        alarm = AlarmLevel.Green;
        break;
      // -30-0：蓝色
      case abs < 0 && abs >= -300:
        alarm = AlarmLevel.Blue;
        break;
      // 0-30：黄色
      case abs < 300 && abs >= 0:
        alarm = AlarmLevel.Yellow;
        break;
      // 30-80 橙色
      case abs < 800 && abs >= 300:
        alarm = AlarmLevel.Orange;
        break;
      // 80-无穷 红色
      case abs > 800:
        alarm = AlarmLevel.Red;
        break;
    }
    var class_str = AlarmLevel[alarm];
    return class_str;
    // console.log(class_str);
  }

  // TODO: [*] 最终要去掉
  loadTyphoonData(): void {
    // 此处只做模拟
    this.typhoon_realdata_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        "5601",
        new Date(),
        [17.6, 131.6],
        1001.2,
        1.5
      )
    );
  }

  // 更改当前的选中台风real model
  changeTyphoonRealBase(val): void {
    this.typhoon_temp = val;
    var typhoon_real = new TyphoonRealBase_Mid_Model(
      val.name,
      val.num,
      val.code,
      val.date
    );
    this.targetTyphoonRealBase = typhoon_real;
  }

  showTyphoonDiv(val): void {
    this.addTyphoonDiv2Map(val);
  }
  // 初始化map
  initMap(): void {
    var myself = this;
    // 暂时将读取台风路径写在此处
    this.loadTyphoonLine();
  }

  // 每次初始化地图时，清除一些数据
  initData(): void {
    this.typhoon_temp = null;
  }

  // 清除测站的divIcon
  clearStationDivs(): void {
    this.station_tide_list = [];
  }
  addTestDiv2Map(): void {
    [18.3, 119.5];
  }
  // TODO: [-] 19-04-25 改变当前选中的海洋站的编号
  /* 
    19-04-25 新加入了功能，是判断当前的点击次数，
    若大于1次，说明在同一个station div中点击了两次，则打开modal框加载后台的该station 的过程数据
  */
  changeStationIndex(index: number, station: IStation): void {
    var myself = this;
    this.index_stationdiv_click += 1;
    // console.log(station);
    if (index === myself.select_station_index) {
      myself.select_station_index = -1;
    } else {
      myself.select_station_index = index;
    }
    // 判断是否符合条件需要触发展开modal的操作
    if (myself.index_stationdiv_click > 1) {
      myself.showModal(station);
    }
  }

  // 清除当前移入的台风DivIcon
  clearTyphoonDivIcon(): void {
    var myself = this;
    var mymap: any = this.$refs.basemap["mapObject"];
    mymap.removeLayer(myself.typhoon_div_icon_temp);
    myself.typhoon_div_icon_temp = null;
  }

  // 将divicon从map中清除
  clearDivIcon(): void {
    var myself = this;
    var mymap: any = this.$refs.basemap["mapObject"];
    mymap.removeLayer(myself.typhoon_div_icon_temp);
    myself.typhoon_div_icon_temp = null;
  }

  // 向地图中添加台风的div样式
  addTyphoonDiv2Map(typhoon_temp: MeteorologyRealData_Mid_Model): void {
    var myself = this;
    var mymap: any = this.$refs.basemap["mapObject"];
    let typhoon_div_html = typhoon_temp.toHtml();

    let typhoon_div_icon = L.divIcon({
      className: "typhoon_icon_default",
      html: typhoon_div_html,
      // 坐标，[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]
      iconAnchor: [-20, 30]
    });

    // console.log(typhoon_div_icon);
    var typhoon_div_icon_target = L.marker(
      [typhoon_temp.latlon[0], typhoon_temp.latlon[1]],
      {
        icon: typhoon_div_icon
      }
    ).addTo(mymap);
    myself.typhoon_div_icon_temp = typhoon_div_icon_target;
  }

  // 暂时无人调用
  addStationDiv2Map(station_temp: TideRealData_Mid_Model): void {
    var myself = this;
    var mymap: any = this.$refs.basemap["mapObject"];
    let station_div_html = station_temp.toHtml();
    let station_div_icon = L.divIcon({
      className: "station_icon",
      html: station_div_html,
      // 坐标，[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]
      iconAnchor: [-20, 30]
    });

    // console.log(typhoon_div_icon);
    var station_div_icon_temp = L.marker(
      [station_temp.latlon[0], station_temp.latlon[1]],
      {
        icon: station_div_icon
      }
    ).addTo(mymap);
    //当移入时，需要修改该div的index
    station_div_icon_temp.on("mouseover", function(e) {
      // console.log(e);
      // console.log(station_div_icon_temp._zIndex);
      station_div_icon_temp.setZIndexOffset(19999);
    });
    station_div_icon_temp.on("mouseout", function(e) {
      // console.log(e);
      // console.log(station_div_icon_temp._zIndex);
      station_div_icon_temp.setZIndexOffset(99);
    });
    // 鼠标点击时展开div
    station_div_icon_temp.on("click", function(e) {
      /*
        鼠标点击时：
          -1 展开div
          -2 隐藏之前的div
      */
      // console.log(this);
    });
  }

  openStationDivIcon(val): void {}

  // TODO:[*] 19-04-25 显示过程曲线的mdoal框
  showModal(station: IStation): void {
    console.log(station);
    this.station_temp = station;

    // alert("被处罚");
  }
  // TODO: 19-04-12 鼠标移出 station Div时，将其index降低
  downZindex(index: number, val: any): void {
    this.select_station_index = -1;
    this.hover_station_index = -1;
    // 鼠标移出某个div时，将该div的index计数器清0
    this.index_stationdiv_click = 0;
  }

  // TODO:  鼠标移入station Div时，将其置顶
  upZIndex(index: number, val: any): void {
    this.hover_station_index = index;
  }

  // TODO: [!] （此处不要）
  // 手动向地图中添加marker（会引起icon的动态url错误的问题）——暂时不使用
  addStationDiv2Map_backup(station_temp: TideRealData_Mid_Model): void {
    var myself = this;
    var mymap: any = this.$refs.basemap["mapObject"];
    let station_div_html = station_temp.toHtml();
    let station_div_icon = L.divIcon({
      className: "station_icon",
      html: station_div_html,
      // 坐标，[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]
      iconAnchor: [-20, 30]
    });

    // console.log(typhoon_div_icon);
    var station_div_icon_temp = L.marker(
      [station_temp.latlon[0], station_temp.latlon[1]],
      {
        icon: station_div_icon
      }
    ).addTo(mymap);
    //当移入时，需要修改该div的index
    station_div_icon_temp.on("mouseover", function(e) {
      station_div_icon_temp.setZIndexOffset(19999);
    });
    station_div_icon_temp.on("mouseout", function(e) {
      station_div_icon_temp.setZIndexOffset(99);
    });
    // 鼠标点击时展开div
    station_div_icon_temp.on("click", function(e) {
      /*
        鼠标点击时：
          -1 展开div
          -2 隐藏之前的div
      */
      console.log(this);
    });
  }
  mounted() {
    this.initMap();
    // 尝试加载echarts的散点图
    // this.initCharts();
  }
  // 监听点击某一个台风div后变更的台风对象
  @Watch("typhoon_temp")
  onPythoon_temp(val: MeteorologyRealData_Mid_Model) {
    /*
        选中的台风发生变化后
        包含code,date
        根据code以及date加载该台风该时刻的台站数据
      */
    //以下为模拟的台站数据
  }

  // 监听由vuex更新的targetTyphoon（当前选择的台风）
  //更新typhoon_realdata_list以及polyline
  @Watch("targetTyphoon")
  onTargetTyphoon(val: DataList_Mid_Model) {
    var myself = this;
    // 更新后
    loadTyphoonRealData(val).then(res => {
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

  // TODO: [*] 19-04-01 监听当前选择的实时台风（含date）
  @Watch("targetTyphoonRealBase")
  onTargetTyphoonRealBase(val: TyphoonRealBase_Mid_Model) {
    var myself = this;
    myself.data_scatter_station = [];
    loadStationTideDataList(val).then(res => {
      // console.log(res.data);
      // TODO: [*] 19-04-10 当前的实时台风（含date）被修改后获取后台范围的该台风此时的测站数据列表，并psu至this.station_tide_list中
      if (res.status == 200) {
        myself.clearStationDivs();
        res.data.map(temp => {
          // console.log(temp);
          try {
            var temp_forecast: IForecast = temp.forecast;
            var temp_station: IStation = temp.station;
            // TODO:[*] 19-04-23 需要加入对实测值及预报值是否存在的判断
            /*
              此处可能出现的状况是：
                在temp_forecast.val_forecast与.val_real有可能存在缺省值（-9999）即不存在需要剔除，
            */
            // "1956-09-02T18:00:00Z"
            // console.log(temp_forecast.occurred)
            // console.log(fecha.parse(temp_forecast.occurred,'YY-MM-DD HH:mm:ss'))
            var latlon: number[] = [
              temp_station.point.coordinates[1],
              temp_station.point.coordinates[0]
            ];
            myself.station_tide_list.push(
              new StationData_Mid_Model(
                temp_station.code,
                new Date(temp_forecast.occurred),
                temp_station.stationname,
                temp_station.jw,
                temp_station.lev,
                temp_station.point,
                temp_forecast.val_real,
                temp_forecast.val_forecast
              )
            );
            //TODO: [*] 19-04-18 写入测站散点图model
            myself.data_scatter_station.push(
              new EchartsScatterStationData_Mid_Model(
                temp_station.stationname,
                [
                  temp_station.point.coordinates[0],
                  temp_station.point.coordinates[1],
                  // TODO:[*] 19-04-23 散点图中的val为实测-预报值
                  // temp_station.jw
                  temp_forecast.val_real === -9999 ||
                  temp_forecast.val_forecast === -9999
                    ? 0
                    : temp_forecast.val_real - temp_forecast.val_forecast
                ]
              )
            );
          } catch (error) {}
        });
        // myself.loadStationDivs();
        // 需要调用初始化echarts的方法
        if (myself.data_scatter_station.length > 0) {
          myself.initCharts();
        }
      }
    });
  }
  // @Watch("")

  // TODO: 根据传入的index返回当前div的options（主要是修改zIndex
  getIconStationOption(index: number, val): any {
    var myself = this;
    var opt = this.station_div_icon_option_show;
    // console.log(val);
    // 若传入的index与当前选中的index相同（说明点击了该海洋站div）
    if (myself.select_station_index === index) {
      // 点击了当前海洋站，则将该海洋站的zindex设置为最高
      // opt["zIndexOffset"] = 19999;
      opt["zIndexOffset"] = 19999;
      // opt.zIndexOffset = 19999;
    } else {
      opt["zIndexOffset"] = 99;
    }
    return opt;
  }

  getIconStationZIndex(index: number, val): any {
    var myself = this;
    var opt = this.station_div_icon_option_show;

    // console.log(val);
    var zIndex = opt.zIndexOffset;
    // 若传入的index与当前选中的index相同（说明点击了该海洋站div）
    //   19-04-12 此处判断加入当前hover的index的判断（or）
    if (
      myself.select_station_index === index ||
      myself.hover_station_index === index
    ) {
      // 点击了当前海洋站，则将该海洋站的zindex设置为最高
      // opt["zIndexOffset"] = 19999;
      zIndex = 19999;
      // opt.zIndexOffset = 19999;
    } else {
      zIndex = 99;
    }

    return zIndex;
  }

  //  相当于computed
  get icon_div_station_option_ext() {
    var opt = this.icon_div_station_option;
    opt["zIndexOffset"] = "19999";
    return opt;
  }

  //  计算海洋站圆柱体的高度
  iconDivWeight(val) {
    return val.tide * 5;
  }
}
</script>

<style src="./map_range/map.css">
</style>
