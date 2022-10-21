<template>
  <div class="row form-group mt-10" style="margin-top:20px;">
    <div class="col">
      <div class="alert form-group darkback">
        <div class="alert-heading">年份</div>
        <select class="form-control" v-model="yearSelected">
          <option v-for="item in yearList" :key="item">{{item}}</option>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="alert form-group darkback">
        <div class="alert-heading">编码</div>
        <select class="form-control" v-model="codeSelected">
          <option v-for="item in codeList" :key="item.value">{{item.name}}</option>
        </select>
      </div>
    </div>
    <div class="col">
      <div class="alert form-group darkback">
        <div class="alert-heading">观测站</div>
        <select class="form-control" v-model="stationSelected">
          <option v-for="item in stationList" :key="item">{{item}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 关于历史台风查询的父组件
import Vue from "vue";
// 引入第三方组件
import fecha from "fecha";

// 前后端交互的api
import {
  getAllTyphoonYear,
  getAllTyphoonCode,
  getAllObsStation,
  getStationObserveData
} from "@/api/api.js";
import { loadStationDetailDataList,ITyphoonParams4Station } from "@/api/api.ts";
import { MenuType } from '@/common/enum/menu.ts'
export default {
  data() {
    return {
      codeList: [],
      yearList: [],
      stationList: [],
      // 选择的年份
      yearSelected: "",
      // 选择的台风编号（code）
      codeSelected: "",
      // 选择的测站名称
      stationSelected: "",
      // 台风的数字编号（num）
      numSelected: ""
    };
  },
  methods: {
    initYearSelector() {
      let app = this;
      getAllTyphoonYear().then(res => {
        if (res.status == 200 && res.data.length > 0) {
          app.yearList = res.data[0].years;
          if (app.yearList) app.yearList.sort();
          app.yearList = ["请选择", ...app.yearList];
          app.yearSelected = app.yearList[0];
        }
      });
    },

    initCodeSelector() {
      let app = this;
      getAllTyphoonCode(app.yearSelected).then(res => {
        if (res.status == 200) {
          if (res.data instanceof Object) {
            let arr = [];
            for (let name in res.data) {
              arr.push({ name: name, value: res.data[name] });
            }
            //为了让默认选项出现请选择
            app.codeList = [{ name: "请选择" }, ...arr];
            app.codeSelected = "请选择";
          }
        }
      });
    },
    initStationSelector(num) {
      let app = this;
      getAllObsStation(app.yearSelected, num).then(res => {
        if (res.status == 200) {
          if (res.data instanceof Array) {
            let arr = res.data.sort();
            //为了让默认选项出现请选择
            this.stationList = ["请选择", ...arr];
            this.stationSelected = "请选择";
          }
        }
      });
    },

    // 获取查询的数据
    setChart() {
      // TODO:[*] 19-06-13 查询数据修改为之前的api.ts文件中的接口
      getStationObserveData(
        this.yearSelected,
        this.numSelected,
        this.stationSelected
      ).then(res => {
        if (res.status == 200) {
          if (res.data instanceof Array && res.data.length > 0) {
            // TODO:[-] 19-06-13 此方法只是向vuex中写入setCompleteData
            // let arr = res.data[0].realtidedata;

            // arr = arr.sort(x => x.targetdate);
            // // 获取起始的时间 str类型
            // let startdate = fecha.parse(arr[0].targetdate, "YYYY-MM-DD");
            // // startdate
            // let forecastdata = [];
            // let realdata = [];
            // for (let item of arr) {
            //   for (let f of item.forecastdata.forecast_arr) {
            //     forecastdata.push(f);
            //   }
            //   for (let r of item.realdata.realdata_arr) {
            //     realdata.push(r);
            //   }
            // }
            // this.$store.commit("setData", {
            //   forecastdata,
            //   realdata,
            //   startdate
            // });
            this.$store.commit("setCompleteData", res.data[0]);
          }
        }
      });
      var myself=this;
      let pars:ITyphoonParams4Station={
        code:myself.numSelected,
        name:myself.stationSelected,
        type:MenuType.all,
        num:myself.numSelected
      }
      loadStationDetailDataList(pars).then(res => {
        console.log(res);
      });
    }
  },
  watch: {
    yearSelected() {
      this.initCodeSelector();
    },
    codeSelected(data) {
      if (data) {
        let num = this.codeList.filter(x => x.name == data);
        if (num.length > 0) {
          this.numSelected = num[0].value;
          this.$store.state.map.searchNum = this.numSelected;
          this.initStationSelector(num[0].value);
          return;
        }
        this.numSelected = "";
      }
    },
    stationSelected(res) {
      this.$store.state.map.searchStationName = res;
      
      // TODO:[*] 19-06-13 加载echart的数据不在此组件中实现，改为在echart的子组件中加载
      this.setChart();
    }
  },
  mounted() {
    this.initYearSelector();

    //为了一上来就出现请选择，得触发一下，而且也需要预备存储一个请选择的选项，
    //自己写包括加上bootstrap的class也没有出现这种情况，不知道为什么
    this.codeList = [{ name: "请选择" }];
    this.codeSelected = this.codeList[0].name;

    this.stationList = ["请选择"];
    this.stationSelected = this.stationList[0];
  }
};
</script>

<style>
.darkback {
  background: rgba(0, 0, 0, 0.3);
}
</style>
