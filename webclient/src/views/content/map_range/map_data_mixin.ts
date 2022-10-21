import { Component, Vue } from 'vue-property-decorator'
import L, { LatLng } from 'leaflet'
// 引入数据格式规范接口
import { IStation, IEchartsScatterData } from '@/interface/map/map.ts'
import { DataList_Mid_Model } from '@/middle_model/common.ts'

import { MeteorologyRealData_Mid_Model } from '@/middle_model/typhoon.ts'
/**
 * 所有map有关的data放在此处
 *
 * @export
 * @class MapRangeDataMixin
 * @extends {Vue}
 */
@Component
export default class MapRangeDataMixin extends Vue {
  // TODO:[*] 19-05-13 此处与 member/secondBar/typhoon_list_bar/typhoon_list_bar_data_mixin.ts中的data相同（是否可以直接mixin此ts？）
  // 总的数据长度
  typhoonCodeDataTotal: number = -1
  // 页容积
  typhoonCodePageSize: number = 10
  typhoonCodePageIndex: number = -1
  is_show_typhoon_list: boolean = false
  typhoon_code_list: Array<DataList_Mid_Model> = []
}
