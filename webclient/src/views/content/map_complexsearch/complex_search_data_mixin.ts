import { Component, Vue } from "vue-property-decorator";
import { DataList_Mid_Model } from "@/middle_model/common.ts";

import { TyphoonLevelOptionMidModel } from "@/middle_model/menu.ts";
// 台风种类下拉框常量
import { OptionList } from "@/common/menu/typhoon_level_option_list.ts";
@Component
export default class MapRangeDataMixin extends Vue {
  level: number = 0;
  wsm: string = "";
  bp: string = "";
  startMonth: Date = null;
  endMonth: Date = null;
  // 当前选中的台风code （英文名称）
  code: string = "";
  num: string = "";
  //当前台风的对应测站数量
  stationNum: number = 0;
  // 搜索栏绑定的台风num
  searchNum: string = "";
  date: string = "";
  // 此属性控制宽度注意
  isDateShow: boolean = false;
  isDetailShow: boolean = false;
  tableData = [];

  // 台风编号的list
  typhoonCodeData = [];
  // 根据复杂查询获取到的台风列表
  typhoonCodeList: Array<DataList_Mid_Model> = [];

  typhoonTimeData = [];
  typhoonDetailData = [];

  // 根据复杂查询返回的台风的list的长度
  typhoonCodeDataTotal: number = 0;
  typhoonTimeDataTotal: number = 0;
  typhoonDetailDataTotal: number = 0;

  typhoonCodePageSize: number = 6;
  typhoonTimeDataPageSize: number = 6;
  typhoonDetailPageSize: number = 6;

  // 复杂查询搜索框中的下拉框相关内容
  typhoonLevelOptions: Array<TyphoonLevelOptionMidModel> = OptionList;
  // 不使用新增的data，使用之前的level
  // selectTyphoonLevelOpt: number = 0;

  // 是否显示复杂搜索框(默认显示)
  isShowComplex: boolean = true;
}
