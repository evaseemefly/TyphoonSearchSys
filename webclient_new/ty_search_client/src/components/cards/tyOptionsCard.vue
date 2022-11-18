<!--
* 注意在子组件继承父组件中，子组件只修改 script , template 与 style 不需要加入否则会覆盖
*
-->
<script lang="ts">
// --
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import IBaseOptionsCard from '@/components/cards/baseOptionsCard.vue'
// -- store
import { SET_TY_GROUP_PATH_LATERS_OPTS } from '@/store/types'
@Component({})
export default class TyphoonOptionsCard extends IBaseOptionsCard {
	optionItems: {
		cardTitle: string
		options: { title: string; key: number; val: string; checked: boolean }[]
	} = { cardTitle: '台风集合路径配置项', options: [] }
	mounted() {
		this._initData()
	}

	_initData() {
		// TODO:[-] 22-03-15 注意此处由于通过计算属性监听 optionItems 的变化，所以需要在 mounted 中进行初始化的操作
		this.optionItems = this.defaultOptionsItems
	}

	get getOptionVals(): number[] {
		const children = this.optionItems.options.filter((child) => {
			return child.checked === true
		})
		const keys = []
		if (children.length > 0) {
			children.forEach((child) => {
				if (child != undefined) {
					keys.push(child.key)
				}
			})
		}
		return keys
	}

	@Watch('getOptionVals', { immediate: true })
	onOptionVals(vals: number[]): void {
		// console.log(`监听到optionsvals:${vals}`)
		this.setTyGroupPathLayersOpts(vals)
	}

	@Mutation(SET_TY_GROUP_PATH_LATERS_OPTS, { namespace: 'opts' }) setTyGroupPathLayersOpts
}
</script>
