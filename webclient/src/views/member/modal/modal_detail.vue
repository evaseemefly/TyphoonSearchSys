<template>
  <div id="mymodal" class="modal fade" tabindex="-1" role="dialog">
    <div id="modal_content" class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <!-- <h4 class="modal-title">船舶编号{{}}</h4> -->
        </div>
        <div class="modal-body my-content-primary">
          <div>
            <!-- <bbxDetailTable :bid="bid"></bbxDetailTable> -->
            <!-- 暂时去掉nav-tabs class，顶部会多出一条线 -->
            <ul id="mytabs" class="nav">
              <!-- <li
                v-for="(item,index) in menulist"
                :key="index"
                role="presentation"
                :class="{active:index===indexMenu}"
              >
                <a
                  href="#"
                  @click="active(index)"
                >{{item.name}}</a>
              </li>-->
            </ul>
            <DetailTable
              :stationName="childTabStationName"
              :maxVal="childTabMaxVal"
              :maxDate="childTabMaxDate"
            ></DetailTable>
            <!-- <div
              id="main"
              style=""
            ></div>-->
            <!-- <stationChart
              :columns="childColumns"
              :values="childVals"
              :title="childTitle"
              :factor="childFactor"
              ref="stationObs"
            ></stationChart>-->
            <stationChart
              :columns="childColumns"
              :valuesReal="childValsReal"
              :valuesForecast="childValsForecast"
              :title="childTitle"
              :factor="childFactor"
              ref="stationObs"
            ></stationChart>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary">确定</button>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ArrayPropsDefinition } from "vue/types/options";
import { mixins } from "vue-class-component";
import { menulist } from "@/common/menu/station_detail_tab_list.ts";
// 引入数据格式规范接口
import { IMenu } from "@/interface/menu/menu.ts";
import { IStation } from "@/interface/map/map.ts";
//引入枚举
import { MenuType } from "@/common/enum/menu.ts";
// 引入子组件
import stationChart from "@/views/member/charts/station_detail_charts.vue";
import DetailTable from "@/views/member/modal/detail_tab.vue";

import MapRangeVuexMixin from "@/views/content/map_range/map_vuex_mixin";

// 尝试引入boostrap
import "bootstrap";
// 引入中间变量
import {
  StationObservationTide_Mid_Model,
  StationAllObservationTide,
  MeteorologyRealData_Mid_Model
} from "@/middle_model/typhoon.ts";
// 访问后台的接口
import {
  loadStationDetailDataList,
  loadStationStatistics,
  ITyphoonParams4Station
} from "@/api/api.ts";
import { IStats } from "mocha";
import { DatePickerType } from "element-ui/types/date-picker";

@Component({
  components: {
    stationChart,
    DetailTable
  },
  props: {
    // 台风code
    // code: String,
    // 海洋站名称
    // name: String,
    // 选中的测站（含 name——测站名称 与code——台风编号）
    station: Object
  }
})
export default class modal_detail extends mixins(MapRangeVuexMixin) {
  // 菜单列表
  menulist: Array<IMenu> = menulist;
  indexMenu: number = 0;
  // 海洋站的潮位观测数据
  dataObservation: Array<StationAllObservationTide> = [];
  childVals: Array<number> = [];
  // 子echart的实测数组
  childValsReal: Array<number> = [];
  // 子echart的预报数组
  childValsForecast: Array<number> = [];
  childColumns: Array<any> = [];
  childFactor: any = null;
  childTitle: string = "测试测试";

  childTabStationName: string = null;
  childTabMaxVal: number = 0;
  childTabMaxDate: Date = null;
  // code: string;
  // name: string;
  station: IStation;

  showModal(): void {
    $("#mymodal").modal({
      show: true
    });

    // 每次加载modal框时需要销毁echarts子组件
    //   this.$refs.bbxObs.destroyCharts();
  }

  // 读取海洋站的连续观测值
  loadStationData(
    code: string,
    name: string,
    type: MenuType,
    typhoon: MeteorologyRealData_Mid_Model
  ) {
    var myself = this;
    var params = {
      code: code,
      name: name,
      type: type,
      num: typhoon.num
    };
    this.childValsReal = [];
    this.childValsForecast = [];
    // console.log(typhoon);
    loadStationDetailDataList(params).then(res => {
      if (res.status === 200) {
        var data = res.data;
        data.forEach(obj => {
          // TODO:[-] 19-04-21 由于mongo中的时间是时区为0，此处进行了一个加8处理
          // var temp = new StationObservationTide_Mid_Model(
          //   obj.val,
          //   new Date(obj.occurred)
          // );
          // TODO :[*] 19-06-25 此处修改创建的为包含 预报 与 实测 的对象
          var temp = new StationAllObservationTide(
            obj.val_real,
            obj.val_forecast,
            new Date(obj.occurred)
          );
          myself.dataObservation.push(temp);
          // myself.childVals.push(temp.val);
          myself.childValsReal.push(temp.val_real);
          myself.childValsForecast.push(temp.val_forecast);
          myself.childColumns.push(temp.occurred);
        });
        // console.log(myself.dataObservation);
      }
      // console.log(res);
    });
    this.loadStationStatistics(typhoon.num, name);
  }

  // 读取海洋站的主要统计数据（含风暴增水极值以及对应的时间）
  loadStationStatistics(num: string, name: string) {
    var myself = this;

    loadStationStatistics({
      code: num,
      name: name,
      type: MenuType.all,
      num: num
    }).then(res => {
      // console.log(res);
      if (res.status === 200) {
        myself.childTabStationName = name;
        myself.childTabMaxVal = res.data["max_val"];
        myself.childTabMaxDate = new Date(res.data["max_date"]);
      }
    });
  }
  created() {
    // console.log("created");
  }
  // 19-04-25 清空charts的数据
  clearData() {
    this.childVals = [];
    this.childColumns = [];
  }
  mounted() {
    // 由父组件传入的station来控制是否显示modal
    // console.log("mounted");
    // this.loadStationData("5622", "LIUMI", MenuType.real);
    // this.showModal();
  }
  @Watch("dataObservation")
  ondataObservation(val: StationObservationTide_Mid_Model) {
    // this.
  }

  // watch code
  @Watch("station")
  onStation(val: IStation) {
    // 判断code与name是否均被赋值
    var myself = this;
    // console.log("监听到station发生变化");
    // console.log(val);
    //清空charts的数据
    this.clearData();
    // TODO:[*] 19-05-24 同时获取vuex中的targetTyphoon
    var typhoon_temp = myself.targetTyphoon;

    this.loadStationData(val.code, val.stationname, MenuType.all, typhoon_temp);
    this.showModal();
    // if (myself.name != null) {
    //   console.log("坚挺到code与name均发生变化");
    // }
  }
}
</script>


<style scoped>
#modal_content {
  width: 850px;
}
/* TODO: [*] 19-04-21 不知道哪里出来的设置了一个max-width为500px，此处只能暂时覆盖掉 */
.modal-dialog {
  max-width: 2000px;
}
.modal-content {
  /* width: 850px; */
}
.my-content-primary {
  background: #143b4d;
}
.my-th-normal {
  color: #4154de;
}
.my-th-warm {
  color: rgba(255, 0, 0, 0.838);
}
/* 带一个阴影 */
.boxshadow {
  box-shadow: 2px 2px 10px grey;
}
/* 顶部字体加粗加大 */
.panel-heading {
  font-weight: bolder;
  font-size: large;
}
</style>

