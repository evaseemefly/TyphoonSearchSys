<template>
  <div id="all_left_bar">
    <!-- <div class="nav flex-column nav-pills col-md-1 .bg-secondary" id="left_top_bar" role="tablist" aria-orientation="vertical">
      <a class="nav-link" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true" v-for="item in menu_list" :key="item.id" @click="is_show_condition_bar=!is_show_condition_bar">{{item.name}}
      </a>
    </div> -->
    <!-- 此处使用bt的手风琴效果实现 -->
    <div id="left_top_bar">
      <div class="card">
        <div class="card-header" id="headingOne">
          <h5 class="mb-0">
            <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              历史台风风暴潮查询
            </button>
          </h5>
        </div>
        <!-- 注意手风琴里面的data-parent需要根据id选择器指定对应的展开前的div -->
        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#left_top_bar">
          <div class="card-body">
            <ul>
              <li @click="is_show_condition_bar=!is_show_condition_bar">条件搜索</li>
              <li>条件搜索2</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <SecondBar v-show="is_show_condition_bar"></SecondBar>
    <!-- <router-view></router-view> -->
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// import { menu } from "../src/middle_model/common.ts";
// import { menu } from "../src/middle_model/common";
import { Menu_Mid_Model } from "../../../middle_model/common";

import SecondBar from "@/views/member/secondBar/second_bar_condition_search.vue";

@Component({
  components: { SecondBar }
})
export default class right_bar extends Vue {
  // 初始数据可以直接声明为实例的属性
  message: string = "Hello!";
  menu_index: number = 0;
  menu_list: Menu_Mid_Model[] = [
    new Menu_Mid_Model("条件搜索", "/search/condition"),
    new Menu_Mid_Model("搜索2", "/search/conditionByStation")
  ];
  is_show_condition_bar: boolean = false;
  // 组件方法也可以直接声明为实例的方法
  onClick(): void {
    window.alert(this.message);
  }
}
</script>

<style scoped>
#all_left_bar {
  position: relative;
}
#left_top_bar {
  position: absolute;
  margin-top: 0px;
  margin-left: 5px;
  width: 200px;
}
#headingOne {
  background: #d58f26cf;
  color: beige;
  font-size: 18;
}
/* head中的字体颜色 */
.btn-link {
  color: white;
}
.card {
  background-color: #6e88de70;
}
/* 修改card中的card-header中的button的字样 */
.btn {
  font-size: 0.91rem;
  font-weight: 480;
}
/* 去掉card-body内的20px的padding让里面的li宽度沾满 */
.card-body {
  padding: 0 0 0 0;
}
/* 去掉li前面的点 */
.card-body ul li {
  list-style: none;
  background: rgba(78, 136, 154, 0.961);
  color: rgba(17, 18, 21, 0.694);
  padding-bottom: 10px;
  padding-top: 10px;
}
/* 去掉card-body中的ul里面的左侧的间隔 */
.card-body ul {
  padding-left: 0px;
}
</style>
