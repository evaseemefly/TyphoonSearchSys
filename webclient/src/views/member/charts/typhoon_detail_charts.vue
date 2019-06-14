<template>
  <div
    class="alert"
    style="background:rgba(255,255,255,0.5)"
  >
    <div id="dataChart"></div>
  </div>
</template>

<script lang="ts">
import echarts from "echarts";
import Vue from "vue";
// import Store from "@/store/complicateSearchStore";
// import { mapGetters, mapState } from "vuex";
import Vuex from "vuex";

// 第三方组件
import fecha from "fecha";
import {
  loadStationDetailDataList,
  ITyphoonParams4Station
} from "@/api/api.ts";
import { MenuType } from "@/common/enum/menu.ts";
// 历史台风查询中的台风charts
export default {
  data() {
    return {
      chartEle: {},
      chart: {}
      // name: null,
      // num: null
    };
  },
  // computed: mapState({
  //   displayData: state => state.displayData
  // }),
  computed: {
    displayData() {
      return this.$store.state.map.displayData;
    },
    searchStationName() {
      return this.$store.state.map.searchStationName;
    }
  },
  watch: {
    displayData() {
      let data = this.$store.state.map.displayData;
      if (!data) return data;
      this.initChart(data);
    },
    searchStationName() {
      let searchNum = this.$store.state.map.searchNum;
      let searchStationName = this.$store.state.map.searchStationName;
      // this.num=searchNum;
      // this.name=searchStationName;
      console.log({
        searchNum,
        searchStationName
      });
      // 根据num与name加载echart表
      if (searchNum != null && searchStationName != null) {
        this.loadData(searchNum, searchStationName);
      }
    }
  },
  methods: {
    // 根据num与测站名称name加载realdate与forcastdata
    loadData(num: string, name: string): void {
      var myself = this;
      let pars: ITyphoonParams4Station = {
        code: num,
        name: name,
        type: MenuType.all,
        num: num
      };
      loadStationDetailDataList(pars).then(res => {
        // console.log(res);
        if (res.status === 200) {
          myself.initChart(res.data);
        }
      });
    },
    initChart(data) {
      // 以下由于后台修改暂时注释掉
      // let forecastdata = data.forecastdata;
      // let realdata = data.realdata;
      // // 获取起始时间
      // let startDate = data.startdate;
      // TODO:[*] 19-06-13 后端进行修改后返回的是一个混合的model，包含（occurred，val_forecast，val_real）
      let listForecast: Array<number> = [];
      let listReal: Array<number> = [];
      let listDate: Array<string> = [];
      data.forEach(obj => {
        listForecast.push(obj.val_forecast);
        listReal.push(obj.val_real);
        //2014-06-16T00:00:00Z
        // console.log(fecha.parse(obj.occurred, "YYYY-MM-DD hh:mm"));
        listDate.push(fecha.format(new Date(obj.occurred), "YY-MM-DD hh:mm"));
      });
      // this.initDateList(startDate);
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
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#d0e836c9"
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
          },
          data: listDate
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
            data: listForecast,
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
                }
              }
            }
            // label: {
            //   normal: {
            //     show: true
            //   }
            // }
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
            data: listReal,
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
                }

                // label: {
                //   show: true //显示每个点的值
                // }
              }
            }
            // label: {
            //   normal: {
            //     show: true
            //   }
            // }
          }
        ]
      };

      this.chart.setOption(option);
    },
    // 根据传入的起始时间获取往后推4天的时间列表
    initDateList(startdate: Date): Array<Date> {
      var listDate = [];
      let i = 0;
      do {
        let tempDate = startdate;
        var finalDate = tempDate.setTime(
          tempDate.setHours(tempDate.getHours() + i)
        );
        listDate.push(finalDate);
        i++;
      } while (i < 97);
      return listDate;
      // for (; i < 73; i++) {
      //   var tempDate=startdate
      //   tempDate.setTime(tempDate.setHours(tempDate.getHours()+i))
      // }
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
  /* background: rgba(49, 208, 55, 0.851); */
}
</style>
