import { Component, Vue } from 'vue-property-decorator'
import { LatLng } from 'leaflet'
// 引入数据格式规范接口
import { IStation, IEchartsScatterData } from '@/interface/map/map.ts'
import { TyphoonRealBase_Mid_Model } from '@/middle_model/common.ts'

import { MeteorologyRealData_Mid_Model } from '@/middle_model/typhoon.ts'

@Component
export default class MapRangeVuexMixin extends Vue {
  //  由rangeSlider通过vuex传过来的range
  get range(): number {
    return this.$store.state.map.range
  }

  //  当前选择的台风（由vuex获取）
  get targetTyphoon(): MeteorologyRealData_Mid_Model {
    return this.$store.state.map.typhoon
  }

  //  当前选择的 台风实时model(由vuex获取)
  get targetTyphoonRealBase(): TyphoonRealBase_Mid_Model {
    return this.$store.state.map.typhoonRealBase
  }

  //  更改当前的 台风实时model(存在vuex中)
  set targetTyphoonRealBase(val: TyphoonRealBase_Mid_Model) {
    this.$store.commit('typhoonRealBase', val)
  }
}
