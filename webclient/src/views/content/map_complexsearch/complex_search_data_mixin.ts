import { Component, Vue } from "vue-property-decorator";

@Component
export default class MapRangeDataMixin extends Vue {
    level: string = ""
    wsm: string = ""
    bp: string = ""
    startMonth: Date = null
    endMonth: Date = null
    code: string = ""
    date: string = ""
    isDateShow: boolean = false
    isDetailShow: boolean = false
    tableData = []
    typhoonCodeData = []
    typhoonTimeData = []
    typhoonDetailData = []

    typhoonCodeDataTotal: number = 0
    typhoonTimeDataTotal: number = 0
    typhoonDetailDataTotal: number = 0

    typhoonCodePageSize: number = 6
    typhoonTimeDataPageSize: number = 6
    typhoonDetailPageSize: number = 6
}