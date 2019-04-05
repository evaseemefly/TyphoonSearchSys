<template>
  <div
    id="condition"
    class="col-md-8"
  >
    <div class="col-md-4 subitem_div">
      <!-- 次级菜单，搜索后加载的台风列表 -->
      <transition name="fade">
        <div
          id="ty_list"
          class="card bg-info"
          v-show="is_show"
        >
          <div class="card-header card-my-header text-white">台风列表</div>
          <div class="card-body card-my-body">
            <ul class="list-group">
              <li
                class="list-group-item list-my-group-item"
                v-for="(item,index) in typhoon_list"
                :key="index"
                @click="onClick(item)"
              >
                {{item.name}}|{{item.year}}
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { DataList_Mid_Model } from "../../../middle_model/common";

@Component({
  components: {}
})
// @Component
export default class typhoonListBar extends Vue {
  // 初始数据可以直接声明为实例的属性
  // TODO [*] 由父类传入的台风列表
  @Prop() typhoon_list: DataList_Mid_Model[];
  // data_list: DataList_Mid_Model[] = [
  //   new DataList_Mid_Model("台风1", 1, "code_a"),
  //   new DataList_Mid_Model("台风2", 2, "code_b"),
  //   new DataList_Mid_Model("台风3", 3, "code_c")
  // ];
  @Prop() is_show: boolean;

  code: string = "";
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
  background: linear-gradient(to right, #1a6865 30%, rgba(4, 107, 114, 0.639));
  font-size: 90%;
  text-shadow: 2px 2px 8px rgb(33, 32, 32);
}
/* 自动以的card-body样式 */
.card-my-body {
  background: linear-gradient(to right, #248e8a 30%, rgba(4, 107, 114, 0.639));
  padding: 8px 8px 8px 8px;
}
.btn-my {
  background: #2988d2;
}
</style>
