<template>
  <div
    style="width:1800px;"
    class="mt-20 main"
  >
    <div class="container-fluid main">
      <statisticSearch></statisticSearch>
      <staticDetail></staticDetail>
      <div class="row">
        <div class="col">
          <div class="block">
            <mapSingle></mapSingle>
          </div>
        </div>
        <div class="col">
          <div class="block"></div>
        </div>
      </div>
      <div class="row mt-10">
        <div class="col">
          <div class="alert alert-success block-content">
            <span>发生时间:</span>
            {{timerange}}
          </div>
        </div>
        <div class="col">
          <div class="alert alert-success block-content">
            <span style="margin-right:10px">最大风速:{{wms}} m/s</span>
            <span>发生时间:{{wmsdate}}</span>
          </div>
        </div>
        <div class="col">
          <div class="alert alert-success block-content">
            <span style="margin-right:10px">最低气压:{{mbp}} hPa</span>
            <span>发生时间:{{mbpdate}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import staticDetail from "./form_static_detail";
import mapSingle from "@/views/member/map/map_single.vue"
import statisticSearch from "@/views/member/search/search_statistic_typhoon.vue";
import { getRealDataMws, getRealDataMbp } from "@/api/api.js";

export default {
  data () {
    return {
      timerange: "",
      wms: "",
      mbp: "",
      wmsdate: "",
      mbpdate: ""
    };
  },
  computed: {
    completeData () {
      return this.$store.state.map.completeData;
    }
  },
  methods: {
    setTimeRange (data) {
      if (!data) return;
      let dateStart = new Date(data);
      let dateEnd = new Date(data);
      dateEnd.setDate(dateStart.getDate() + 4);
      this.timerange = `${dateStart.getFullYear()}-${dateStart.getMonth() +
        1}-${dateStart.getDate()} 至 ${dateEnd.getFullYear()}-${dateEnd.getMonth() +
        1}-${dateEnd.getDate()}`;
    },
    setMws (data) {
      var app = this;
      getRealDataMws(data.typhoonnum).then(res => {
        // if (res.status == 200 && res.data && res.data.date && res.data.mws) {
        if (res.status == 200) {
          app.wms = res.data.mws;
          // app.wmsdate=`${res.data.date.getFullYear()}`;
          app.wmsdate = res.data.date.replace("T", " ");
        }
      });
    },
    setMbp (data) {
      var app = this;
      getRealDataMbp(data.typhoonnum).then(res => {
        // if (res.status == 200 && res.data && res.data.date && res.data.mbp) {
        if (res.status == 200) {
          app.mbp = res.data.mbp;
          app.mbpdate = res.data.date.replace("T", " ");
        }
      });
    }
  },
  watch: {
    completeData (data) {
      this.setTimeRange(data.startdate);
      this.setMws(data);
      this.setMbp(data);
    }
  },
  components: {
    staticDetail,
    statisticSearch,
    mapSingle
  }
};
</script>
<style scoped>
.main {
  background: linear-gradient(135deg, #697f7a, #0b5163, #053a40);
}
* {
  font-family: 微软雅黑;
}
</style>


