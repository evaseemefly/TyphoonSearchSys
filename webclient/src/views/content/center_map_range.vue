<template>
  <div id="mycontent">
    <l-map
      ref="basemap"
      :zoom="zoom"
      :center="center"
      @click="createMarker"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <!-- 台风路径 -->
      <l-polyline
        :lat-lngs="polyline.latlngs"
        :color="polyline.color"
        :fill="false"
      ></l-polyline>
      <!-- 台风中心的圆点 -->
      <l-circle
        v-for="typhoon in typhoon_realdata_list"
        :key="typhoon.id"
        :lat-lng="typhoon.latlon"
        :color="typhoon.getColor()"
        :weight="typhoon.getWeight()"
        @mouseover="showTyphoonDiv(typhoon)"
        @mouseout="clearTyphoonDivIcon()"
        @click="changeTyphoonRealBase(typhoon)"
      />

      <!-- 鼠标点击某一个位置，获取周边一定范围内的经过台风 -->
      <l-marker
        :lat-lng="targetMarkerLatLon"
        :icon="icon_marker"
      ></l-marker>
      <!-- 鼠标点击某个位置之后根据slider获取的半径 -->
      <l-circle
        :lat-lng="targetMarkerLatLon"
        :weight="4"
        :radius="range"
      />

      <!-- 海洋站的div以及table样式 -->
      <!-- TODO: 注意此处需要指定icon的url，否则会出现动态url，而无法找到marker的图标 -->
      <!-- TODO: 19-04-12 修改此处，移入zindex权重增加，移出减小 -->
      <l-marker
        v-for="(station,index) in station_tide_list"
        :key="station.id"
        :lat-lng="station.latlon"
        @click="changeStationIndex(index)"
        @mouseover="upZIndex(index,station)"
        @mouseout="downZindex(index,station)"
        :options="icon_div_station_option"
        :zIndexOffset="getIconStationZIndex(index,station)"
        :icon="icon_marker"
      >
        <!-- TODO: 准备注释掉，提取出来为一个子组件 暂时不提取为子组件-->
        <l-icon :options="icon_div_station_option">
          <div
            id="station_form"
            v-show="index!=select_station_index"
            class="fade_enter"
          >
            <table
              class="table table-bordered"
              border="1"
            >
              <tr>
                <td
                  class="station_name"
                  rowspan="2"
                >{{station.stationname}}</td>
                <td class="surge title">实测</td>
                <td class="surge">{{station.tide}}</td>
              </tr>
              <!-- <tr>
                <td class="tide">警戒潮位</td>
                <td class="tide">{{station.jw}}</td>
              </tr>-->
              <tr>
                <td class="tide">预报</td>
                <td class="tide">{{station.tide_forecast}}</td>
              </tr>
            </table>
          </div>
          <div
            id="station_detail"
            v-show="index==select_station_index"
            class="card box-shadow"
          >
            <div class="card-header">{{station.name+index}}</div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">时间</div>
                <div class="col-md-8">{{station.startdate|formatDate}}</div>
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

        <!-- <StationIcon
          :icon_div_station_option="icon_div_station_option"
          :station="station"
          :is_show="index!=select_station_index"
          :is_show_detial="index==select_station_index"
        ></StationIcon>-->
      </l-marker>
    </l-map>
    <!-- <div id="basemap">

    </div>-->
    <!-- 注意自定义模块要放在l-map外部，否则会有冲突 -->
    <RangeSlider @loadTyphoonList="loadTyphoonListByRange"></RangeSlider>
    <TyphoonList
      :typhoon_list="typhoon_code_list"
      :is_show="is_show_typhoon_list"
    ></TyphoonList>
  </div>
</template>

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
  StationData_Mid_Model
} from "@/middle_model/typhoon.ts";
// 底部rangeslider
import RangeSlider from "@/views/member/slider/rangeSlider.vue";
// 台风列表
import TyphoonList from "@/views/member/secondBar/typhoonListBar.vue";
// 海洋站icon
import StationIcon from "@/views/member/map/station_icon.vue";
// 引入公共的枚举
import { TyphoonCircleStatus } from "@/common/Status.ts";
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";

// 引入数据格式规范接口
import { IStation, IForecast } from "@/interface/map/map.ts";

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
import fechaObj from "fecha";

@Component({
  components: {
    "l-marker": LMarker,
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-polyline": LPolyline,
    "l-circle": LCircle,
    "l-icon": LIcon,
    RangeSlider,
    TyphoonList
    // StationIcon
  },
  filters: {
    // TODO: 时间格式化
    formatDate(date: Date): String {
      var str_format = fecha.format(date, "YY-MM-DD HH:mm:ss");
      return str_format;
    }
  }

  // @Mutation()
})
export default class center_map_range extends Vue {
  zoom: number = 5;
  // center: any = [30.09, 127.75];
  center: any = [17.6, 131.6];
  url: string = "/mapfiles/{z}/{x}/{y}.jpg";
  typhoon_data: MeteorologyRealData_Mid_Model[] = null;
  // mymap: any = null; // 地图
  typhoon_div_icon_temp: any = null; // 当前的divICon对象

  // TODO: [-] 19-03-22 选中的当前台风对象
  typhoon_temp: MeteorologyRealData_Mid_Model = null; // 点击某个台风div后记录的该台风对象
  latlons: Array<LatLng> = []; // 经纬度的数组(数组嵌套数组)
  typhoon_list: Array<MeteorologyRealData_Mid_Model> = []; //台风列表
  typhoon_realdata_list: Array<MeteorologyRealData_Mid_Model> = []; // 台风气象实时数据列表
  // TODO: [*] 19-03-21 台风 code集合
  typhoon_code_list: Array<DataList_Mid_Model> = [];
  // 是否显示台风列表
  is_show_typhoon_list: boolean = false;
  // TODO: [*] 19-04-10
  station_tide_list: Array<IStation> = []; //测站潮位测值列表
  select_station_index: number = -1; // 选中的海洋站序号（需要切换对应海洋站的两个div的显示于隐藏）
  // TODO: [-] 19-04-12 鼠标移入时的station 序号（将该divicon zindex设置为最高）
  hover_station_index: number = -1;
  station_div_icon_option_hidden: any = {
    zIndexOffset: 10
  };

  // TODO: [-] 由rangeSlider通过vuex传过来的range
  get range(): number {
    return this.$store.state.map.range;
  }

  // TODO: [x] 当前选择的台风（由vuex获取）
  get targetTyphoon(): MeteorologyRealData_Mid_Model {
    return this.$store.state.map.typhoon;
  }

  // TODO: [*] 当前选择的 台风实时model(由vuex获取)
  get targetTyphoonRealBase(): TyphoonRealBase_Mid_Model {
    return this.$store.state.map.typhoonRealBase;
  }

  // TODO: [*] 更改当前的 台风实时model(存在vuex中)
  set targetTyphoonRealBase(val: TyphoonRealBase_Mid_Model) {
    this.$store.commit("typhoonRealBase", val);
  }

  // markerLatLng: [47.31322, -1.319482];
  // TODO: [*] 19-03-21 点击的marker
  targetMarkerLatLon: number[] = [47.31322, -1.319482];
  station_div_icon_option_show: any = {
    zIndexOffset: 199,
    iconAnchor: [-20, 30] //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）
  };

  // TODO: [*] 19-03-21 由子组件触发的根据lat,lon,range从后台获取typhoonlist的方法
  loadTyphoonListByRange(): void {
    var myself = this;
    var range: number = this.range;
    var latlon: number[] = this.targetMarkerLatLon;
    var obj: ITyphoonParams = {
      latlon: latlon,
      range: range
    };
    loadTyphoonList(obj).then(res => {
      if (res.status === 200) {
        var data: any = res.data;
        myself.is_show_typhoon_list = false;
        myself.typhoon_code_list = [];
        // data中为台风列表
        data.forEach(obj => {
          myself.typhoon_code_list.push(
            new DataList_Mid_Model(obj.code, -1, obj.code, obj.year)
          );
        });
        myself.is_show_typhoon_list = true;
      }
    });
  }

  //TODO: 海洋站icon（防止偏移）
  icon_marker = L.icon({
    iconUrl: "/leaflet/images/marker-icon.png",
    // iconSize: [32, 37],
    iconAnchor: [16, 37] // 防止地图缩放时产品偏移，需固定绝对位置
  });
  // TODO: 海洋站圆柱体
  icon_div_station_cylinder_anchor: Array<number> = [-10, 10]; //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）

  // TODO: 计算圆柱体的偏移量
  iconStationCylinderAnchor(val): Array<number> {
    // return [120, 10];
    return [40, 10 + val * 5];
  }

  //TODO: 海洋站divicon（防止偏移）
  icon_div_station_option: any = {
    iconAnchor: [-20, 30] //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）
  };

  polyline: any = {
    latlngs: [],
    color: "green"
  };
  markers: any = [];

  // color: Color = Color.red;

  // TODO:: [*] 19-03-21 鼠标在地图上点击后，加载marker
  createMarker(event: any): void {
    // 鼠标点击地图上后，向该位置加入一个marker
    this.targetMarkerLatLon = [
      event.latlng.lat.toFixed(4),
      event.latlng.lng.toFixed(4)
    ];
    this.is_show_typhoon_list = false;
  }

  // TODO: [*] 最终要去掉
  loadTyphoonData(): void {
    // 此处只做模拟
    this.typhoon_realdata_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
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
      val.code,
      val.date
    );
    this.targetTyphoonRealBase = typhoon_real;
  }

  showTyphoonDiv(val): void {
    // console.log(val);
    this.addTyphoonDiv2Map(val);
  }
  // latlons: Array<number[]> = []; // 经纬度的数组(数组嵌套数组)
  // 初始化map
  initMap(): void {
    var myself = this;
    // 暂时将读取台风路径写在此处
    this.loadTyphoonLine();
    // this.loadTyphoonPoint();
  }

  // 每次初始化地图时，清除一些数据
  initData(): void {
    this.typhoon_temp = null;
  }
  // loadTyphoonData():void{

  // }

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
        // console.log(e);
        // console.log(temp);
        // console.log(circle_temp);
        myself.addTyphoonDiv2Map(temp);
      });

      //加入鼠标移出时的操作
      circle_temp.on("mouseout", function(e) {
        myself.clearDivIcon();
      });

      //加入点击鼠标时的操作
      circle_temp.on("click", function(e) {
        // console.log(e);
        myself.typhoon_temp = temp;
        // console.log(myself.typhoon_temp);
      });
      // circle_temp.addTo(mymap);
    });

    //3 获取了经纬度数组之后，需要在地图上画线
    // var temp = new LatLng();

    // var polyline = L.polyline(myself.latlons, { color: "red" }).addTo(mymap);

    //4 暂时添加一个divIcon的测试
    // this.addTestDiv2Map();
  }
  // TODO: [-] 不再使用！加载指定台风，指定时刻的所有测站div
  loadStationDivs(): void {
    var myself = this;
    this.station_tide_list.map(temp => {
      // myself.addStationDiv2Map(temp);
    });
  }
  // 清除测站的divIcon
  clearStationDivs(): void {
    this.station_tide_list = [];
  }
  addTestDiv2Map(): void {
    [18.3, 119.5];
  }
  // TODO: [*] 19-04-12 改变当前选中的海洋站的编号
  changeStationIndex(index: number): void {
    // console.log(val);
    var myself = this;
    if (index === myself.select_station_index) {
      myself.select_station_index = -1;
    } else {
      myself.select_station_index = index;
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

  addStationDiv2Map(station_temp: TideRealData_Mid_Model): void {
    var myself = this;
    var mymap: any = this.$refs.basemap["mapObject"];
    let station_div_html = station_temp.toHtml();
    // this.markers.push({
    //   // id: "m1",
    //   position: { lat: station_temp.latlon[0], lng: station_temp.latlon[1] },
    //   tooltip: "tooltip for marker1",
    //   draggable: true,
    //   visible: true,
    //   options: {
    //     html: station_div_html
    //   }
    // });
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

  openStationDivIcon(val): void {
    // console.log(val);
  }

  // TODO: 19-04-12 鼠标移出 station Div时，将其index降低
  downZindex(index: number, val: any): void {
    // var myself = this;
    // var opt = this.icon_div_station_option;
    this.select_station_index = -1;
    this.hover_station_index = -1;

    // // 若传入的index与当前选中的index相同（说明点击了该海洋站div）
    // if (myself.select_station_index === index) {
    //   // 点击了当前海洋站，则将该海洋站的zindex设置为最高
    //   opt["zIndexOffset"] = "19999";
    // } else {
    //   opt["zIndexOffset"] = "99";
    // }
    // return opt;
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
    // this.markers.push({
    //   // id: "m1",
    //   position: { lat: station_temp.latlon[0], lng: station_temp.latlon[1] },
    //   tooltip: "tooltip for marker1",
    //   draggable: true,
    //   visible: true,
    //   options: {
    //     html: station_div_html
    //   }
    // });
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
      console.log(this);
    });
  }
  mounted() {
    this.initMap();
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

  // TODO: [-] 19-03-23 监听由vuex更新的targetTyphoon（当前选择的台风）
  //更新typhoon_realdata_list以及polyline
  @Watch("targetTyphoon")
  onTargetTyphoon(val: DataList_Mid_Model) {
    var myself = this;
    // 更新后
    loadTyphoonRealData(val).then(res => {
      console.log(res.data);
      if (res.status === 200) {
        //记得每次需要清空
        myself.typhoon_realdata_list = [];
        myself.polyline.latlngs = [];
        res.data.map(temp => {
          var date_str = temp.date;
          myself.typhoon_realdata_list.push(
            new MeteorologyRealData_Mid_Model(
              temp.code,
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
            // "1956-09-02T18:00:00Z"
            // console.log(temp_forecast.occurred)
            // console.log(fecha.parse(temp_forecast.occurred,'YY-MM-DD HH:mm:ss'))
            var latlon: number[] = [
              temp_station.point.coordinates[1],
              temp_station.point.coordinates[0]
            ];
            myself.station_tide_list.push(
              // new (
              //   temp_station.stationname,
              //   temp_station.code,
              //   latlon,
              //   new Date(temp_forecast.occurred),
              //   null,
              //   temp_forecast.val,
              //   null,
              //   null,
              //   null,
              //   temp_station.code
              // )
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
          } catch (error) {}
        });
        // myself.loadStationDivs();
      }
    });
  }
  // @Watch("")

  // TODO: 根据传入的index返回当前div的options（主要是修改zIndex
  getIconStationOption(index: number, val): any {
    var myself = this;
    var opt = this.station_div_icon_option_show;
    console.log(val);
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
    //  TODO:: Toggle Done  19-04-12 此处判断加入当前hover的index的判断（or）
    if (myself.select_station_index === index || myself.hover_station_index===index) {
      // 点击了当前海洋站，则将该海洋站的zindex设置为最高
      // opt["zIndexOffset"] = 19999;
      zIndex = 19999;
      // opt.zIndexOffset = 19999;
    } else {
      zIndex = 99;
    }

    return zIndex;
  }

  // TODO:: 相当于computed 
  get icon_div_station_option_ext() {
    var opt = this.icon_div_station_option;
    opt["zIndexOffset"] = "19999";
    return opt;
  }

  // TODO: 计算海洋站圆柱体的高度
  iconDivWeight(val) {
    return val.tide * 5;
  }
  // watch: {

  //   pythoon_temp(newVal){

  //   }
  // }
}
</script>

<style>
#mycontent {
  /* position: absolute; */
  /* top: 188px; */
  /* height: 600px; */

  /* bottom: 0px; */

  /* height: 100%;
  width: 100%;
  left: 200px;
  overflow: hidden;
  position: absolute; */

  flex: 8;
  position: relative;
}
#basemap {
  height: 100%;
  width: 100%;
  position: absolute;
}

.typhoon_data_div .row {
  color: black;
}

.typhoon_data_div .card-body {
  color: black;
}
.typhoon_data_div {
  color: black;
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.typhoon_icon_default {
  width: 750px !important;
}

.card-header {
  text-align: center;
  text-shadow: 2px 2px 10px grey;
}
.row {
  /* color: black; */
  text-align: center;
  text-shadow: 2px 2px 10px grey;
  margin-bottom: 10px;
}
/* 注意card有一个左右15px的padding */
.card {
  padding-left: 0px;
  padding-right: 0px;
}
.row_footer {
  margin-left: -21px !important;
  margin-right: -21px !important;
  margin-bottom: -21px !important;
}

/* 底部div */
.typhoon_footer {
  display: flex;
  flex-direction: row;
  background: #0044cc;
  width: 100%;
  color: white;
  border: 1px;
  text-align: center;
  /* 设置圆角 */
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  /* margin-left: -21px;
				margin-right: -21px; */
}

.typhoon_footer .columnar {
  display: flex;
  width: 50%;
  flex-direction: column;
  border-right: 1px solid #0000ff;
}

.typhoon_footer .columnar .subitem_top {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  font-size: 20px;
}

.typhoon_footer .columnar .subitem_foot {
  display: flex;
  width: 100%;
  justify-content: center;
  text-align: center;
  font-size: 0.625rem;
}

/* station div icon的样式 */

#station_form {
  /* border: 2px solid white; */
  width: 220px;
  display: inline-block;
  /* background: rgba(50, 124, 164, 0.829); */
  background: #2c3e50;
  text-align: center;
  color: aliceblue;
  box-shadow: 10px 10px 5px #888888;
  box-shadow: 0 0 10px whitesmoke;
  /* 边角圆滑处理 */
  border-radius: 10px;
}

#station_form :hover {
  /* z-index: 9999; */
  background: red;
}

.fade_enter {
  transition: opacity 0.5s;
}

#station_form .table {
  margin-bottom: 0px;
  text-align: center;
  text-shadow: 2px 2px 10px grey;
  color: white;
  font-size: 122%;
}

#station_form .station_name {
  padding-top: 2px;
  padding-bottom: 2px;
  width: 150px !important;
  word-break: break-all;
}

#station_form .surge {
  background: rgba(5, 213, 140, 0.646);
  color: rgba(227, 238, 70, 0.872);
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

#station_form .tide {
  background: rgba(45, 244, 174, 0.557);
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

#station_form .title {
  width: 100px !important;
}

#station_form table tr td {
  width: 80px;
}

#station_detail {
  display: inline-block;
  width: 340px;
  /* background: rgba(0, 0, 255, 0.829); */
  text-align: center;
  /* color: rgba(9, 137, 249, 0.927); */
  color: rgba(53, 83, 203, 0.783);
  box-shadow: 10px 10px 5px #888888;
  box-shadow: 0 0 10px whitesmoke;
  /* 边角圆滑处理 */
  border-radius: 10px;
}

#station_detail .card-header {
  text-align: center;
  text-shadow: 2px 2px 10px grey;
  background: rgb(51, 152, 125);
  color: white;
  font-size: 120%;
}

#station_detail .card-body {
  background: rgb(47, 68, 84);
  color: white;
}

/* 海洋站的柱体样式 */
.ellipse {
  /* margin-left: 100px; */
  width: 20px;
  height: 20px;
  border: solid 0.5px rgb(62, 105, 171);
  background: rgb(51, 152, 125);
  border-radius: 10px;
  transform: rotateX(70deg);
}

.ellipse-after {
  content: "";
  display: inline-block;
  width: 20px;
  height: 100px;
  position: relative;
  opacity: 0.9;
  background: rgb(51, 152, 125);
  top: -10px;
  left: -0.5px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
