<template>
  <div class="row form-group">
    <div class="col-md-1">年份</div>
    <div class="form-group col">
      <select class="form-control">
        <option v-for="item in yearList" :key="item">{{item}}</option>
      </select>
    </div>
    <div class="col-md-1">编码</div>
    <div class="form-group col">
      <select class="form-control">
        <option v-for="item in codeList" :key="item">{{item}}</option>
      </select>
    </div>
    <div class="form-group col">
      <button type="button" class="btn btn-success">Search</button>
    </div>
  </div>
</template>

<script>
// 关于历史台风查询的父组件
import Vue from "vue";
import { getAllTyphoonYear, getAllTyphoonCode } from "@/api/api.js";

export default {
  data() {
    return {
      codeList: ["code1", "code2", "code3"],
      yearList: [1990, 1991, 1992]
    };
  },
  methods: {
    initYearSelector() {
      let app = this;
      getAllTyphoonYear().then(res => {
        if (res.status == 200 && res.data.length > 0) {
          app.yearList = res.data[0].years;
        }
      });
    },

    initCodeSelector() {
      let app = this;
      getAllTyphoonCode().then(res => {
        if (res.status == 200) {
          app.codeList = res.data.filter(x => x != "(nameless)");
        }
      });
    }
  },
  mounted() {
    this.initYearSelector();
    this.initCodeSelector();
  }
};
</script>

<style>
</style>
