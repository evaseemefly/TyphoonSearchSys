<template>
  <div id="condition" class="col-md-3">
    <div class="col-md-12 subitem_div">
      <!-- 次级菜单，搜索后加载的台风列表 -->
      <transition name="fade">
        <div id="ty_list" class="card bg-info" v-show="is_show">
          <div class="card-header card-my-header text-white">台风列表</div>
          <div class="card-body card-my-body">
            <ul class="list-group">
              <li
                class="list-group-item list-my-group-item"
                v-for="(item,index) in typhoon_list"
                :key="index"
                @click="onClick(item)"
              >name:{{item.name}}|num:{{item.num}}|{{item.year}}</li>
            </ul>
            <!-- TODO:[*] 19-05-14 注意此处设置pager-count为3时，会提示出错
            貌似是插件的bug，参考：https://github.com/ElemeFE/element/issues/14055-->
            <el-pagination
              background
              layout="prev, pager, next"
              :total="typhoonCodeDataTotal"
              :page-size="typhoonCodePageSize"
              :pager-count="3"
              @current-change="onCurrentIndex"
            ></el-pagination>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { DataList_Mid_Model } from "../../../middle_model/common";

// 使用mixin的方式拓展data
import TyphoonListBarDataMixin from "./typhoon_list_bar/typhoon_list_bar_data_mixin";
import { mixins } from "vue-class-component";

@Component({
  components: {}
})
// @Component
export default class typhoonListBar extends mixins(TyphoonListBarDataMixin) {
  // 初始数据可以直接声明为实例的属性
  // TODO [*] 由父类传入的台风列表
  @Prop() typhoon_list: DataList_Mid_Model[];
  // data_list: DataList_Mid_Model[] = [
  //   new DataList_Mid_Model("台风1", 1, "code_a"),
  //   new DataList_Mid_Model("台风2", 2, "code_b"),
  //   new DataList_Mid_Model("台风3", 3, "code_c")
  // ];
  @Prop() is_show: boolean;
  @Prop() typhoonCodePageSize: number;
  @Prop() typhoonCodeDataTotal: number;
  @Prop() typhoonCodePageIndex: number;

  // typhoon: DataList_Mid_Model = new DataList_Mid_Model("", 0, "");
  // 组件方法也可以直接声明为实例的方法
  onClick(obj: DataList_Mid_Model): void {
    var myself = this;
    myself.code = obj.code;
    myself.typhoon = obj;
  }

  // TODO [*] 19-03-22 通过vuex获取当前选中的台风
  get typhoon(): DataList_Mid_Model {
    return this.$store.state.map.typhoon;
  }

  set typhoon(val: DataList_Mid_Model) {
    this.$store.commit("typhoon", val);
  }

  @Watch("is_show")
  onIsShow(val: boolean) {
    // alert(val);
  }

  // 当前选中的page index（注意默认1为开始注意减1）
  onCurrentIndex(val, number) {
    var index = val - 1;
    console.log(val);
    // 调用父组件中的修改 page index 的方法
    this.$emit("setCurrentIndex", index);
  }
}
</script>

<style scoped>
#condition {
  position: absolute;
  top: 100px;
  left: 50px;
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

/* 覆盖磨人的样式，绿色线性渐变并加入一个透明效果 */
.bg-info {
  background: linear-gradient(
    to right,
    #1a6865 30%,
    rgba(4, 107, 114, 0.639)
  ) !important;
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
/* #condition .card-my-header {
  background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.639));
  font-size: 90%;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
} */

/* 自动以的card-body样式 */
#my_condition .card-my-body {
  /* background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639)); */
  padding-left: 24px;
}

/* 对于多条件搜索的card的一些样式 */
.card-my-header {
  /* 19-05-14 备份 */
  /* background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.639)); */
  background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.096));
  font-size: 90%;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}
/* 自动以的card-body样式 */
.card-my-body {
  /* 19-05-14 备份 */
  /* background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639)); */
  background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.096));
  padding: 8px 8px 8px 8px;
}
.btn-my {
  background: #2988d2;
}
</style>
