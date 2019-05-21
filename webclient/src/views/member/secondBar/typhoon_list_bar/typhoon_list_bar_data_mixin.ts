import { Component, Vue } from "vue-property-decorator";

// 切记mixin对象需要加入component装饰器
@Component
export default class TyphoonListBarDataMixin extends Vue {
    code: string = "";
    currenIndex: number;
    // // 总的数据长度
    // typhoonCodeDataTotal: number = 10;
    // // 页容积
    // typhoonCodePageSize: number = 10;
    // typhoonCodePageChange: number = 0;
}