<template>
  <ul class="main-leftbar bg-dark">
    <li class="item-title">
      <a>历史暴风潮查询</a>
    </li>
    <li
      class="item-title"
      v-on:click="showCondition=!showCondition"
    >
      <a>条件搜索</a>
    </li>
    <transition name="fade">
      <li v-show="showCondition">
        <conditionSearch></conditionSearch>
      </li>
    </transition>
    <li class="item-title">
      <a>登陆地搜索</a>
    </li>
  </ul>
</template>
<script lang="ts">
import Vue from "vue";
import ConditionSearch from "@/views/Main/LeftBar/SubItem/ConditionSearch.vue";
export default Vue.extend({
  data() {
    return {
      showCondition: false
    };
  },
  methods: {},
  components: {
    ConditionSearch
  }
});
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
}

.main-leftbar {
  height: 100%;
  display: inline-block;
  height: 100%;
  background: green;
  color: white;
  font-family: "微软雅黑";
  list-style: none;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: 0.5s;
}
.main-leftbar > li {
  padding-left: 5px;
  padding-right: 5px;
  margin: 5px;
}
.item-title {
  font-size: 20px;
}
.item-title:hover {
  opacity: 0.5;
  cursor: pointer;
  box-shadow: 1px 1px 1px black;
}
</style>


