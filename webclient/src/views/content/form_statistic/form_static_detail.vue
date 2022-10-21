<template>
  <div class="row">
    <div class="col">
      <mapSingle></mapSingle>
    </div>
    <div class="col">
      <detailCharts></detailCharts>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import mapSingle from "@/views/member/map/map_single.vue";
import detailCharts from "@/views/member/charts/typhoon_detail_charts.vue";
export default {
  components: {
    mapSingle,
    detailCharts
  }
};
</script>

