import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ChartsVuexMixin extends Vue {
  //  通过vuex传过来的 isStaticEchartsShow
  get isStaticEchartsShow(): boolean {
    return this.$store.state.chart.isStaticEchartsShow
  }


  //  更改当前的 isStaticEchartsShow(存在vuex中)
  set isStaticEchartsShow(val: boolean) {
    this.$store.commit('isStaticEchartsShow', val)
  }
}
