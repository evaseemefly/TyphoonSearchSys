<template>
  <div style="width:1800px;" class="mt-10">
    <div class="container-fluid" style="background:gray;">
      <statisticSearch></statisticSearch>
      <staticDetail></staticDetail>
      <div>this is tail data</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import staticDetail from "./form_static_detail";
import statisticSearch from "@/views/member/search/search_statistic_typhoon.vue";
export default {
  components: {
    staticDetail,
    statisticSearch
  }
};
</script>

