<template>
  <div id="chart_container" class="alert" style="background:rgba(255,255,255,0.5)">
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
      chart: {},
      listReal: [],
      listForecast: [],
      listDate: []
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
    },
    real2format() {
      var myself = this;
      var vals_format = [];
      myself.listReal.forEach(obj => {
        if (obj === -9999) {
          vals_format.push(null);
        } else {
          vals_format.push(obj);
        }
      });
      return vals_format;
    },
    forecast2format() {
      var myself = this;
      var vals_format = [];
      myself.listForecast.forEach(obj => {
        if (obj === -9999) {
          vals_format.push(null);
        } else {
          vals_format.push(obj);
        }
      });
      return vals_format;
    },
    difference2format() {
      var myself = this;
      var vals_format = [];
      for (var i = 0; i < myself.listForecast.length; i++) {
        if (myself.listReal[i] === -9999 || myself.listForecast[i] === -9999) {
          vals_format.push(null);
        } else {
          vals_format.push(myself.listReal[i] - myself.listForecast[i]);
        }
      }
      return vals_format;
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
      // console.log({
      //   searchNum,
      //   searchStationName
      // });
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
      var myself = this;
      // let listForecast: Array<number> = [];
      // let listReal: Array<number> = [];
      // let listDate: Array<string> = [];
      myself.listForecast = [];
      myself.listReal = [];
      myself.listDate = [];
      data.forEach(obj => {
        myself.listForecast.push(obj.val_forecast);
        myself.listReal.push(obj.val_real);
        //2014-06-16T00:00:00Z
        // console.log(fecha.parse(obj.occurred, "YYYY-MM-DD hh:mm"));
        myself.listDate.push(
          fecha.format(new Date(obj.occurred), "MM-DD HH:mm")
        );
      });
      // this.initDateList(startDate);
      var option = {
        legend: {
          data: ["天文潮", "实测潮位"]
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
          data: myself.listDate
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
            data: myself.forecast2format,
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
          },
          {
            name: "实测潮位",
            type: "line",
            stack: "总量",
            smooth: true,
            data: myself.real2format,
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
              }
            }
          },
          {
            name: "风暴增水", //需要与legend中的data相同
            type: "line",
            smooth: true, //不是折线，是曲线
            itemStyle: {
              normal: {
                //设置折点的颜色
                color: "rgba(225, 110, 61, 0.735)",
                //注意lineStyle需要卸载normal里面
                //自定义折线颜色
                lineStyle: {
                  color: "rgba(223, 48, 17, 0.735)"
                },
                //自定义折线下区域的颜色
                areaStyle: {
                  color: "rgba(189, 94, 11, 0.735)"
                }
              }
            }, //向下填充区域
            data: myself.difference2format
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
    },
    setContainerHeight() {
      let body = document.body;
      let height = body.clientHeight;
      // 找到在echart div外侧的容器div
      var container = document.getElementById("chart_container");
      container.style.height = Math.ceil(height * 0.66) + "px";
    },
    setHeight() {
      //动态设定chart's constainer高度,.65系数看着给的没那么精细，毕竟两个row的高度没那么好算，写死也听傻的还不如就这样，而且硬设高度alert设定的是文字，不是内容也不太好算
      let body = document.body;
      let height = body.clientHeight;
      this.chartEle.style.height = Math.ceil(height * 0.65) + "px";
      // TODO:[-] 19-07-04 注意此处修改了echart的高度之后需要通知左边的 map 组件可以加载了！
      this.$store.state.chart.isStaticEchartsShow = true;
    }
  },
  mounted() {
    this.chartEle = document.getElementById("dataChart");
    this.setHeight();
    this.chart = echarts.init(this.chartEle);
  },
  created() {
    // this.setHeight();
    console.log("created");
    // 每次创建时，需要设置 chart的isShow为false（注意！）
    this.$store.state.chart.isStaticEchartsShow = false;
  },
  beforeCreate() {
    console.log("beforecreate");
    // this.setHeight();
  },
  beforeMount() {
    console.log("beforceMount");
    // this.setContainerHeight();
  }
};
</script>

<style>
#dataChart {
  /* height: 0px;
  padding-bottom: 79%; */

  /* background: rgba(49, 208, 55, 0.851); */
}
</style>
