<template>
  <div>
    <el-row style="background:rgba(255,255,255,.2);width:80%;">
      <el-col :span="12">
        <el-container>
          <el-main>
            <el-card shadow="hover" class="themeGreen">
              查询条件
              <el-input placeholder="请输入内容" v-model="level">
                <template slot="prepend">级别</template>
              </el-input>

              <el-input placeholder="请输入内容" v-model="wsm">
                <template slot="prepend">最大风速</template>
              </el-input>

              <el-input placeholder="请输入内容" v-model="bp">
                <template slot="prepend">气压</template>
              </el-input>

              <el-date-picker v-model="startMonth" type="month" placeholder="起始月"></el-date-picker>
              <el-date-picker v-model="endMonth" type="month" placeholder="截至月"></el-date-picker>
              <el-button type="primary" icon="el-icon-search" @click="loadSearchResult">搜索</el-button>
            </el-card>
          </el-main>
        </el-container>

        <el-container>
          <el-main>
            <el-card shadow="hover" style="width:100%" class="themeGreen">
              <el-table
                :data="typhoonCodeData"
                stripe
                @row-click="clickCodeForTime"
                style="width:100%;"
              >
                <el-table-column type="index" :index="indexMethod"></el-table-column>
                <el-table-column prop="code" label="台风编号"></el-table-column>
              </el-table>
            </el-card>
          </el-main>
        </el-container>
      </el-col>

      <el-col :span="12">
        <el-collapse-transition>
          <el-container v-show="isDateShow">
            <el-main>
              <el-card shadow="hover" style="width:100%" class="themeGreen">
                <el-table
                  :data="typhoonTimeData"
                  stripe
                  @row-click="clickDateForDetail"
                  style="width:100%"
                >
                  <el-table-column type="index" :index="indexMethod"></el-table-column>
                  <el-table-column prop="date" label="发生时间"></el-table-column>
                </el-table>
              </el-card>
            </el-main>
          </el-container>
        </el-collapse-transition>

        <el-collapse-transition>
          <el-container v-show="isDetailShow">
            <el-main>
              <el-card shadow="hover" style="width:100%" class="themeGreen">
                <el-table
                  :data="typhoonDetailData"
                  stripe
                  style="width:100%"
                  @row-click="clickDetailData"
                >
                  <el-table-column type="index" :index="indexMethod"></el-table-column>
                  <el-table-column prop="wsm" label="风速"></el-table-column>
                  <el-table-column prop="level" label="级别"></el-table-column>
                  <el-table-column prop="bp" label="气压"></el-table-column>
                </el-table>
              </el-card>
            </el-main>
          </el-container>
        </el-collapse-transition>
      </el-col>
    </el-row>
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
      isDateShow: false,
      isDetailShow: false,
      tableData: [],
      typhoonCodeData: [],
      typhoonTimeData: [],
      typhoonDetailData: []
    };
  },
  methods: {
    loadSearchResult() {
      //先关上其他表格
      this.isDateShow = false;
      this.isDetailShow = false;
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
            app.typhoonCodeData = app.getTypoonCodesArr(app.tableData);
          } else {
            app.tableData = [];
          }
        }
      });
    },
    getTypoonCodesArr(data) {
      let dic = {},
        codes = [];
      for (let i = 0; i < data.length; i++) {
        if (dic[data[i].code]) {
          continue;
        }
        codes.push({ code: data[i].code });
        dic[data[i].code] = 1;
      }
      return codes;
    },
    clickCodeForTime(row, event, column) {
      //deal other table
      this.setTimeData(row.code);
      this.isDateShow = true;
      this.isDetailShow = false;
    },
    setTimeData(code) {
      let arr = [],
        dict = {};
      let tmp = this.tableData.filter(x => x.code == code);
      for (let i = 0; i < tmp.length; i++) {
        if (dict[tmp[i].date] > 0) continue;
        dict[tmp[i].date] = 1;
        arr.push({ date: tmp[i].date, code: code });
      }
      this.typhoonTimeData = arr;
    },
    clickDateForDetail(row, event, column) {
      this.setDetailData(row);
      this.isDetailShow = true;
    },
    setDetailData(row) {
      let data = this.tableData.filter(x => {
        return x.code == row.code && x.date == row.date;
      });
      this.typhoonDetailData = data;
    },
    clickDetailData() {
      alert("something todo");
    }
  },
  watch: {},
  mounted() {}
};
</script>
<style scoped>
.themeGreen {
  background: #59989d;
}
</style>


