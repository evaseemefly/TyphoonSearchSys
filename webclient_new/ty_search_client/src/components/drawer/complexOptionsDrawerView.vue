<template>
	<div>
		<el-drawer
			title="配置项"
			:visible.sync="drawer"
			:direction="direction"
			:before-close="handleClose"
			:size="drawerSize"
		>
			<div class="drawer-content">
				<div class="options-drawer-card-root">
					<!-- <TyphoonOptionsCard
						:defaultOptionsItems="tyGroupDefaultOptions"
					></TyphoonOptionsCard> -->
					<TyUniqueSearchCard></TyUniqueSearchCard>
				</div>
			</div>
		</el-drawer>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation, namespace, Getter } from 'vuex-class'
import OptionsDrawerCard from '@/components/cards/baseOptionsCard.vue'
import TyphoonOptionsCard from '@/components/cards/tyOptionsCard.vue'
import TyUniqueSearchCard from '@/components/cards/tyUniqueSearchCard.vue'
// vuex 常量
import {
	GET_SHOW_OPTS_FORM,
	SET_SHOW_OPTS_FORM,
	SET_TY_GROUP_PATH_LATERS_OPTS,
} from '@/store/types'
import { TO_CLOSE_COMPLEX_OPTS_DRAWER } from '@/bus/types'
import { EventBus } from '@/bus/BUS'
// 配置项抽屉
@Component({ components: { OptionsDrawerCard, TyphoonOptionsCard, TyUniqueSearchCard } })
export default class OptionsDrawer extends Vue {
	@Prop({ type: Boolean, default: false })
	drawer: boolean

	direction = 'ltr'
	drawerSize = '20%' // 设置抽屉的宽度

	handleClose(): void {
		// 触发父组件的关闭操作
		this.$emit('setClose')
	}

	tyGroupDefaultOptions: {
		cardTitle: string
		options: { title: string; key: number; val: string; checked: boolean }[]
	} = {
		cardTitle: '',
		options: [
			{
				title: '台风中心路径',
				key: 1,
				val: 'opt1',
				checked: true,
			},
			{
				title: '集合路径外轮廓',
				key: 2,
				val: 'opt3',
				checked: true,
			},
			{
				title: '台风实时信息框',
				key: 3,
				val: 'opt4',
				checked: false,
			},
		],
	}

	mounted() {
		// TODO:[-] 22-03-15 将 tyGroupDefaultOptions 同步至 store 中
		this.setTyGroupPathLayersOpts(this.getOptionVals)
	}

	created() {
		EventBus.$on(TO_CLOSE_COMPLEX_OPTS_DRAWER, this.handleClose)
	}

	get getOptionVals(): number[] {
		const children = this.tyGroupDefaultOptions.options.filter((child) => {
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

	@Getter(GET_SHOW_OPTS_FORM, { namespace: 'common' }) getShowOptsForm

	@Watch('getShowOptsForm')
	onIsShowOptsForm(val: boolean): void {
		this.drawer = val
	}

	// @Watch

	@Mutation(SET_SHOW_OPTS_FORM, { namespace: 'common' }) setShowOptsForm

	@Mutation(SET_TY_GROUP_PATH_LATERS_OPTS, { namespace: 'opts' }) setTyGroupPathLayersOpts
}
</script>
<style lang="less">
.el-drawer.ltr {
	background: #34495ee5;
	backdrop-filter: blur(4px);
}
.drawer-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.options-drawer-card-root {
	width: 80%;
}
</style>
