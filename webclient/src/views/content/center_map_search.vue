<template src="./map_search/center_map_search.html"></template>

<script lang="ts">
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import Component, { mixins } from "vue-class-component";

// 子组件
// 底图子组件
import MapBase from "@/views/content/map_base/map_base.vue";
import ComplexSearch from "@/views/content/map_complexsearch/complex_search.vue";
// 右侧的灾害详情菜单子组件
import TextForm from "@/views/member/form/text_form.vue";
@Component({
  components: {
    MapBase,
    ComplexSearch,
    TextForm
  }
})
export default class center_map_search extends Vue {}
</script>
<style scoped src="./map_range/map.css">
</style>