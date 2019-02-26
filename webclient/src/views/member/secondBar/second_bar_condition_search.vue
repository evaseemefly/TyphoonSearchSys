<template>
  <div
    id="condition"
    class="col-md-8"
  >
    <form
      id="search_form"
      class="form-horizontal col-md-6"
    >
      <!--输入权限名称以及是否选中信息-->
      <!--权限基本信息-->
      <fieldset>
        <!--域的标题-->
        <legend>多条件搜索</legend>
        <!--单独的表单控件会被自动赋予一些全局样式。										
									所有设置了 .form-control 类的 <input>、<textarea> 和 <select> 元素都将被默认设置宽度属性为 width: 100%;。 
										将 label 元素和前面提到的控件包裹在 .form-group 中可以获得最好的排列。-->
        <div class="form-group row">
          <label
            class="col-sm-2 control-label"
            for="ds_host"
          >死亡人数</label>
          <div class="col-sm-4">
            <input
              class="form-control"
              id="ds_host"
              type="text"
              placeholder="死亡人数"
            />
          </div>
          <label
            class="col-sm-2 control-label"
            for="ds_host"
          >经济损失</label>
          <div class="col-sm-4">
            <input
              class="form-control"
              id="ds_username"
              type="text"
              placeholder="损失"
            />
          </div>

        </div>
        <div class="form-group row">
          <label
            class="col-sm-2 control-label"
            for="ds_username"
          >增水</label>
          <div class="col-sm-4">
            <input
              class="form-control"
              id="ds_username"
              type="text"
              placeholder="增水"
            />
          </div>
          <label
            class="col-sm-2 control-label"
            for="ds_username"
          >潮位</label>
          <div class="col-sm-4">
            <input
              class="form-control"
              id="ds_username"
              type="text"
              placeholder="潮位"
            />
          </div>
        </div>
        <div class="form-group row">
          <label
            class="col-sm-2 control-label"
            for="ds_username"
          >级别</label>
          <div class="col-sm-4">
            <input
              class="form-control"
              id="ds_username"
              type="text"
              placeholder="级别"
            />
          </div>
          <label
            class="col-sm-2 control-label"
            for="ds_username"
          >风速</label>
          <div class="col-sm-4">
            <input
              class="form-control"
              id="ds_username"
              type="text"
              placeholder="风速"
            />
          </div>
        </div>
        <div class="form-group row">
          <label
            class="col-sm-2 control-label"
            for="ds_username"
          >气压</label>
          <div class="col-sm-4">
            <input
              class="form-control"
              id="ds_username"
              type="text"
              placeholder="气压"
            />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-10">
            <button
              type="submit"
              class="btn btn-primary"
            >搜索</button>
          </div>
        </div>
      </fieldset>
    </form>
    <div
      id="data_list"
      class="col-md-6"
    >
      <ul>
        <!-- <li v-for="(item,index) in data_list">{{item.name}}</li> -->
        <li
          v-for="(item,index) in data_list"
          :key="index"
          @click="onClick(item)"
        >
          {{item.name}}
        </li>
      </ul>
    </div>
    <endBar></endBar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { DataList_Mid_Model } from "../../../middle_model/common";

import endBar from "../endBar/end_bar_data_list.vue";

@Component({
  components: { endBar }
})
export default class second_bar_condition_search extends Vue {
  // 初始数据可以直接声明为实例的属性
  data_list: DataList_Mid_Model[] = [
    new DataList_Mid_Model("台风1", 1, "code_a"),
    new DataList_Mid_Model("台风2", 2, "code_b"),
    new DataList_Mid_Model("台风3", 3, "code_c")
  ];
  // 组件方法也可以直接声明为实例的方法
  onClick(message: string): void {
    window.alert(message);
  }
}
</script>

<style>
#condition {
  position: absolute;
  margin-left: 110px;
  margin-top: 0px;
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
</style>
