import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ConditionSearch from "./views/member/secondBar/second_bar_condition_search.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/index",
      name: "index",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      children: [
        {
          path: "/search/condition",
          name: "condition",
          component: ConditionSearch
        }
      ],

      component: () =>
        import(/* webpackChunkName: "about" */ "./views/index/index_bar.vue")
    }
    // {
    //   path: '/search',
    //   name: 'search',
    //   children: [
    //     {
    //       path: 'condition',
    //       name: 'condition',
    //       component: ConditionSearch
    //     }
    //   ]
    // }
    // {
    //   path: '/search/condition',
    //   name: 'condition',
    //   component: ConditionSearch
    // }
  ]
});
