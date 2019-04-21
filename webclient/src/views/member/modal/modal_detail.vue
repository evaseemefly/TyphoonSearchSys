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
import stationChart from "@/views/member/charts/station_detail_charts.vue";
// 尝试引入boostrap
import "bootstrap";

@Component({
  components: {
    stationChart
  }
})
export default class modal_detail extends Vue {
  // 菜单列表
  menulist: Array<IMenu> = menulist;
  indexMenu: number = 0;

  childVals: []=[];
  childColumns: []=[];
  childFactor: any = null;
  childTitle: string = "测试测试";

  showModal(): void {
    $("#mymodal").modal({
      show: true
    });

    // 每次加载modal框时需要销毁echarts子组件
    //   this.$refs.bbxObs.destroyCharts();
  }
  created() {
    console.log("created");
  }
  mounted() {
    console.log("mounted");
    this.showModal();
  }
}
</script>


<style scoped>
#modal_content {
  width: 850px;
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

