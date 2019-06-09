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
          <option v-for="item in codeList" :key="item">{{item.name}}</option>
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

<script>
// 关于历史台风查询的父组件
import Vue from "vue";

import {
  getAllTyphoonYear,
  getAllTyphoonCode,
  getAllObsStation,
  getStationObserveData
} from "@/api/api.js";

export default {
  data() {
    return {
      codeList: [],
      yearList: [],
      stationList: [],
      yearSelected: "",
      codeSelected: "",
      stationSelected: "",
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
        }
      });
    },

    initCodeSelector() {
      let app = this;
      getAllTyphoonCode(app.yearSelected).then(res => {
        if (res.status == 200) {
          //app.codeList = res.data.filter(x => x != "(nameless)");
          //if (app.codeList) app.codeList.sort();

          if (res.data instanceof Object) {
            let arr = [];
            for (let name in res.data) {
              arr.push({ name: name, value: res.data[name] });
            }
            app.codeList = arr;
          }
        }
      });
    },
    initStationSelector(num) {
      let app = this;
      getAllObsStation(app.yearSelected, num).then(res => {
        if (res.status == 200) {
          // var store = new Vuex.Store({
          //   state: {
          //     msg: 123
          //   }
          // });
          if (res.data instanceof Array) {
            this.stationList = res.data.sort();
          }
          // var data = {
          //   forecastdata: [1, 2, 3, 4, 5, 6, 7, 9],
          //   realdata: [4, 5, 6, 7, 7, 8, 9, 0, 10]
          // };
          // this.$store.commit("setData", data);
        }
      });
    },
    setChart() {
      getStationObserveData(
        this.yearSelected,
        this.numSelected,
        this.stationSelected
      ).then(res => {
        if (res.status == 200) {
          if (res.data instanceof Array && res.data.length > 0) {
            let arr = res.data[0].realtidedata;

            arr = arr.sort(x => x.targetdate);
            let forecastdata = [];
            let realdata = [];
            for (let item of arr) {
              for (let f of item.forecastdata.forecast_arr) {
                forecastdata.push(f);
              }
              for (let r of item.realdata.realdata_arr) {
                realdata.push(r);
              }
            }
            this.$store.commit("setData", { forecastdata, realdata });
            this.$store.commit("setCompleteData", res.data[0]);
          }
        }
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
          this.initStationSelector(num[0].value);
          return;
        }
        this.numSelected = "";
      }
    },
    stationSelected(res) {
      this.setChart();
    }
  },
  mounted() {
    this.initYearSelector();
  }
};
</script>

<style>
.darkback {
  background: rgba(0, 0, 0, 0.3);
}
</style>
