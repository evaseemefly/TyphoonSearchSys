<template>
  <div
    id="condition"
    class="col-md-8"
  >
    <div class="col-md-4 subitem_div">
      <!-- 次级菜单，顶部搜索区域 -->
      <div class="card text-white">
        <div class="card-header card-my-header">多条件搜索</div>
        <div class="card-body card-my-body">
          <div class="form-group row">
            <label
              class="col-form-label col-form-label-sm"
              for="ds_host"
            >死亡</label>
            <div class="col-sm-4">

              <input
                class="form-control form-control-sm"
                id="ds_host"
                type="text"
                placeholder="人数"
              />

            </div>
            <label
              class="col-form-label col-form-label-sm"
              for="ds_host"
            >损失</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="损失"
              />

            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-form-label col-form-label-sm"
              for="ds_username"
            >增水</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="增水"
              >

            </div>
            <label
              class="col-form-label col-form-label-sm"
              for="ds_username"
            >潮位</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="潮位"
              />

            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-form-label col-form-label-sm"
              for="ds_username"
            >级别</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="级别"
              />

            </div>
            <label
              class="col-form-label col-form-label-sm"
              for="ds_username"
            >风速</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="风速"
              />

            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-form-label col-form-label-sm"
              for="ds_username"
            >气压</label>
            <div class="col-sm-4">
              <input
                class="form-control form-control-sm"
                id="ds_username"
                type="text"
                placeholder="气压"
              />

            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-10">
              <button
                @click="is_show=!is_show"
                class="btn btn-my"
              >搜索</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 次级菜单，搜索后加载的台风列表 -->
      <transition name="fade">
        <div
          class="card bg-info"
          v-show="is_show"
          id="ty_list"
        >
          <div class="card-header card-my-header text-white">台风列表</div>
          <div class="card-body card-my-body">
            <div class="row">
              <div class="col">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="(item,index) in data_list"
                    :key="index"
                    @click="onClick(item)"
                  >
                    {{item.name}}
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">

      <endBar
        v-show="end_bar_show"
        :target_typhoon="typhoon"
        :code="code"
        :end_bar_show="end_bar_show"
      ></endBar>

    </transition>

    <!-- <endDataList></endDataList> -->
    <!-- <endBarTest></endBarTest> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { DataList_Mid_Model } from "../../../middle_model/common";

import endBar from "../endBar/end_bar_data_list.vue";
// import endDataList from "../endBar/end_data_list.vue";
import endBarTest from "../endBar/end_bar_test.vue";

@Component({
  components: { endBar, endBarTest }
})
export default class second_bar_condition_search extends Vue {
  // 初始数据可以直接声明为实例的属性
  data_list: DataList_Mid_Model[] = [
    new DataList_Mid_Model("台风1", 1, "code_a"),
    new DataList_Mid_Model("台风2", 2, "code_b"),
    new DataList_Mid_Model("台风3", 3, "code_c")
  ];
  is_show: boolean = false;
  end_bar_show: boolean = false;
  code: string = "";
  typhoon: DataList_Mid_Model = new DataList_Mid_Model("", 0, "");
  // 组件方法也可以直接声明为实例的方法
  onClick(obj: DataList_Mid_Model): void {
    var myself = this;
    myself.code = obj.code;
    myself.end_bar_show = true;
    myself.typhoon = obj;
  }
}
</script>

<style scoped>
#condition {
  position: absolute;
  margin-left: 200px;
  margin-top: 0px;
  display: flex;
  z-index: 1999;
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
.list-group-item {
  color: black;
}
.form-group .control-label {
  color: #ffffff;
  font-family: "Lato", Helvetica, Arial, sans-serif;
}

#ty_list {
  margin-top: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  /* 0.5s动画过渡的时间 */
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 对于多条件搜索的card的一些样式 */
.card-my-header {
  background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.639));
}
/* 自动以的card-body样式 */
.card-my-body {
  background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639));
}
.btn-my {
  background: #2988d2;
}
</style>
