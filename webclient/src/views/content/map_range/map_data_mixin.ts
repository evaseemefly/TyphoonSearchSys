import { Component, Vue } from "vue-property-decorator";
import L, { LatLng } from "leaflet";
// 引入数据格式规范接口
import {
    IStation,
    IEchartsScatterData
} from "@/interface/map/map.ts";
import {
    DataList_Mid_Model
} from "@/middle_model/common.ts";

import {
    MeteorologyRealData_Mid_Model
} from "@/middle_model/typhoon.ts";

/**
 * 所有map有关的data放在此处
 *
 * @export
 * @class MapRangeDataMixin
 * @extends {Vue}
 */
@Component
export default class MapRangeDataMixin extends Vue {
    zoom: number = 5;
    // center: any = [30.09, 127.75];
    center: any = [17.6, 131.6];
    // url: string = "/mapfiles/{z}/{x}/{y}.jpg";
    // 尝试换成geoq的地图：午夜蓝色
    // url: string ="https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}";
    url: string =
        "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}";
    typhoon_data: MeteorologyRealData_Mid_Model[] = null;
    // mymap: any = null; // 地图
    typhoon_div_icon_temp: any = null; // 当前的divICon对象

    //  19-03-22 选中的当前台风对象
    typhoon_temp: MeteorologyRealData_Mid_Model = null; // 点击某个台风div后记录的该台风对象
    latlons: Array<LatLng> = []; // 经纬度的数组(数组嵌套数组)
    typhoon_list: Array<MeteorologyRealData_Mid_Model> = []; //台风列表
    typhoon_realdata_list: Array<MeteorologyRealData_Mid_Model> = []; // 台风气象实时数据列表
    //  19-03-21 台风 code集合
    typhoon_code_list: Array<DataList_Mid_Model> = [];
    // 是否显示台风列表
    is_show_typhoon_list: boolean = false;

    is_show_modal: boolean = true;
    // [-] 19-04-10 测站潮位测值列表
    station_tide_list: Array<IStation> = []; //测站潮位测值列表
    select_station_index: number = -1; // 选中的海洋站序号（需要切换对应海洋站的两个div的显示于隐藏）
    //  19-04-12 鼠标移入时的station 序号（将该divicon zindex设置为最高）
    hover_station_index: number = -1;
    index_stationdiv_click: number = 0;
    // TODO:[*] 19-04-25 选中的测站对象（作为参数传递给子组件——modal）
    station_temp: IStation = null;
    // [-] 19-04-18 尝试实现散点图
    // myChart = echarts.init(document.getElementById("mycontent"));
    // echarts 的测试数据
    // data_echarts中保存的是测站及对应的潮位
    data_echarts = [
        // {
        //   name: "LIUMI",
        //   value: 382
        // },
    ];

    // echart的散点图图层
    layer_scatter: any = null;

    // [-] 19-04-18 测站散点图数组
    data_scatter_station: Array<IEchartsScatterData> = [];

    // 地理数据
    // 保存的是测站及对应的经纬度
    geoCoordMap = {
        // LIUMI: [117.44, 38.59],
        // ZHENHAIS: [121.43, 29.57],
        // WENZHOU2: [120.39, 28.02],
        // BAIYANT: [119.27, 25.58],
        // MEIHUA: [120.39, 28.02],
        // CESHI: [119.41, 26.01],
        // CHONGWU: [118.56, 24.53],
        // XIAMEN: [118.04, 24.27]
    };
    // 19-03-21 点击的marker
    targetMarkerLatlon: number[] = [47.31322, -1.319482];
    station_div_icon_option_show: any = {
        zIndexOffset: 199,
        iconAnchor: [-20, 30] //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）
    };

    station_div_icon_option_hidden: any = {
        zIndexOffset: 10
    };

    // 海洋站icon（防止偏移）
    icon_marker = L.icon({
        iconUrl: "/leaflet/images/marker-icon.png",
        iconAnchor: [16, 37] // 防止地图缩放时产品偏移，需固定绝对位置
    });
    //  海洋站圆柱体
    icon_div_station_cylinder_anchor: Array<number> = [-10, 10]; //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）
    // 海洋站divicon（防止偏移）
    icon_div_station_option: any = {
        iconAnchor: [-30, 30], //[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]（可以防止偏移）
        pane: "markerPane"
    };

    polyline: any = {
        latlngs: [],
        color: "yellow"
    };
    markers: any = [];
}