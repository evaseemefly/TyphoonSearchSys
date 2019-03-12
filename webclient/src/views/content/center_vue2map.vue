<template>
  <div id="mycontent">
    <l-map ref="basemap" :zoom="zoom" :center="center">
      <l-tile-layer :url="url"></l-tile-layer>
      <!-- 台风路径 -->
      <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color" :fill=false>
      </l-polyline>
      <!-- 台风中心的圆点 -->
      <l-circle v-for="typhoon in typhoon_list" :key=typhoon.id :lat-lng="typhoon.latlon" :color="typhoon.getColor()" :weight="typhoon.getWeight()" @mouseover="showTyphoonDiv(typhoon)" @mouseout="clearTyphoonDivIcon()" @click="changeTyphoon(typhoon)" />

      <!-- 方式1 -->
      <!-- <l-marker v-for="station in station_tide_list" :key=station.id :lat-lng="station.latlon">
        <l-icon icon-url="/leaflet/images/marker-icon.png">
        </l-icon>
      </l-marker> -->

      <!-- 方式2 -->
      <!-- 下面icon嵌套再marker中，必须指定iconUrl -->
      <!-- <l-marker v-for="station in station_tide_list" :key=station.id :lat-lng="station.latlon">
        <l-icon>
        </l-icon>
      </l-marker>-->

      <!-- 方式3 -->
      <!-- 海洋站所在位置的marker -->
      <l-marker v-for="station in station_tide_list" :key=station.id :lat-lng="station.latlon" :icon="icon_marker" @click="openStationDivIcon(station)">
      </l-marker>

      <!-- <l-marker v-for="(station,index) in station_tide_list" :key=station.id :lat-lng="station.latlon" :icon="icon_marker" @mouseover="upZIndex(station)"> -->

      <!-- 海洋站的潮位圆柱marker -->
      <!-- 注意此处关于偏移量（写在option中的）需要写在l-marker中，不能写在l-icon中！！ -->
      <!-- <l-marker v-for="station in station_tide_list" :key=station.id :lat-lng="station.latlon" :zIndexOffset=999>
        <l-icon :icon-anchor="icon_div_station_cylinder_anchor" :iconSize=[] icon-url="/leaflet/images/marker-icon.png">
          <div class="ellipse"></div>
        </l-icon>
      </l-marker> -->

      <!-- 此处注意：
      对于icon，若不指定图片url，设置iconSize无效 -->
      <!-- 对于l-icon可以直接指定icon-anchor设置偏移量 -->
      <!-- 效果不好暂时注释掉 -->
      <!-- <l-marker
        v-for="station in station_tide_list"
        :key=station.id
        :lat-lng="station.latlon"
        :zIndexOffset=999
      >

        <l-icon :icon-anchor="iconStationCylinderAnchor(station.tide)">
          <div class="ellipse"></div>
          <div
            class="ellipse-after"
            :style="{height:iconDivWeight(station)+'px'}"
          ></div>
        </l-icon>
      </l-marker> -->

      <!-- 海洋站的div以及table样式 -->
      <l-marker v-for="(station,index) in station_tide_list" :key=station.id :lat-lng="station.latlon" @click="changeStationIndex(index)" @mouseout="upZIndex(station)" :options="icon_div_station_option" :zIndexOffset="getIconStationZIndex(index,station)">
        <l-icon :options="icon_div_station_option">
          <div id="station_form" v-show="index!=select_station_index" class="fade_enter">
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
          <div id="station_detail" v-show="index==select_station_index" class="card box-shadow">
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
      </l-marker>
    </l-map>
    <!-- <div id="basemap">

    </div> -->

  </div>
</template>

<script lang="ts">
// 引入fecha
import fecha from "fecha";

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model
} from "@/middle_model/typhoon.ts";

// 引入公共的枚举
import { TyphoonCircleStatus } from "@/common/Status.ts";

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

@Component({
  components: {
    "l-marker": LMarker,
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-polyline": LPolyline,
    "l-circle": LCircle,
    "l-icon": LIcon
  },
  filters: {
    // TODO 时间格式化
    formatDate(date: Date): String {
      var str_format = fecha.format(date, "YY-MM-DD HH:mm:ss");
      return str_format;
    }
  }
})
export default class center_vue2map extends Vue {
  zoom: number = 5;
  center: any = [30.09, 127.75];
  url: string = "/mapfiles/{z}/{x}/{y}.jpg";
  typhoon_data: MeteorologyRealData_Mid_Model[] = null;
  // mymap: any = null; // 地图
  typhoon_div_icon_temp: any = null; // 当前的divICon对象
  typhoon_temp: MeteorologyRealData_Mid_Model = null; // 点击某个台风div后记录的该台风对象
  latlons: Array<LatLng> = []; // 经纬度的数组(数组嵌套数组)
  typhoon_list: Array<MeteorologyRealData_Mid_Model> = []; //台风列表
  station_tide_list: Array<TideRealData_Mid_Model> = []; //测站潮位测值列表
  select_station_index: number = -1; // 选中的海洋站序号（需要切换对应海洋站的两个div的显示于隐藏）
  station_div_icon_option_hidden: any = {
    zIndexOffset: 10
  };
  station_div_icon_option_show: any = {
    zIndexOffset: 199,
    iconAnchor: [-20, 30] //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）
  };

  //TODO 海洋站icon（防止偏移）
  icon_marker = L.icon({
    iconUrl: "/leaflet/images/marker-icon.png",
    // iconSize: [32, 37],
    iconAnchor: [16, 37] // 防止地图缩放时产品偏移，需固定绝对位置
  });
  // TODO 海洋站圆柱体
  icon_div_station_cylinder_anchor: Array<number> = [-10, 10]; //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）

  // TODO 计算圆柱体的偏移量
  iconStationCylinderAnchor(val): Array<number> {
    // return [120, 10];
    return [40, 10 + val * 5];
  }

  //TODO 海洋站divicon（防止偏移）
  icon_div_station_option: any = {
    iconAnchor: [-20, 30] //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）
  };

  polyline: any = {
    latlngs: [],
    color: "green"
  };
  markers: any = [];

  // color: Color = Color.red;

  // 根据指定时间及code查询对应台风的实时数据
  loadTyphoonData(): void {
    // 此处只做模拟
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        // [30.09, 127.75],
        [12.5, 115.4],
        1001.2,
        1
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [13.5, 116.0],
        1001.2,
        1.5
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [14.4, 116.6],
        1001.2,
        2
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [15.2, 116.9],
        1001.2,
        3
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [16.2, 116.9],
        1001.2,
        3.4
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [17.3, 117.3],
        1001.2,
        5
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [17.7, 117.8],
        1001.2,
        8
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [18.0, 118.6],
        1001.2,
        12
      )
    );
    this.typhoon_list.push(
      new MeteorologyRealData_Mid_Model(
        "code_a",
        new Date(),
        [18.3, 119.5],
        1001.2,
        15
      )
    );
  }

  changeTyphoon(val): void {
    this.typhoon_temp = val;
  }

  showTyphoonDiv(val): void {
    // console.log(val);
    this.addTyphoonDiv2Map(val);
  }
  // latlons: Array<number[]> = []; // 经纬度的数组(数组嵌套数组)
  // 初始化map
  initMap(): void {
    var myself = this;

    // 19-03-07 此部分代码由vue2leaflet替代
    // if (myself.mymap == null) {
    //   myself.mymap = L.map("basemap").setView([30.09, 127.75], 5);
    //   // var mymap = L.map('basemap').setView([51.505, -0.09], 13)
    //   // mapLink = "../static/mapfiles/";

    //   // var mapfilesPath = '../../../mapfiles/{z}/{x}/{y}.jpg'

    //   // 19-03-06 暂时注释掉此处，改为读取mbtiles格式的底图
    //   var mapfilesPath = "/mapfiles/{z}/{x}/{y}.jpg";
    //   L.tileLayer(mapfilesPath, {
    //     attribution: "",
    //     maxZoom: 8,
    //     minZoom: 2
    //   }).addTo(myself.mymap);
    //   // var mb = L.tileLayer
    //   //   .mbTiles("http://server/something/cool-stuff.mbtiles")
    //   //   .addTo(myself.mymap);
    //   // L.tileLayer.mbTiles()
    //   // L.TileLayer.mbTiles();
    //   this.$emit("update:basemap", myself.mymap);
    // }

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

  // 将typhoon_list 加载值地图中
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
  //加载指定台风，指定时刻的所有测站div
  loadStationDivs(): void {
    var myself = this;
    this.station_tide_list.map(temp => {
      // myself.addStationDiv2Map(temp);
    });
  }
  addTestDiv2Map(): void {
    [18.3, 119.5];
  }
  // TODO 改变当前选中的海洋站的编号
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

  // TODO  鼠标移入station Div时，将其置顶
  upZIndex(val): void {
    // var myself = this;
    // var opt = this.icon_div_station_option;
    this.select_station_index = -1;

    // // 若传入的index与当前选中的index相同（说明点击了该海洋站div）
    // if (myself.select_station_index === index) {
    //   // 点击了当前海洋站，则将该海洋站的zindex设置为最高
    //   opt["zIndexOffset"] = "19999";
    // } else {
    //   opt["zIndexOffset"] = "99";
    // }
    // return opt;
  }

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
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "大陈",
        "code_1",
        [19.1, 114.2],
        new Date(),
        5.3,
        6.6,
        20,
        122,
        310,
        "dachen"
      )
    );
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "宁德",
        "code_2",
        [20.1, 113.2],
        new Date(),
        2.5,
        3.6,
        10,
        52,
        210,
        "ningde"
      )
    );
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "石浦",
        "code_1",
        [18.3, 113.0],
        new Date(),
        3.6,
        4.1,
        3.1,
        52,
        210,
        "dachen"
      )
    );
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "宁德",
        "code_1",
        [20.4, 115.7],
        new Date(),
        1.9,
        2.2,
        3.5,
        52,
        210,
        "dachen"
      )
    );
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "宁德",
        "code_1",
        [21.2, 114.2],
        new Date(),
        2.5,
        3.6,
        2.1,
        52,
        210,
        "dachen"
      )
    );
    this.loadStationDivs();
  }

  // TODO 根据传入的index返回当前div的options（主要是修改zIndex
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

    console.log(val);
    var zIndex = opt.zIndexOffset;
    // 若传入的index与当前选中的index相同（说明点击了该海洋站div）
    if (myself.select_station_index === index) {
      // 点击了当前海洋站，则将该海洋站的zindex设置为最高
      // opt["zIndexOffset"] = 19999;
      zIndex = 19999;
      // opt.zIndexOffset = 19999;
    } else {
      zIndex = 99;
    }

    return zIndex;
  }

  // TODO 相当于computed
  get icon_div_station_option_ext() {
    var opt = this.icon_div_station_option;
    opt["zIndexOffset"] = "19999";
    return opt;
  }

  // TODO 计算海洋站圆柱体的高度
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
  height: 100%;
  width: 100%;
  left: 200px;
  overflow: hidden;
  position: absolute;
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
  /* color: black; */
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
  margin-left: -21px;
  margin-right: -21px;
  margin-bottom: -21px;
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
  width: 180px;
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
}

#station_form .surge {
  background: rgba(5, 213, 140, 0.646);
  color: rgba(43, 33, 108, 0.872);
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

#station_form .tide {
  background: rgba(45, 244, 174, 0.557);
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

#station_form table tr td {
  width: 50px;
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
