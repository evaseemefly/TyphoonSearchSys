
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/**
 *只将data拆分至此
 *  注意使用mixin的方式进行拆分，此处的class需要继承自vue，且需要加入component装饰器
 * @export
 * @class TextFormDataMixin
 * @extends {Vue}
 */
@Component
export default class TextFormDataMixin extends Vue {
    //
    title: string = "";
    text: string = "";
    isActive: boolean = false;
}