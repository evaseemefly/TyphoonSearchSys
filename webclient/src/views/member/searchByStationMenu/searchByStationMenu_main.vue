<template>
  <div id="condition" class="col-md-4">
    <div class="col-md-6 subitem_div">
      <!-- 次级菜单，顶部搜索区域 -->
      <div class="card bg-info w-100">
        <div class="card-header">多条件搜索</div>
        <div class="card-body">
          <div class="form-group row">
            <label class="col-form-label col-form-label-sm" for="ds_host">死亡</label>
            <div class="col-sm-4">
              <input class="form-control form-control-sm" id="ds_host" type="text" placeholder="人数">
            </div>
            <label class="col-form-label col-form-label-sm" for="ds_host">损失</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="损失"
              >
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-form-label-sm" for="ds_username">增水</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="增水"
              >
            </div>
            <label class="col-form-label col-form-label-sm" for="ds_username">潮位</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="潮位"
              >
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-form-label-sm" for="ds_username">级别</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="级别"
              >
            </div>
            <label class="col-form-label col-form-label-sm" for="ds_username">风速</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="风速"
              >
            </div>
          </div>
          <div class="form-group row">
            <label class="col-form-label col-form-label-sm" for="ds_username">气压</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="气压"
              >
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-10">
              <button @click="is_show=!is_show" class="btn btn-primary">搜索</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 次级菜单，搜索后加载的台风列表 -->
      <transition name="fade">
        <div class="card bg-info" v-show="is_show" id="ty_list">
          <div class="card-header">台风列表</div>
          <div class="card-body">
            <div class="row">
              <div class="col">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="(item,index) in data_list"
                    :key="index"
                    @click="query(item)"
                  >{{item.name}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <stationsList v-show="showStationList" :target_typhoon="typhoon" :code="code"></stationsList>
    </transition>

    <!-- <endDataList></endDataList> -->
    <!-- <endBarTest></endBarTest> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { DataList_Mid_Model } from "../../../middle_model/common";

// import endDataList from "../endBar/end_data_list.vue";
import stationsList from "./searchByStationMenu_stations.vue";

@Component({
  components: { stationsList }
})
export default class second_bar_condition_search extends Vue {
  // 初始数据可以直接声明为实例的属性
  data_list: DataList_Mid_Model[] = [
    new DataList_Mid_Model("台风1", 1, "code_a"),
    new DataList_Mid_Model("台风2", 2, "code_b"),
    new DataList_Mid_Model("台风3", 3, "code_c")
  ];
  is_show: boolean = false;
  showStationList: boolean = false;
  code: string = "";

  typhoon: DataList_Mid_Model = this.data_list[0];
  // 组件方法也可以直接声明为实例的方法
  query(obj: DataList_Mid_Model): void {
    var myself = this;
    myself.code = obj.code;
    myself.showStationList = true;
    myself.typhoon = obj;
  }
}
</script>

<style>
#condition {
  position: absolute;
  margin-left: 110px;
  margin-top: 0px;
  display: flex;
}
.subitem_div {
  display: flex;
  flex-direction: column;
}
#search_form {
  background: #34495ee9;
  padding-right: 8px;
  border-radius: 5px;
}
#data_list {
  margin-top: 5px;
  background: rgba(73, 115, 165, 0.701);
  padding-right: 8px;
  border-radius: 5px;
}
li {
  list-style: none;
  text-align: left;
}
.form-group .control-label {
  color: #ffffff;
  font-family: "Lato", Helvetica, Arial, sans-serif;
}

#ty_list {
  margin-top: 5px;
}
</style>

