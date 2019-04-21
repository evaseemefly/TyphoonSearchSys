<template>
  <div
    id="mymodal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
  >
    <div
      id="modal_content"
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          ><span aria-hidden="true">&times;</span></button>
          <!-- <h4 class="modal-title">船舶编号{{}}</h4> -->
        </div>
        <div class="modal-body my-content-primary">
          <div>
            <!-- <bbxDetailTable :bid="bid"></bbxDetailTable> -->
            <ul
              id="mytabs"
              class="nav nav-tabs"
            >
              <li
                v-for="(item,index) in menulist"
                :key=index
                role="presentation"
                :class="{active:index===indexMenu}"
              >
                <a
                  href="#"
                  @click="active(index)"
                >{{item.name}}</a>
              </li>
            </ul>
            <!-- <div
              id="main"
              style=""
            ></div> -->
            <stationChart
              :columns="childColumns"
              :values="childVals"
              :title="childTitle"
              :factor="childFactor"
              ref="stationObs"
            ></stationChart>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-default"
            data-dismiss="modal"
          >关闭</button>
          <button
            type="button"
            class="btn btn-primary"
          >确定</button>
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
import { menulist } from "@/common/menu/station_detail_tab_list.ts";
import { IMenu } from "@/interface/menu/menu.ts";
//引入枚举
import { MenuType } from "@/common/enum/menu.ts";
// 引入子组件
import stationChart from "@/views/member/charts/station_detail_charts.vue";
// 尝试引入boostrap
import "bootstrap";
// 引入中间变量
import { StationObservationTide_Mid_Model } from "@/middle_model/typhoon.ts";
// 访问后台的接口
import {
  loadStationDetailDataList,
  ITyphoonParams4Station
} from "@/api/api.ts";

@Component({
  components: {
    stationChart
  }
})
export default class modal_detail extends Vue {
  // 菜单列表
  menulist: Array<IMenu> = menulist;
  indexMenu: number = 0;
  // 海洋站的潮位观测数据
  dataObservation: Array<StationObservationTide_Mid_Model> = [];
  childVals: Array<number> = [];
  childColumns: Array<any> = [];
  childFactor: any = null;
  childTitle: string = "测试测试";

  showModal(): void {
    $("#mymodal").modal({
      show: true
    });

    // 每次加载modal框时需要销毁echarts子组件
    //   this.$refs.bbxObs.destroyCharts();
  }

  // 读取海洋站的连续观测值
  loadStationData(code: string, name: string, type: MenuType) {
    var myself = this;
    var params = {
      code: code,
      name: name,
      type: type
    };

    loadStationDetailDataList(params).then(res => {
      if (res.status === 200) {
        var data = res.data;
        data.forEach(obj => {
          // TODO:[*] 19-04-21 由于mongo中的时间是时区为0，此处进行了一个加8处理
          var temp = new StationObservationTide_Mid_Model(
            obj.val,
            new Date(obj.occurred)
          );
          myself.dataObservation.push(temp);
          myself.childVals.push(temp.val);
          myself.childColumns.push(temp.occurred);
        });
        // console.log(myself.dataObservation);
      }
      // console.log(res);
    });
  }
  created() {
    // console.log("created");
  }
  mounted() {
    // console.log("mounted");
    this.loadStationData("5622", "LIUMI", MenuType.real);
    this.showModal();
  }
  @Watch("dataObservation")
  ondataObservation(val: StationObservationTide_Mid_Model) {
    // this.
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

