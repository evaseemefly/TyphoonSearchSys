<template src="./complex_search.html"></template>
<script lang="ts">
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 使用mixin的方式拓展data
import ComplexSearchDataMixin from "@/views/content/map_complexsearch/complex_search_data_mixin";
import Component, { mixins } from "vue-class-component";

import {
  DataList_Mid_Model,
  TyphoonRealBase_Mid_Model
} from "@/middle_model/common.ts";

import {
  getTyphoonCodeByComplexCondition,
  getTimeByCode,
  getDetail
} from "@/api/api.js";
import { checkStationCount4Typhoon } from "@/api/api.ts";
// 子组件
// 显示台风基础信息的子组件
import rightBarDetail from "@/views/member/bar/rightBarDetail.vue";
@Component({
  components: {
    //显示台风基础信息的子组件
    rightBarDetail
  }
})
export default class center_map_search extends mixins(ComplexSearchDataMixin) {
  //   根据条件搜索 查询获取当前搜索条件符合条件的的台风code list 以及长度
  loadSearchResult(pageInfo) {
    //   注意pageinfo 我理解就是this by casablaca
    //先关上其他表格
    this.isDateShow = false;
    this.isDetailShow = false;
    var myself = this;
    // 注意每次点击时需要清空当前typhoonCodeList
    this.typhoonCodeList = [];
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

    // 根据复杂条件搜索框中的信息 加载 左下的 台风列表
    getTyphoonCodeByComplexCondition(
      this.level,
      this.wsm,
      this.bp,
      // TODO:[-] 19-06-20 此处的num应为复杂搜索框中的num（searchNum）
      this.searchNum,
      start_str,
      end_str,
      from,
      to
    ).then(res => {
      if (res.status === 200) {
        // myself.typhoonCodeData = res.data.data;
        // TODO:[-] 19-05-07 此处后台返回的为一个嵌套的序列化对象，包含list与total
        res.data.list.forEach(obj => {
          myself.typhoonCodeList.push(
            new DataList_Mid_Model(
              obj.code,
              -1,
              obj.code,
              obj.year,
              obj.num,
              obj.nameCh
            )
          );
        });
        myself.typhoonCodeDataTotal = res.data.total;
      }
    });
  }

  // 根据code获取对应的台风时间列表
  loadSearchDateByCode(pageInfo) {
    let app = this;
    getTimeByCode(pageInfo.code, pageInfo.from, pageInfo.to, pageInfo.num).then(
      res => {
        if (res.status == 200) {
          app.typhoonTimeData = res.data.data;
          app.typhoonTimeDataTotal = res.data.total;
        }
      }
    );
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
  // TODO:[*] 19-05-07 根据code修改当前的data中的code
  clickCode4Time(row: DataList_Mid_Model) {
    /*
      点击后除了如下操作以外还需要：
          ——修改vuex中的当前选中台风对象

    */
    //deal other table
    this.code = row.code;
    //调用set方法写入修改vuex的typhoon
    this.typhoon = row;
    this.num = row.num;
    this.setTimeData(row);
    // TODO[*]: 19-06-29
    // 点击后加载指定台风的测站数据量
    this.checkStationCountState(this.num);
    this.isDateShow = true;
    this.isDetailShow = false;
  }

  hiddeDateForm() {
    this.isDateShow = false;
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

  // 根据台风num获取测站数量
  checkStationCountState(num: string) {
    checkStationCount4Typhoon(num).then(res => {
      if (res.status == 200) {
        // console.log(res.data);
        this.stationNum = res.data.count;
      }
    });
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
  // 指定台风的 时间分页查询
  typhoonTimeDataPageChange(pageNum) {
    let pageNumInfo = this.countPageNum(pageNum, this.typhoonTimeDataPageSize);
    let pageInfo = {
      code: this.code,
      from: pageNumInfo.from,
      to: pageNumInfo.to,
      // TODO:[x] 19-06-20 解决点击了左下列表后，会自动修改左上复杂查询div中的num
      num: this.searchNum === "" ? this.num : this.searchNum
    };
    // 根据信息加载对应的台风时间列表（右侧的指定台风的时间列表）
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

  hiddenFrame() {
    // console.log("触发了hidden事件");
    this.isShowComplex = false;
  }

  // 计算样式的一些方法
  // 右上顶部的此次过程对应的 测站 数量的class
  stationNumStateClass(val: number) {
    var className = "warning";

    if (val <= 10 && val > 0) {
      className = "info";
    }
    if (val > 10) {
      className = "normal";
    }
    return className;
  }

  set typhoon(val: DataList_Mid_Model) {
    this.isDateShow = false;
    this.$store.commit("typhoon", val);
  }

  //  当前选择的台风（由vuex获取）
  get typhoon(): DataList_Mid_Model {
    return this.$store.state.map.typhoon;
  }
}
</script>
<style scoped src="./complex_search.css">
</style>