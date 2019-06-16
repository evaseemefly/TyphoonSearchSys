<template src="./map_search/center_map_search.html"></template>

<script lang="ts">
// import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { mixins } from "vue-class-component";
import MapRangeVuexMixin from "@/views/content/map_range/map_vuex_mixin";

// 引入数据格式规范接口
import { IStation } from "@/interface/map/map.ts";

// 子组件
// 底图子组件
import MapBase from "@/views/content/map_base/map_base.vue";
import ComplexSearch from "@/views/content/map_complexsearch/complex_search.vue";
// 右侧的灾害详情菜单子组件
import TextForm from "@/views/member/form/text_form.vue";
// 引入modal组件
import ModalDetail from "@/views/member/modal/modal_detail.vue";

@Component({
  components: {
    MapBase,
    ComplexSearch,
    TextForm,
    ModalDetail
  }
})
export default class center_map_search extends mixins(MapRangeVuexMixin) {
  stationTemp: IStation = null;
  @Watch("targetStation")
  onTargetStation(val: IStation) {
    this.stationTemp = val;
  }
}
</script>
<style scoped src="./map_range/map.css">
</style>