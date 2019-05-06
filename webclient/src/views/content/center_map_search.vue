<template src="./map_complexsearch/complex_search.html"></template>

<script lang="ts">
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import {
  getTyphoonCodeByComplexCondition,
  getTimeByCode,
  getDetail
} from "@/api/api.js";

// 使用mixin的方式拓展data
import MapRangeDataMixin from "./map_complexsearch/complex_search_data_mixin";
import Component, { mixins } from "vue-class-component";
@Component({})
export default class center_map_search extends mixins(MapRangeDataMixin) {
  //   根据条件搜索 查询获取当前搜索条件符合条件的的台风code list 以及长度
  loadSearchResult(pageInfo) {
    //   注意pageinfo 我理解就是this by casablaca
    //先关上其他表格
    this.isDateShow = false;
    this.isDetailShow = false;
    var myself = this;
    let from = 0;
    let to = this.typhoonCodePageSize;
    var startDate = this.startMonth,
      endDate = this.endMonth;
    var start_str = "";
    var end_str = "";
    // TODO:[-] 此处有问题，因为startDate与endDate为string类型，所以暂时先注释掉
    if (startDate) {
      start_str = startDate.getFullYear() + "-" + (startDate.getMonth() + 1);
    }
    if (endDate) {
      end_str = endDate.getFullYear() + "-" + (endDate.getMonth() + 1);
    }

    if (pageInfo.from !== undefined) from = pageInfo.from;
    if (pageInfo.to !== undefined) to = pageInfo.to;

    getTyphoonCodeByComplexCondition(
      this.level,
      this.wsm,
      this.bp,
      start_str,
      end_str,
      from,
      to
    ).then(res => {
      if (res.status === 200) {
        myself.typhoonCodeData = res.data.data;
        myself.typhoonCodeDataTotal = res.data.total;
      }
    });
  }
  loadSearchDateByCode(pageInfo) {
    let app = this;
    getTimeByCode(pageInfo.code, pageInfo.from, pageInfo.to).then(res => {
      if (res.status == 200) {
        app.typhoonTimeData = res.data.data;
        app.typhoonTimeDataTotal = res.data.total;
      }
    });
  }
  loadSearchDetail(pageInfo) {
    let app = this;
    getDetail(pageInfo.code, pageInfo.date).then(res => {
      if (res.status == 200) {
        app.typhoonDetailData = res.data;
        app.typhoonDetailDataTotal = res.data.length;
      }
    });
  }
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
  }
  clickCodeForTime(row, event, column) {
    //deal other table
    this.code = row;
    this.setTimeData(row);
    this.isDateShow = true;
    this.isDetailShow = false;
  }
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
  }
  setTimeData(code) {
    this.typhoonTimeDataPageChange(1);
  }
  clickDateForDetail(row, event, column) {
    this.date = row._id;
    this.setDetailData(row._id);
    this.isDetailShow = true;
  }
  setDetailData(row) {
    this.loadSearchDetail({ code: this.code, date: this.date });
  }
  clickDetailData() {
    alert("something todo");
  }
  typhoonCodePageChange(pageNum) {
    let result = this.countPageNum(pageNum, this.typhoonCodePageSize);
    this.loadSearchResult(result);
  }
  typhoonTimeDataPageChange(pageNum) {
    let pageNumInfo = this.countPageNum(pageNum, this.typhoonTimeDataPageSize);
    let pageInfo = {
      code: this.code,
      from: pageNumInfo.from,
      to: pageNumInfo.to
    };
    this.loadSearchDateByCode(pageInfo);
  }
  typhoonDetailPageChange(pageNum) {
    let tempData = this.typhoonDetailData;
    this.typhoonDetailData = this.sliceData(
      pageNum,
      this.typhoonDetailPageSize,
      tempData
    );
  }
  countPageNum(pageNum, pageSize) {
    let startNum = 0,
      endNum = 0;
    startNum = pageSize * (pageNum - 1);
    endNum = startNum + pageSize;
    return { from: startNum, to: endNum };
  }
  sliceData(pageNum, pageSize, totalData) {
    let result = this.countPageNum(pageNum, pageSize);
    return totalData.slice(result.from, result.to);
  }
  typhoonDetailDataTotalCount() {
    return this.typhoonDetailDataTotal;
  }
  showParam() {
    alert(arguments);
  }
}
</script>
<style scoped src="./map_complexsearch/complex_search.css">
</style>