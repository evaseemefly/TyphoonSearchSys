import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'

// 19-04-18尝试使用超图的开源iclent插件
import { tiledMapLayer, echartsLayer } from '@supermap/iclient-leaflet'

// 引入数据格式规范接口
import { IStation, IEchartsScatterData } from '@/interface/map/map.ts'
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from '@/middle_model/common.ts'

import { MeteorologyRealData_Mid_Model } from '@/middle_model/typhoon.ts'

// TODO:[*] 19-05-05 尝试引用map_range中的mixin（注意可能在主组件中由于重复引入了同一个mixin不知会不会出现重复引用的问题）
import MapRangeDataMixin from '../map_range/map_data_mixin'
import MapBaseDataMixin from '../map_base/map_base_data_mixin'
/**
 * 部分地图公用的方法
 * 现在只包含底图与echart的叠加显示的方法放在此处
 * @export
 * @class MapCommonMixin
 * @extends {Vue}
 */
@Component
export default class MapCommonMixin extends mixins(
  MapRangeDataMixin,
  MapBaseDataMixin
) {
  //初始化echarts——散点图
  // TODO:[*] 19-07-02 将map_common_mixin中的部分方法（注意是方法），放在此处，以后map_common_mixin.ts废弃
  // TODO:[*] 19-05-22 散点图存在一个偏移
  // initCharts(): void {
  //   var myself = this
  //   if (myself.layer_scatter != null) {
  //     myself.layer_scatter.remove()
  //   }
  //   // 使用leaflet-echarts的步骤：不需要修改leaflet代码的部分，只需要将leaflet创建好的map作为参数传入
  //   var mymap: any = this.$refs.basemap['mapObject']
  //   var echartsOptions: any = {
  //     title: {
  //       text: '潮位',
  //       subtext: '潮位',
  //       // sublink: "http://www.pm25.in",
  //       left: 'center'
  //     },
  //     tooltip: {
  //       trigger: 'item'
  //     },
  //     coordinateSystem: 'leaflet',
  //     series: [
  //       {
  //         name: '潮位',
  //         type: 'scatter',
  //         coordinateSystem: 'leaflet',
  //         // coordinateSystem: "geo",
  //         // data: myself.convertData(myself.data_echarts),
  //         // [-] 19-04-18 散点图中的data绑定为model
  //         data: myself.data_scatter_station,
  //         // [-] 19-04-23 散点图的大小
  //         symbolSize: function(val) {
  //           return myself.getSymbolSize(val)
  //         },
  //         hoverAnimation: true,
  //         label: {
  //           normal: {
  //             formatter: '{b}',
  //             position: 'right',
  //             show: false
  //           },
  //           emphasis: {
  //             show: true
  //           }
  //         },
  //         itemStyle: {
  //           normal: {
  //             color: '#ddb926'
  //           }
  //         }
  //       },
  //       {
  //         name: 'Top 5',
  //         type: 'effectScatter',
  //         coordinateSystem: 'leaflet',
  //         // [-] 19-04-18 散点图中的data绑定为model
  //         data: myself.data_scatter_station,
  //         symbolSize: function(val) {
  //           return myself.getSymbolSize(val)
  //         },
  //         showEffectOn: 'render',
  //         rippleEffect: {
  //           brushType: 'stroke'
  //         },
  //         hoverAnimation: true,
  //         label: {
  //           normal: {
  //             formatter: '{b}',
  //             position: 'right',
  //             show: true
  //           }
  //         },
  //         itemStyle: {
  //           normal: {
  //             // color: "#f4e925",
  //             color: 'rgb(51, 152, 125)',
  //             shadowBlur: 10,
  //             shadowColor: '#333'
  //           }
  //         },
  //         zlevel: 1
  //       }
  //     ]
  //   }
  //   var options: any = {
  //     // 水印
  //     attribution: 'nmefc '
  //   }
  //   // echartsLayer可选择的options
  //   // 参考：http://iclient.supermap.io/web/apis/leaflet.html
  //   var echarts_scatter = echartsLayer(echartsOptions, options)
  //   myself.layer_scatter = echarts_scatter
  //   myself.layer_scatter.addTo(mymap)
  // }
  // // 19-04-23 对于散点图的大小的转换
  // // index=0:max;inde=1:min
  // transformScatterSize(): number[] {
  //   /*
  //        */
  //   var arr_val = []
  //   this.data_scatter_station.forEach(obj => {
  //     if (obj.value[2] !== -9999) {
  //       arr_val.push(obj.value[2])
  //     }
  //   })
  //   var max = Math.max(...arr_val)
  //   var min = Math.min(...arr_val)
  //   return [max, min]
  // }
  // // 19-04-23 对于散点图的大小的转换
  // getSymbolSize(val: any): number {
  //   var myself = this
  //   //index=0:max;inde=1:min
  //   var arr_maxmin = myself.transformScatterSize()
  //   var max = arr_maxmin[0]
  //   var min = arr_maxmin[1]
  //   var val_temp = val[2]
  //   // 系数
  //   var factor_percent = 200
  //   var factor_magnify = 3
  //   if (val !== -9999) {
  //     var count = max - min
  //     var maxValue = max - min - min / count
  //     var percent = Math.floor(((val_temp - min) / count) * factor_percent)
  //     percent = Math.sqrt(percent)
  //     return percent * factor_magnify
  //     // return percent * factor;
  //     // var maxSize = 100;
  //     // var scale = 1;
  //     // if (maxSize) {
  //     //   scale = maxValue / maxSize;
  //     // }
  //     // return (val[2] - min - min / count) / scale;
  //   } else {
  //     return 0
  //   }
  // }
}
