<template>
  <div
    class="alert"
    style="background:rgba(255,255,255,0.5)"
  >
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
  data () {
    return {
      chartEle: {},
      chart: {}
    };
  },
  // computed: mapState({
  //   displayData: state => state.displayData
  // }),
  computed: {
    displayData () {
      return this.$store.state.map.displayData;
    }
  },
  watch: {
    displayData () {
      let data = this.$store.state.map.displayData;
      if (!data) return data;
      this.initChart(data);
    }
  },
  methods: {
    initChart (data) {
      let forecastdata = data.forecastdata;
      let realdata = data.realdata;
      var option = {
        legend: {
          data: ["天文潮位", "实测潮位"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#d0e836c9'
            }
          }
        },
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          axisLabel: {
            //interval: 0,
            textStyle: {
              color: "#FFFFFF"
            }
          }
          // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value",
          scale: true,
          axisLabel: {
            //					interval: 0,
            textStyle: {
              color: "#FFFFFF"
            }
          }
        },
        series: [
          {
            name: "天文潮位",
            type: "line",
            stack: "总量",
            smooth: true,
            data: forecastdata,
            // areaStyle: {},
            itemStyle: {
              normal: {
                //设置折点的颜色
                color: "rgb(189, 196, 56)",
                //注意lineStyle需要卸载normal里面
                //自定义折线颜色
                lineStyle: {
                  color: "rgba(49, 208, 55, 0.851)"
                },
                //自定义折线下区域的颜色
                areaStyle: {
                  color: "rgba(18, 147, 97, 0.851)"
                },

                // label: {
                //   show: true //显示每个点的值
                // }
              }
            },
            label: {
              normal: {
                show: true
              }
            }
            // label: {
            //   normal: {
            //     show: true
            //   }
            // }
          },
          {
            name: "实测潮位",
            type: "line",
            stack: "总量",
            smooth: true,
            data: realdata,
            itemStyle: {
              normal: {
                //设置折点的颜色
                color: "rgb(189, 196, 56)",
                //注意lineStyle需要卸载normal里面
                //自定义折线颜色
                lineStyle: {
                  color: "rgba(39, 117, 199, 0.851)"
                },
                //自定义折线下区域的颜色
                areaStyle: {
                  color: "rgba(61, 155, 162, 0.851)"
                },

                // label: {
                //   show: true //显示每个点的值
                // }
              }
            },
            // label: {
            //   normal: {
            //     show: true
            //   }
            // }
          }
        ]
      };

      this.chart.setOption(option);
    }
  },
  mounted () {
    this.chartEle = document.getElementById("dataChart");
    this.chart = echarts.init(this.chartEle);
  }
};
</script>

<style>
#dataChart {
  height: 400px;
  /* background: rgba(49, 208, 55, 0.851); */
}
</style>
