<template>
  <div style="text-align:left;width:100%;">
    <div class="container-fluid" style="background:rgba(255,255,255,0) ;color:black;width:80%;">
      <div class="row">

        <div class="col-md-6 ">
          <div class="card  mt10 " style="margin-top:10px;">
            <div class="card-body">
              <h5 class="card-title">搜索条件</h5>
              <form class="card-body">
                <div class="form-row">
                  <div class="form-group col-md-6 form-inline">
                    <div class="col-sm-3">
                      <label for="inputEmail4">级别</label>
                    </div>
                    <input v-model="level" class="form-control ml-10">
                  </div>
                  <div class="form-group col-md-6 form-inline">
                    <div class="col-sm-3"><label for="inputPassword4">最大风速</label></div>
                    <input class="form-control" v-model="wsm">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6 form-inline">
                    <div class="col-sm-3"> <label for="inputAddress">气压</label></div>
                    <input class="form-control" v-model="bp">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6 form-inline" style="text-align:left;">
                    <div class="col-sm-3">
                      <label>起始月</label>
                    </div>

                    <el-date-picker v-model="startMonth" type="month" placeholder="起始月" style="width:210px;">
                    </el-date-picker>
                  </div>
                  <div class="form-group col-md-6 form-inline">
                    <div class="col-sm-3">
                      截至月
                    </div>
                    <el-date-picker v-model="endMonth" type="month" placeholder="截至月" style="width:210px;">
                    </el-date-picker>
                  </div>

                </div>
                <el-button type="primary" icon="el-icon-search" @click="loadSearchResult">搜索</el-button>
              </form>
            </div>
          </div>
          <div class="card  mt10 ">
            <div class="card-body">
              <h5 class="card-title">台风列表</h5>
              <el-table :data="typhoonCodeData" stripe @row-click="clickCodeForTime" style="width:100%;">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="code" label="台风编号"></el-table-column>
              </el-table>
              <el-pagination background layout="prev, pager, next" :total="typhoonCodeDataTotalCount()"
                :page-size="typhoonCodePageSize" @current-change="typhoonCodePageChange"></el-pagination>
            </div>
          </div>
        </div>
        <div class="col-md-6 ">
          <div class="card  mt10 " v-show="isDateShow">
            <div class="card-body">
              <h5 class="card-title">发生日期</h5>

              <el-table :data="typhoonTimeData" stripe @row-click="clickDateForDetail" style="width:100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="date" label="发生时间"></el-table-column>
              </el-table>
              <el-pagination background layout="prev, pager, next" :total="typhoonTimeDataTotalCount()"
                :page-size="typhoonTimeDataPageSize" @current-change="typhoonTimeDataPageChange"></el-pagination>
            </div>
          </div>
          <div class="card  mt10 " v-show="isDetailShow">
            <div class="card-body">
              <h5 class="card-title">发生细节</h5>
              <el-table :data="typhoonDetailData" stripe style="width:100%" @row-click="clickDetailData">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="wsm" label="风速"></el-table-column>
                <el-table-column prop="level" label="级别"></el-table-column>
                <el-table-column prop="bp" label="气压"></el-table-column>
              </el-table>
              <el-pagination background layout="prev, pager, next" :total="typhoonDetailDataTotalCount()"
                :page-size="typhoonDetailPageSize" @current-change="typhoonDetailPageChange"></el-pagination>
            </div>
          </div>
        </div>
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
        isDateShow: false,
        isDetailShow: false,
        tableData: [],
        typhoonCodeData: [],
        typhoonTimeData: [],
        typhoonDetailData: [],

        typhoonCodeDataTotal: [],
        typhoonTimeDataTotal: [],
        typhoonDetailDataTotal: [],



        typhoonCodePageSize: 6,
        typhoonTimeDataPageSize: 6,
        typhoonDetailPageSize: 6,

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
              app.typhoonCodeDataTotal = app.getTypoonCodesArr(app.tableData);
              app.typhoonCodeData = app.typhoonCodeDataTotal.slice(0, app.typhoonCodePageSize);
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
        this.typhoonTimeDataTotal = arr;
        this.typhoonTimeDataPageChange(1);
      },
      clickDateForDetail(row, event, column) {
        this.setDetailData(row);
        this.isDetailShow = true;
      },
      setDetailData(row) {
        let data = this.tableData.filter(x => {
          return x.code == row.code && x.date == row.date;
        });
        this.typhoonDetailDataTotal = data;
        this.typhoonDetailPageChange(1);
      },
      clickDetailData() {
        alert("something todo");
      },
      typhoonCodePageChange(pageNum) {
        this.typhoonCodeData = this.sliceData(pageNum, this.typhoonCodePageSize, this.typhoonCodeDataTotal);
      },
      typhoonTimeDataPageChange(pageNum) {
        this.typhoonTimeData = this.sliceData(pageNum, this.typhoonTimeDataPageSize, this.typhoonTimeDataTotal);
      },
      typhoonDetailPageChange(pageNum) {
        this.typhoonDetailData = this.sliceData(pageNum, this.typhoonDetailPageSize, this.typhoonDetailDataTotal);
      },
      sliceData: function (pageNum, pageSize, totalData) {
        let startNum = 0, endNum = 0;
        startNum = pageSize * (pageNum - 1);
        endNum = startNum + pageSize;
        return totalData.slice(startNum, endNum);
      },
      typhoonCodeDataTotalCount() {
        return this.typhoonCodeDataTotal.length;
      },
      typhoonTimeDataTotalCount() {
        return this.typhoonTimeDataTotal.length;
      },
      typhoonDetailDataTotalCount() {
        return this.typhoonDetailDataTotal.length;
      },
      showParam() {
        alert(arguments);
      }
    },
    watch: {},
    mounted() { }
  };
</script>
<style scoped>
  .row {
    text-shadow: 0 0 0 black !important;
  }

  .mt10 {
    margin-top: 10px;
  }

  .testColor {
    background: lightpink;
  }

  .themeGreen {
    background: #59989d;
  }
</style>