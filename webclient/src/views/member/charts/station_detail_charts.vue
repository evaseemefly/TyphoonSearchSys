<template>
  <div>
    <!-- <p>{{mytest}}</p> -->
    <div id="main"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import $ from "jquery";
import echarts from "echarts";
//引入fecha格式化时间
import fecha from "fecha";
// const $ = require('jquery')
// window.$ = $
// require('jquery-confirm')

// import { loadRealtime } from '../../../api/api.js';
// var echarts = require('echarts')
@Component({
  props: {
    // title
    title: String,
    // 列数据
    columns: Array,
    // values
    values: Array,
    factor: String
  }
})
export default class station_detail_charts extends Vue {
  mychart: any;
  // title
  title: string;
  // 列数据
  columns: any;
  // values
  values: any;
  factor: string;
  // 销毁echarts
  disposeCharts() {
    if (this.mychart != null) {
      this.mychart.dispose();
    }
  }
  // 初始化echarts表格
  initCharts() {
    // 基于准备好的dom，初始化echarts图表
    var myself = this;
    myself.mychart = null;
    this.disposeCharts();
    if (myself.mychart === null) {
    }
    myself.mychart = echarts.init(document.getElementById("main"));

    // this.values = [];
    // this.columns = [];
    // console.log(params);
    //				var myChartContent=echarts.init(document.getElementById('bar_content'));
    //		var myBar = echarts.init(document.getElementById('mybar'));
    var option = {
      tooltip: {
        show: true
      },
      legend: {
        data: [myself.title]
      },
      xAxis: [
        {
          type: "category",

          data: myself.columns2format,
          //使用以下方式实现显示全部x坐标上的点
          axisLabel: {
            //interval: 0,
            textStyle: {
              color: "#FFFFFF"
            }
          }

          //                  interval:0
        }
      ],
      yAxis: [
        {
          // min: function () {
          //   let min = Math.min(myself.values)
          //   return min;
          // },
          type: "value",
          scale: myself.factor == "bp",
          axisLabel: {
            //					interval: 0,
            textStyle: {
              color: "#FFFFFF"
            }
            // formatter: function (value, index) {
            //   return value.toFixed(2);
            // }
          }
        }
      ],
      series: [
        {
          name: myself.title, //需要与legend中的data相同
          type: "line",
          smooth: true, //不是折线，是曲线
          itemStyle: {
            normal: {
              //设置折点的颜色
              color: "rgb(189, 196, 56)",
              //注意lineStyle需要卸载normal里面
              //自定义折线颜色
              lineStyle: {
                color: "#00FF00"
              },
              //自定义折线下区域的颜色
              areaStyle: {
                color: "rgb(56, 196, 147)"
              },

              label: {
                show: true //显示每个点的值
              }
            }
          }, //向下填充区域
          data: myself.value2format,
          label: {
            normal: {
              show: true
            }
          }
        }
      ]
    };

    // 加入是否为wd或ws的判断
    if (myself.factor === "ws" || myself.factor === "wd") {
      // option.series['symbol'] = 'triangle';
      option.series[0]["symbolSize"] = [40, 20];
      // option.series['symbol'] = 'image:../../../../../assets/common/arrows.png'
      // 注意由于此处已经嵌套了一级的路由，所以使用绝对路径，需要先返回上一级才是实际的public根目录
      // option.series[0]['symbol'] = 'image://../common/arrows.png'
    } else {
      option.series[0]["symbol"] = "circle";
      option.series[0]["symbolSize"] = 8;
    }

    // 为echarts对象加载数据
    myself.mychart.setOption(option);

    this.slideDown();
  }
  //销毁echarts表格
  destroyCharts() {
    this.slideUp();
  }
  // 下拉
  slideDown() {
    $("#main").slideDown("slow");
  }
  // 收起
  slideUp() {
    $("#main").slideUp("slow");
  }

  mounted() {
    // this.slideUp();
    this.initCharts();
  }

  @Watch("values")
  onValues(val) {
    // 每次当values发生变化时，判断当前的values长度是否大于0，大于零则加载echarts
    var myself = this;
    if (myself.values.length > 0) {
      this.initCharts();
    }
    // console.log("发生变化");
  }

  // computed
  get columns2format() {
    var myself = this;
    var columns_format = [];
    myself.columns.forEach(obj => {
      columns_format.push(fecha.format(obj, "MM-DD HH:mm"));
    });
    return columns_format;
  }

  // 对于values进行一个过滤剔除掉缺省值
  get value2format() {
    var myself = this;
    var vals_format = [];
    myself.values.forEach(obj => {
      if (obj === -9999) {
        vals_format.push(null);
      } else {
        vals_format.push(obj);
      }
    });
    return vals_format;
  }

  // 对于每一个columns由于是date类型，所以只保留 mm-dd HH-mm即可
}
// watch: {
//   values: function (newVal) {
//     // console.log(newVal);
//     var myself = this;
//     if (newVal.length > 0) {
//       this.initCharts();
//     }

//   }
// }
</script>

<style scoped>
#main {
  height: 500px;
  width: 800px;
}
</style>
