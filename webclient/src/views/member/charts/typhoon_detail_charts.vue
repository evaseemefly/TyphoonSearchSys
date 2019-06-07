<template>
  <div class="alert" style="background:rgba(255,255,255,0.5)">
    <div id="dataChart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import Vue from "vue";
// import Store from "@/store/complicateSearchStore";
// import { mapGetters, mapState } from "vuex";
import Vuex from "vuex";

// 历史台风查询中的台风charts
export default {
  data() {
    return {
      chartEle: {},
      chart: {}
    };
  },
  // computed: mapState({
  //   displayData: state => state.displayData
  // }),
  computed: {
    displayData() {
      return this.$store.state.map.displayData;
    }
  },
  watch: {
    displayData() {
      let data = this.$store.state.map.displayData;
      if (!data) return data;
      this.initChart(data);
    }
  },
  methods: {
    initChart(data) {
      let forecastdata = data.forecastdata;
      let realdata = data.realdata;
      var option = {
        xAxis: {
          type: "category"
          // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value",
          scale: true
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            smooth: true,
            data: forecastdata
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            smooth: true,
            data: realdata
          }
        ]
      };

      this.chart.setOption(option);
    }
  },
  mounted() {
    this.chartEle = document.getElementById("dataChart");
    this.chart = echarts.init(this.chartEle);
  }
};
</script>

<style>
#dataChart {
  height: 400px;
}
</style>
