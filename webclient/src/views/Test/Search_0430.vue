<template>
  <div style="text-align:left;width:100%;">
    <div
      class="container-fluid"
      style="background:rgba(255,255,255,0) ;color:black;width:80%;"
    >
      <div class="row">
        <div class="col-md-4">
          <!-- 多条件搜索 -->
          <div
            class="card mt10"
            style="margin-top:10px;"
          >
            <!-- <div class="card-body">
              
            </div>-->
            <!-- <h5 class="card-title card-my-header">搜索条件</h5> -->
            <!-- TODO [-] 此处修改 -->
            <div class="card-header card-my-header">多条件搜索</div>
            <form class="card-body card-my-body">
              <div class="form-row">
                <div class="form-group col-md-6 form-inline">
                  <div class="col-sm-3 smdiv">
                    <label for="inputEmail4">级别</label>
                  </div>
                  <input
                    v-model="level"
                    class="form-control col-md-7"
                  >
                </div>
                <div class="form-group col-md-6 form-inline">
                  <div class="col-sm-3 smdiv">
                    <label for="inputPassword4">最大风速</label>
                  </div>
                  <input
                    class="form-control col-md-7"
                    v-model="wsm"
                  >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6 form-inline">
                  <div class="col-sm-3 smdiv">
                    <label for="inputAddress">气压</label>
                  </div>
                  <input
                    class="form-control col-md-7"
                    v-model="bp"
                  >
                </div>
              </div>

              <div class="form-row">
                <div
                  class="form-group col-md-6 form-inline"
                  style="text-align:left;"
                >
                  <div class="col-sm-3 smdiv">
                    <label>起始月</label>
                  </div>

                  <el-date-picker
                    v-model="startMonth"
                    type="month"
                    placeholder="起始月"
                    style="width:60%;"
                  ></el-date-picker>
                </div>
                <div class="form-group col-md-6 form-inline">
                  <div class="col-sm-3 smdiv">
                    <label>截至月</label>
                  </div>
                  <el-date-picker
                    v-model="endMonth"
                    type="month"
                    placeholder="截至月"
                    style="width:60%;"
                  ></el-date-picker>
                </div>
              </div>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="loadSearchResult"
              >搜索</el-button>
            </form>
          </div>
          <!-- 右侧下侧台风列表 -->
          <div class="card mt10">
            <div class="card-header card-my-header">台风列表</div>
            <div class="card-body card-my-body">
              <ul class="list-group">
                <li
                  class="list-group-item list-my-group-item"
                  v-for="(item,index) in typhoonCodeData"
                  :key="index"
                  @click="clickCodeForTime(item)"
                >{{item}}</li>
              </ul>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="typhoonCodeDataTotal"
                :page-size="typhoonCodePageSize"
                @current-change="typhoonCodePageChange"
              ></el-pagination>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div
            class="card mt10"
            v-show="isDateShow"
          >
            <!-- <div class="card-body card-my-body">
              
            </div>-->
            <div class="card-header card-my-header">台风编号</div>
            <!-- <h5 class="card-title">台风编号</h5> -->
            <!-- 此处不再套在card-body中，样式更好看一些，去掉了padding -->
            <div class="card-body card-my-body">
              <ul class="list-group">
                <li
                  class="list-group-item list-my-group-item"
                  v-for="(item,index) in typhoonTimeData"
                  :key="index"
                  @click="clickDateForDetail(item)"
                >{{item._id}}</li>
              </ul>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="typhoonTimeDataTotal"
                :page-size="typhoonTimeDataPageSize"
                @current-change="typhoonTimeDataPageChange"
              ></el-pagination>
            </div>
          </div>
          <div
            class="card mt10"
            v-show="isDetailShow"
          >
            <!-- <div class="card-body card-my-body"></div> -->
            <div class="card-header card-my-header">观测数据</div>
            <!-- <h5 class="card-title">观测数据</h5> -->
            <el-table
              :data="typhoonDetailData"
              stripe
              style="width:100%"
              @row-click="clickDetailData"
            >
              <el-table-column type="index"></el-table-column>
              <el-table-column
                prop="wsm"
                label="风速"
              ></el-table-column>
              <el-table-column
                prop="level"
                label="级别"
              ></el-table-column>
              <el-table-column
                prop="bp"
                label="气压"
              ></el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="typhoonDetailDataTotal"
              :page-size="typhoonDetailPageSize"
              @current-change="typhoonDetailPageChange"
            ></el-pagination>
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
import {
  getTyphoonCodeByComplexCondition,
  getTimeByCode,
  getDetail
} from "@/api/api.js";

Vue.use(ElementUI);
export default {
  data() {
    return {
      level: "",
      wsm: "",
      bp: "",
      startMonth: "",
      endMonth: "",
      code: "",
      date: "",
      isDateShow: false,
      isDetailShow: false,
      tableData: [],
      typhoonCodeData: [],
      typhoonTimeData: [],
      typhoonDetailData: [],

      typhoonCodeDataTotal: 0,
      typhoonTimeDataTotal: 0,
      typhoonDetailDataTotal: 0,

      typhoonCodePageSize: 6,
      typhoonTimeDataPageSize: 6,
      typhoonDetailPageSize: 6
    };
  },
  methods: {
    loadSearchResult(pageInfo) {
      //先关上其他表格
      this.isDateShow = false;
      this.isDetailShow = false;
      let app = this;
      let from = 0;
      let to = this.typhoonCodePageSize;
      var startDate = this.startMonth,
        endDate = this.endMonth;
      if (startDate) {
        startDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1);
      }
      if (endDate) {
        endDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1);
      }

      if (pageInfo.from !== undefined) from = pageInfo.from;
      if (pageInfo.to !== undefined) to = pageInfo.to;

      getTyphoonCodeByComplexCondition(
        this.level,
        this.wsm,
        this.bp,
        startDate,
        endDate,
        from,
        to
      ).then(res => {
        if (res.status === 200) {
          app.typhoonCodeData = res.data.data;
          app.typhoonCodeDataTotal = res.data.total;
        }
      });
    },
    loadSearchDateByCode(pageInfo) {
      let app = this;
      getTimeByCode(pageInfo.code, pageInfo.from, pageInfo.to).then(res => {
        if (res.status == 200) {
          app.typhoonTimeData = res.data.data;
          app.typhoonTimeDataTotal = res.data.total;
        }
      });
    },
    loadSearchDetail(pageInfo) {
      let app = this;
      getDetail(pageInfo.code, pageInfo.date).then(res => {
        if (res.status == 200) {
          app.typhoonDetailData = res.data;
          app.typhoonDetailDataTotal = res.data.length;
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
      this.code = row;
      this.setTimeData(row);
      this.isDateShow = true;
      this.isDetailShow = false;
    },
    // TODO:[*] 19-04-22 加入了日期的修改 -by zw
    getFormatDate(dateStr) {
      if (!dateStr) return "";
      try {
        let d = new Date(dateStr);
        return (
          d.getFullYear() +
          "-" +
          (d.getMonth() + 1) +
          "-" +
          d.getDate() +
          " " +
          d.getHours()
        );
      } catch (e) {
        return dateStr.split("T")[0];
      }
    },
    setTimeData(code) {
      this.typhoonTimeDataPageChange(1);
    },
    clickDateForDetail(row, event, column) {
      this.date = row._id;
      this.setDetailData(row._id);
      this.isDetailShow = true;
    },
    setDetailData(row) {
      this.loadSearchDetail({ code: this.code, date: this.date });
    },
    clickDetailData() {
      alert("something todo");
    },
    typhoonCodePageChange(pageNum) {
      let result = this.countPageNum(pageNum, this.typhoonCodePageSize);
      this.loadSearchResult(result);
    },
    typhoonTimeDataPageChange(pageNum) {
      let pageNumInfo = this.countPageNum(
        pageNum,
        this.typhoonTimeDataPageSize
      );
      let pageInfo = {
        code: this.code,
        from: pageNumInfo.from,
        to: pageNumInfo.to
      };
      this.loadSearchDateByCode(pageInfo);
    },
    typhoonDetailPageChange(pageNum) {
      let tempData = this.typhoonDetailData;
      this.typhoonDetailData = this.sliceData(
        pageNum,
        this.typhoonDetailPageSize,
        tempData
      );
    },
    countPageNum: function(pageNum, pageSize) {
      let startNum = 0,
        endNum = 0;
      startNum = pageSize * (pageNum - 1);
      endNum = startNum + pageSize;
      return { from: startNum, to: endNum };
    },
    sliceData: function(pageNum, pageSize, totalData) {
      let result = this.countPageNum(pageNum, pageSize);
      return totalData.slice(result.from, result.to);
    },
    typhoonDetailDataTotalCount() {
      return this.typhoonDetailDataTotal.length;
    },
    showParam() {
      alert(arguments);
    }
  },
  watch: {},
  mounted() {}
};
</script>
<style scoped>
.row {
  text-shadow: 0 0 0 black !important;
}

.mt10 {
  margin-top: 10px;
}

.mt10 label {
  font-size: 85%;
}

/* 缩小label的左右内间距 */
.mt10 .smdiv {
  padding-left: 5px;
  padding-right: 5px;
}

/* 与之前写的左侧导航栏相同的css样式 */
.card-my-header {
  background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.639));
  font-size: 90%;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
  color: #ffffff;
  font-family: "Lato", Helvetica, Arial, sans-serif;
}
.card-my-body {
  background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639));
  padding: 8px 8px 8px 8px;
  color: #ffffff;
  font-family: "Lato", Helvetica, Arial, sans-serif;
}

.list-my-group-item {
  color: rgb(4, 4, 4);
  font-size: 85%;
  background: rgba(184, 206, 200, 0.557);
  padding-top: 5px;
  padding-bottom: 5px;
  font-weight: 400;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}

.list-my-group-item:hover {
  color: rgb(255, 255, 255);
  font-size: 85%;
  background: rgba(111, 238, 204, 0.557);
  padding-top: 5px;
  padding-bottom: 5px;
  font-weight: 600;
}
.testColor {
  background: lightpink;
}

.themeGreen {
  background: #59989d;
}
</style>