<template>
  <div id="typhoon_base" class="col-md-3">
    <div class="typhoon-total-header">
      <div class="sort col-md-2">01</div>
      <div class="total-title col-md-10">台风基础信息</div>
    </div>
    <div class="typhoon-total-body">
      <div class="area">
        <div class="base-info u-lof2">
          <div class="title">{{typhoonName}}</div>
          <div class="data my-font-contrast">{{typhoonNum}}|{{typhoonName}}</div>
        </div>
        <div class="base-info u-lof2">
          <div class="title">登录地点</div>
          <!-- <div class="data my-font-contrast">陆丰</div> -->
        </div>
      </div>
      <div class="area line">
        <div class="base-info">
          <div class="title">最大风力</div>
          <div class="data my-font-primary">12级</div>
        </div>
        <div class="base-info">
          <div class="title">最大风速</div>
          <div class="data my-font-primary">{{ws}} m/s</div>
        </div>
        <div class="base-info">
          <div class="title">中心气压</div>
          <div class="data my-font-primary">{{bp}} hPa</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

// 前后端交互api
import { getRealDataMws, getRealDataMbp } from "@/api/api.js";
@Component({})
// export default class SearchByStationMenu_Stations extends Vue {
export default class rightBarDetail extends Vue {
  // 气压
  bp: number = -999;
  // 最大风速
  ws: number = -999;
  // 台风编号
  @Prop(String) typhoonNum: string;

  //台风名称
  @Prop(String) typhoonName: string;

  // 根据传入的台风num加载台风的最大风速及气压
  loadTyphoonDetail(num: string): void {
    var myself = this;
    /*
      请求的地址
      gis/data/GetRealDataMws/?num=1407
      gis/data/GetRealDataMbp/?num=1407
    */
    getRealDataMws(num).then(res => {
      // this.ws = res;
      // console.log(this.ws);
      if (res.status === 200) {
        myself.ws = res.data.mws;
        console.log(myself.bp);
      }
    });
    getRealDataMbp(num).then(res => {
      if (res.status === 200) {
        myself.bp = res.data.mbp;
        console.log(myself.bp);
      }
    });
  }

  @Watch("typhoonNum")
  onTyNum(val) {
    this.loadTyphoonDetail(val);
    // console.log(val);
  }
}
</script>

<style scoped>
#typhoon_base {
  z-index: 1500;
  position: fixed;
  top: 150px;
  right: 20px;
  display: flex;
  flex-direction: column;
  /* background: linear-gradient(
          to right,
          #8bb8b7 30%,
          rgba(88, 171, 177, 0.639)
        ); */
  /* background: linear-gradient(
          to right,
          #bbc2d3 30%,
          rgba(73, 102, 145, 0.639)
        ); */
  background: linear-gradient(
    to right,
    #c6cad5 30%,
    rgba(176, 191, 211, 0.639)
  );
  font-size: 90%;
  padding: 0px;
  padding-bottom: 15px;
  /* text-shadow: 2px 2px 8px rgb(33, 32, 32); */
  border-top-left-radius: 15px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 2px 2px 10px rgb(109, 96, 96);
}
#typhoon_base .typhoon-total-header .total-title {
  color: black !important;
  text-shadow: -1px 1px -5px rgb(33, 32, 32) !important;
}

#typhoon_base .typhoon-total-header {
  display: flex;
  flex-direction: row;
}
#typhoon_base .typhoon-total-header .sort {
  /* width: 25%; */
  flex: 1;
  background: rgba(10, 10, 167, 0.653);
  color: white;
  font-size: 120%;
  font-weight: 800;
  border-top-left-radius: 15px;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}

#typhoon_base .typhoon-total-header .total-title {
  /* width: 70%; */
  flex: 9;
  color: aliceblue;
  font-size: 110%;
  font-weight: 800;
  /* text-shadow: 2px 2px 8px rgb(33, 32, 32); */
}
#typhoon_base .typhoon-total-body {
  display: flex;
  flex-direction: row;
}
#typhoon_base .typhoon-total-body .area {
  display: flex;
  flex-direction: column;
  width: 50%;
}
#typhoon_base .typhoon-total-body .area .base-info {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
}
#typhoon_base .typhoon-total-body .area .base-info .title {
  flex: 1;
  font-size: 90%;
  font-weight: 500;
  color: aliceblue;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
  /* color: #b7d7d6dd; */
}
#typhoon_base .typhoon-total-body .area .base-info .data {
  flex: 2;
  display: flex;
  /* 主轴对其方式 */
  justify-content: center;
  /* 交叉轴对其方式 */
  align-items: center;
  font-size: 120%;
  font-weight: 600;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}
.my-font-primary {
  color: rgb(255, 255, 255);
}
.my-font-contrast {
  color: rgb(206, 201, 45);
}
.line {
  border-left-style: solid;
  /* border-color: blue; */
}
.u-lof2 {
  flex: 1;
  /* background: rgba(0, 128, 0, 0.42); */
}
</style>
