import { Component, Vue } from "vue-property-decorator";
import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";

@Component
export default class MapRangeDataMixin extends Vue {
  level: string = "";
  wsm: string = "";
  bp: string = "";
  startMonth: Date = null;
  endMonth: Date = null;
  // 当前选中的台风code （英文名称）
  code: string = "";
  num: string = "";
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
}
