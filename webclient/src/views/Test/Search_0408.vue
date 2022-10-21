<template>
  <div>
    <div class="container">
      <div class="demo-input-suffix">
        級別
        <el-input v-model="level" placeholder="请输入内容"></el-input>最大風速
        <el-input v-model="wsm" placeholder="请输入内容"></el-input>氣壓
        <el-input v-model="bp" placeholder="请输入内容"></el-input>
      </div>

      <div class="demo-input-suffix">
        起始时间
        <el-date-picker v-model="startMonth" type="month" placeholder="选择月"></el-date-picker>结束时间
        <el-date-picker v-model="endMonth" type="month" placeholder="选择月"></el-date-picker>
      </div>
      <div class="demo-input-suffix"></div>
      <div class="demo-input-suffix">
        <el-table :data="tableData" stripe style="width:100%">
          <el-table-column prop="wsm" label="风速" width="180"></el-table-column>
          <el-table-column prop="level" label="级别" width="180"></el-table-column>
          <el-table-column prop="bp" label="气压" width="180"></el-table-column>
          <el-table-column prop="date" label="发生时间" width="180"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { filterByComplexCondition } from "@/api/api.js";

Vue.use(ElementUI);
export default {
  data() {
    return {
      level: "",
      wsm: "",
      bp: "",
      startMonth: "",
      endMonth: "",
      tableData: []
    };
  },
  methods: {
    loadSearchResult() {
      let app = this;
      var startDate = this.startMonth,
        endDate = this.endMonth;
      if (startDate) {
        startDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1);
      }
      if (endDate) {
        endDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1);
      }
      filterByComplexCondition(
        this.level,
        this.wsm,
        this.bp,
        startDate,
        endDate
      ).then(res => {
        if (res.status === 200) {
          if (res.data instanceof Array) {
            let arr = [];
            for (let x of res.data) {
              if (x && x.date) {
                let tmp = x;
                tmp.date = x.date.split("T")[0];
                arr.push(tmp);
              }
            }
            app.tableData = arr;
          } else {
            app.tableData = [];
          }
        }
      });
    }
  },
  watch: {
    level() {
      this.loadSearchResult();
    },
    wsm() {
      this.loadSearchResult();
    },
    bp() {
      this.loadSearchResult();
    },
    startMonth() {
      this.loadSearchResult();
    },
    endMonth() {
      this.loadSearchResult();
    }
  },
  mounted() {}
};
</script>
<style scoped>
.container {
  background: white;
  color: black;
}
.all_left_bar {
  display: hidden;
}
</style>


