<template>
	<nav id="sub_nav_menu">
		<!-- sub-nav-menu -->
		<!-- <div class="nav_menu-item" v-for="menItem in menuList" :key="menItem.id">
			{{ menItem.title }}
		</div> -->
		<nav class="nav_item nav_item_icons">
			<div class="nav_item_icon fa-solid fa-house"></div>
		</nav>
		<nav class="nav_item nav_item_icons un_padding">
			<div class="nav_item_icon">
				<!-- <div
					:class="[
						checkedSelectLoop ? 'activate' : 'un_activate',
						'nav_item_icon',
						'fa-solid fa-anchor-circle-check',
					]"
				></div> -->
				<div
					:class="[checkedSelectLoop ? 'activate' : 'un_activate', , 'nav_item_icon']"
					@click="checkedSelectLoop = !checkedSelectLoop"
				>
					<i class="fa-solid fa-anchor-circle-check"></i>
				</div>
				<div class="hidden_box_radius" v-show="checkedSelectLoop">
					<el-slider v-model="boxRadius" :step="10" :max="1000"></el-slider>
				</div>
				<!-- <div
					class="nav_item_icon fa-solid fa-anchor-circle-check"
					:class="{ checkedSelectLoop: activate }"
				></div> -->
				<!-- <i class="nav_item_icon fa-solid fa-anchor-circle-check"></i> -->
			</div>
			<div class="nav_item_icon">
				<div class="nav_item_icon fa-solid fa-eraser"></div>
			</div>
			<!-- <i class="nav_item_icon fa-solid fa-eraser"></i>
			<div class="fa-solid fa-house"></div> -->
		</nav>
		<SubNavTimeItem></SubNavTimeItem>
	</nav>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation, Getter } from 'vuex-class'
import SubNavTimeItem from '@/components/nav/subItems/SubNavTimeItem.vue'
// store
import { SET_IS_SELECT_LOOP, SET_BOX_LOOP_RADIUS } from '@/store/types'
// 默认常量
import { DEFAULT_BOX_LOOP_RADIUS } from '@/const/default'

/** + 22-10-14 副导航栏(布局:底部) */
@Component({
	components: { SubNavTimeItem },
})
export default class SubNavMenuView extends Vue {
	/** 是否圈选 */
	checkedSelectLoop = false
	boxRadius = DEFAULT_BOX_LOOP_RADIUS
	get selectLoopCls(): string {
		return this.checkedSelectLoop ? 'activate' : 'un_activate'
	}

	@Watch('checkedSelectLoop')
	onCheckedSelectLoop(val: boolean): void {
		this.setIsSelectLoop(val)
	}

	@Watch('boxRadius')
	onBoxRadius(val: number): void {
		this.setBoxLoopRadius(val)
	}

	/** 设置是否进行圈选操作 */
	@Mutation(SET_IS_SELECT_LOOP, { namespace: 'map' }) setIsSelectLoop

	/** 设置圈选的半径 */
	@Mutation(SET_BOX_LOOP_RADIUS, { namespace: 'map' }) setBoxLoopRadius
}
</script>
<style scoped lang="less">
@import '../../styles/btn.less';
.nav_item {
	// transition: all 0.5s;
}

.un_padding {
	padding: 0px !important;
}
.hidden_box_radius {
	width: 80px;
	margin-left: 10px;
	margin-right: 10px;
}

#sub_nav_menu {
	display: flex;
	// flex-direction: column;
	// height: 100%;
	width: 100%;
	background: #34495e;
	color: white;
	.nav_menu-item {
		background: #2c3e50;
	}
	.nav_item_icons {
		background: #233446;
		padding: 5px;
		margin: 5px;
		border-radius: 8px;
		display: flex;
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 36px;
		overflow: hidden;
		svg {
			margin-left: 5px;
			margin-right: 5px;
		}
	}
}
</style>
