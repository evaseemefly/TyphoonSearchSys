<template src="./map_base.html"></template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// 引入fecha
import fecha from "fecha";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 使用mixin的方式拓展data
import MapBaseDataMixin from "./map_base_data_mixin";
import MapCommonMixin from "../map_common/map_common_mixin";
import MapRangeVuexMixin from "../map_range/map_vuex_mixin";

// 引入公共的枚举
import { TyphoonCircleStatus } from "@/common/Status.ts";
import { mixins } from "vue-class-component";
// 引入枚举
import { AlarmLevel } from "@/common/enum/map.ts";
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";
import {
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model,
  StationData_Mid_Model,
  EchartsScatterStationData_Mid_Model
} from "@/middle_model/typhoon.ts";
import {
  getTyphoonCodeByComplexCondition,
  getTimeByCode,
  getDetail
} from "@/api/api.js";

// 引入数据格式规范接口
import {
  IStation,
  IForecast,
  IEchartsScatterData
} from "@/interface/map/map.ts";

// 与后台交互的api
import {
  loadTyphoonList,
  ITyphoonParams,
  loadTyphoonRealData,
  ITyphoonRealDataParamas,
  loadStationTideDataList,
  ITyphoonRealBaseParams
} from "@/api/api.ts";

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
// TODO:[*] 19-07-02 此处引用的超图的插件，之前是放在map_common_mixin.ts中，以后废弃会导致data不一致的冲突
// 19-04-18尝试使用超图的开源iclent插件
import { tiledMapLayer, echartsLayer } from "@supermap/iclient-leaflet";

// 引入其他子组件
// 引入modal组件
import modal_detail from "@/views/member/modal/modal_detail.vue";
import { DivIcon, DivIconOptions } from "leaflet";

// 引入cookie的公共组件
import {
  loadStationDictChCookie,
  checkStationDictCookieExist,
  getStationDictChCookie
} from "@/common/cookie.ts";
@Component({
  components: {
    "l-marker": LMarker,
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-polyline": LPolyline,
    "l-circle": LCircle,
    "l-icon": LIcon
    // ModalDetail: modal_detail
  },
  // 自定义过滤器
  filters: {
    //  时间格式化
    formatDate(date: Date): String {
      var str_format = fecha.format(new Date(date), "YY-MM-DD HH:mm:ss");
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
export default class map_base extends mixins(
  MapBaseDataMixin,
  // MapCommonMixin, // TODO:[*] 19-07-02 不在引入mapcommonmixin，会引发data的循环依赖会有冲突
  MapRangeVuexMixin
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
  // TODO:[-] 19-07-02 注意此处由另一个继承的父组件（map_range）中实现，此处不再实现
  // loadTyphoonListByRange(): void {
  // var myself = this;
  // var range: number = this.range;
  // var latlon: number[] = this.targetMarkerLatlon;
  // var obj: ITyphoonParams = {
  //   latlon: latlon,
  //   range: range
  // };
  // loadTyphoonList(obj).then(res => {
  //   if (res.status === 200) {
  //     var data: any = res.data;
  //     myself.is_show_typhoon_list = false;
  //     myself.typhoon_code_list = [];
  //     // data中为台风列表
  //     data.forEach(obj => {
  //       myself.typhoon_code_list.push(
  //         new DataList_Mid_Model(obj.code, -1, obj.code, obj.year)
  //       );
  //     });
  //     myself.is_show_typhoon_list = true;
  //   }
  // });
  // }

  // 计算圆柱体的偏移量
  iconStationCylinderAnchor(val): Array<number> {
    return [40, 10 + val * 5];
  }

  zoomUp(val): void {
    // console.log(val);

    if (val > this.zoom_index) {
      // console.log("正在放大"+val);
      if (val > 6) {
        this.zoom_mark_minifier = false;
      }
    }
    if (val < this.zoom_index) {
      // console.log("正在缩小"+val);
      if (val <= 6) {
        // 缩放到6级后只加载测站的风暴增水不再显示名字
        this.zoom_mark_minifier = true;
      }
    }
    this.zoom_index = val;
  }
  zoomChange(val): void {
    console.log("缩放级别改编");
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
    // 注意差值减错了，应该是tide_forecast-tide
    // 实测潮位 - 警戒潮位
    var abs: number = station.tide - station.tide_forecast;
    var alarm: AlarmLevel = AlarmLevel.Green;
    switch (true) {
      case abs <= -30:
        alarm = AlarmLevel.Green;
        break;
      // -30-0：蓝色
      case abs < 0 && abs >= -30:
        alarm = AlarmLevel.Blue;
        break;
      // 0-30：黄色
      case abs < 30 && abs >= 0:
        alarm = AlarmLevel.Yellow;
        break;
      // 30-80 橙色
      case abs < 80 && abs >= 30:
        alarm = AlarmLevel.Orange;
        break;
      // 80-无穷 红色
      case abs > 80:
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
      myself.showModal(station, myself.typhoon_temp);
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
  showModal(station: IStation, typhoon: MeteorologyRealData_Mid_Model): void {
    console.log(station);
    // this.station_temp = station;
    this.targetStation = station;

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
    var myself = this;
    this.initMap();
    if (!checkStationDictCookieExist(myself)) {
      loadStationDictChCookie(myself);
    }
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
        // todo:[*] 19-08-07 加入了从cookie中取出 测站名称字典
        var stationNameDict = getStationDictChCookie(myself);
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
                  // TODO:[-] 19-04-23 散点图中的val为实测-预报值
                  // temp_station.jw
                  // TODO"[*] 19-06-30 注意此处后台返回的val的值预报与实测是相反的，
                  // 所以在此处相减时主要需要颠倒一下
                  // temp_forecast.val_real === -9999 ||
                  // temp_forecast.val_forecast === -9999
                  //   ? 0
                  //   : temp_forecast.val_real - temp_forecast.val_forecast
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

  // TODO:[*] 19-07-02 将map_common_mixin中的部分方法（注意是方法），放在此处，以后map_common_mixin.ts废弃
  // TODO:[*] 19-05-22 散点图存在一个偏移
  initCharts(): void {
    var myself = this;
    if (myself.layer_scatter != null) {
      myself.layer_scatter.remove();
    }
    // 使用leaflet-echarts的步骤：不需要修改leaflet代码的部分，只需要将leaflet创建好的map作为参数传入
    var mymap: any = this.$refs.basemap["mapObject"];
    var echartsOptions: any = {
      title: {
        text: "潮位",
        subtext: "潮位",
        // sublink: "http://www.pm25.in",
        left: "center"
      },
      tooltip: {
        trigger: "item"
      },
      coordinateSystem: "leaflet",
      series: [
        {
          name: "潮位",
          type: "scatter",
          coordinateSystem: "leaflet",
          // coordinateSystem: "geo",
          // data: myself.convertData(myself.data_echarts),
          // [-] 19-04-18 散点图中的data绑定为model
          data: myself.data_scatter_station,
          // [-] 19-04-23 散点图的大小
          symbolSize: function(val) {
            return myself.getSymbolSize(val);
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: "#ddb926"
            }
          }
        },
        {
          name: "Top 5",
          type: "effectScatter",
          coordinateSystem: "leaflet",
          // [-] 19-04-18 散点图中的data绑定为model
          data: myself.data_scatter_station,
          symbolSize: function(val) {
            return myself.getSymbolSize(val);
          },
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke"
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              show: true
            }
          },
          itemStyle: {
            normal: {
              // color: "#f4e925",
              color: "rgb(51, 152, 125)",
              shadowBlur: 10,
              shadowColor: "#333"
            }
          },
          zlevel: 1
        }
      ]
    };
    var options: any = {
      // 水印
      attribution: "nmefc "
    };
    // echartsLayer可选择的options
    // 参考：http://iclient.supermap.io/web/apis/leaflet.html
    var echarts_scatter = echartsLayer(echartsOptions, options);

    myself.layer_scatter = echarts_scatter;

    myself.layer_scatter.addTo(mymap);
  }

  // 19-04-23 对于散点图的大小的转换
  // index=0:max;inde=1:min
  transformScatterSize(): number[] {
    /*
          
         */
    var arr_val = [];
    this.data_scatter_station.forEach(obj => {
      if (obj.value[2] !== -9999) {
        arr_val.push(obj.value[2]);
      }
    });
    var max = Math.max(...arr_val);
    var min = Math.min(...arr_val);
    return [max, min];
  }

  // 19-04-23 对于散点图的大小的转换
  getSymbolSize(val: any): number {
    var myself = this;
    //index=0:max;inde=1:min
    var arr_maxmin = myself.transformScatterSize();
    var max = arr_maxmin[0];
    var min = arr_maxmin[1];
    var val_temp = val[2];
    // 系数
    var factor_percent = 200;
    var factor_magnify = 3;
    if (val !== -9999) {
      var count = max - min;

      var maxValue = max - min - min / count;
      var percent = Math.floor(((val_temp - min) / count) * factor_percent);
      percent = Math.sqrt(percent);
      return percent * factor_magnify;
      // return percent * factor;
      // var maxSize = 100;
      // var scale = 1;
      // if (maxSize) {
      //   scale = maxValue / maxSize;
      // }

      // return (val[2] - min - min / count) / scale;
    } else {
      return 0;
    }
  }
}
</script>

<style src="./map_base.css">
</style>