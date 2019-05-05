import { Component, Vue } from "vue-property-decorator";
import { LatLng } from "leaflet";
// 引入数据格式规范接口
import {
    IStation,
    IEchartsScatterData
} from "@/interface/map/map.ts";
import {
    DataList_Mid_Model,
    TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";

import {
    MeteorologyRealData_Mid_Model
} from "@/middle_model/typhoon.ts";
import MapRangeDataMixin from './map_data_mixin'

import { mixins } from "vue-class-component";

@Component
export default class MapTestMixin extends mixins(MapRangeDataMixin) {

    // TODO: [-] 不再使用！加载指定台风，指定时刻的所有测站div
    loadStationDivs(): void {
        var myself = this;
        this.station_tide_list.map(temp => { });
    }
}