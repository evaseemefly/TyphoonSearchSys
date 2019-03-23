<template>
  <div id="mycontent">
    <div id="basemap"></div>
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
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import { DivIcon, DivIconOptions } from "leaflet";
// 需要引入leaflet的样式
import "leaflet/dist/leaflet.css";

@Component({})
export default class center_map extends Vue {
  typhoon_data: MeteorologyRealData_Mid_Model[] = null;
  mymap: any = null; // 地图
  typhoon_div_icon_temp: any = null; // 当前的divICon对象
  typhoon_temp: MeteorologyRealData_Mid_Model = null; // 点击某个台风div后记录的该台风对象
  latlons: Array<LatLng> = []; // 经纬度的数组(数组嵌套数组)
  typhoon_list: Array<MeteorologyRealData_Mid_Model> = []; //台风列表
  station_tide_list: Array<TideRealData_Mid_Model> = []; //测站潮位测值列表

  markers: any = [
    {
      id: "m1",
      position: { lat: 51.505, lng: -0.09 },
      tooltip: "tooltip for marker1",
      draggable: true,
      visible: true
      // icon: L.icon.glyph({
      //   prefix: "",
      //   glyph: "A"
      // })
    },
    {
      id: "m2",
      position: { lat: 51.8905, lng: -0.09 },
      tooltip: "tooltip for marker2",
      draggable: true,
      visible: false
    },
    {
      id: "m3",
      position: { lat: 51.005, lng: -0.09 },
      tooltip: "tooltip for marker3",
      draggable: true,
      visible: true
    },
    {
      id: "m4",
      position: { lat: 50.7605, lng: -0.09 },
      tooltip: "tooltip for marker4",
      draggable: true,
      visible: false
    }
  ];

  // color: Color = Color.red;

  // 根据指定时间及code查询对应台风的实时数据
  loadTyphoonData(targetdate: Date, code: String): void {}
  // latlons: Array<number[]> = []; // 经纬度的数组(数组嵌套数组)
  // 初始化map
  initMap(): void {
    var myself = this;
    if (myself.mymap == null) {
      myself.mymap = L.map("basemap").setView([30.09, 127.75], 5);
      // var mymap = L.map('basemap').setView([51.505, -0.09], 13)
      // mapLink = "../static/mapfiles/";

      // var mapfilesPath = '../../../mapfiles/{z}/{x}/{y}.jpg'

      // 19-03-06 暂时注释掉此处，改为读取mbtiles格式的底图
      var mapfilesPath = "/mapfiles/{z}/{x}/{y}.jpg";
      L.tileLayer(mapfilesPath, {
        attribution: "",
        maxZoom: 8,
        minZoom: 2
      }).addTo(myself.mymap);
      // var mb = L.tileLayer
      //   .mbTiles("http://server/something/cool-stuff.mbtiles")
      //   .addTo(myself.mymap);
      // L.tileLayer.mbTiles()
      // L.TileLayer.mbTiles();
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

    //2 将当前的typhoon_data中获取latlongs
    this.typhoon_list.map(temp => {
      var typhoon_status = new TyphoonCircleStatus(temp.wsm, temp.bp);
      myself.latlons.push(new LatLng(temp.latlon[0], temp.latlon[1]));
      var circle_temp = L.circle(new LatLng(temp.latlon[0], temp.latlon[1]), {
        color: typhoon_status.getColor(),
        // radius: 20
        weight: typhoon_status.getWeight()
      });
      //加入鼠标移入时的操作
      circle_temp.on("mouseover", function(e) {
        // console.log(e);
        // console.log(temp);
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
      circle_temp.addTo(myself.mymap);
    });

    //3 获取了经纬度数组之后，需要在地图上画线
    // var temp = new LatLng();

    var polyline = L.polyline(myself.latlons, { color: "red" }).addTo(
      myself.mymap
    );

    //4 暂时添加一个divIcon的测试
    this.addTestDiv2Map();
  }

  //加载指定台风，指定时刻的所有测站div
  loadStationDivs(): void {
    var myself = this;
    this.station_tide_list.map(temp => {
      myself.addStationDiv2Map(temp);
    });
  }
  addTestDiv2Map(): void {
    [18.3, 119.5];
  }

  // 将divicon从map中清除
  clearDivIcon(): void {
    var myself = this;
    myself.mymap.removeLayer(myself.typhoon_div_icon_temp);
    myself.typhoon_div_icon_temp = null;
  }

  // 向地图中添加台风的div样式
  addTyphoonDiv2Map(typhoon_temp: MeteorologyRealData_Mid_Model): void {
    var myself = this;
    let typhoon_div_html = typhoon_temp.toHtml();

    let typhoon_div_icon = L.divIcon({
      className: "typhoon_icon_default",
      html: typhoon_div_html,
      // 坐标，[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]
      iconAnchor: [-20, 30]
    });

    // console.log(typhoon_div_icon);
    var typhoon_div_icon_temp = L.marker(
      [typhoon_temp.latlon[0], typhoon_temp.latlon[1]],
      {
        icon: typhoon_div_icon
      }
    ).addTo(myself.mymap);
    myself.typhoon_div_icon_temp = typhoon_div_icon_temp;
  }

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
      console.log(this);
    });
  }
  // 将typhoon_list 的点加载至地图中
  loadTyphoonPoint(): void {
    var myself = this;
    // var points = L.point(myself.latlongs);

    var point = L.circle(myself.latlons[0], { color: "blue" }).addTo(
      myself.mymap
    );
    // console.log(point);
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
        [18.2, 114.0],
        new Date(),
        2.5,
        3.6,
        2.1,
        52,
        210,
        "dachen"
      )
    );
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "石浦",
        "code_1",
        [18.3, 113.0],
        new Date(),
        2.5,
        3.6,
        2.1,
        52,
        210,
        "dachen"
      )
    );
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "宁德",
        "code_1",
        [19.1, 114.2],
        new Date(),
        2.5,
        3.6,
        2.1,
        52,
        210,
        "dachen"
      )
    );
    this.station_tide_list.push(
      new TideRealData_Mid_Model(
        "宁德",
        "code_1",
        [20.1, 113.2],
        new Date(),
        2.5,
        3.6,
        2.1,
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
  // watch: {

  //   pythoon_temp(newVal){

  //   }
  // }
}
</script>

<style scoped>
#mycontent {
  /* position: absolute; */
  /* top: 188px; */
  /* height: 600px; */

  /* bottom: 0px; */
  position: absolute;
  left: 100px;
  bottom: 30px;
  top: 80px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
#basemap {
  height: 100%;
  width: 100%;
  position: absolute;
}

.typhoon_icon_default {
  width: 750px !important;
}

.card-header {
  text-align: center;
  text-shadow: 2px 2px 10px grey;
}
.row {
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
  background: rgba(50, 124, 164, 0.829);
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
  background: yellow;
  color: rgb(0, 80, 251);
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

#station_form .tide {
  background: red;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

#station_form table tr td {
  width: 50px;
}
</style>
