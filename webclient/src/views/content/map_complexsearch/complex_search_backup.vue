<template src="">
  
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