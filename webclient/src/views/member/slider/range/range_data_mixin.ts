import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/**
 * range的data拆分
 *
 * @export
 * @class RangeDataMixin
 * @extends {Vue}
 */
@Component
export default class RangeDataMixin extends Vue {
    // 初始数据可以直接声明为实例的属性
    message: string = "Hello!";
    min: number = 10000;
    max: number = 100000;
    step: number = 10000;
    // range: number = 6000;
    is_show_condition_bar: boolean = false;
}