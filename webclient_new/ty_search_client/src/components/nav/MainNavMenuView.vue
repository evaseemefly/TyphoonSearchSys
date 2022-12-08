<template>
	<div>
		<nav id="main_nav_menu">
			<!-- <font-awesome-icon :icon="menuItem.icons" v-for="menuItem in menuList" :key="menuItem.id" /> -->
			<div
				class="nav_menu-item"
				v-for="menuItem in menuList"
				:key="menuItem.id"
				@click="selectedNavMenu = menuItem.menuType"
			>
				<i class="fa fa-1x" :class="menuItem.icon"></i>
			</div>
			<!-- <div ></div> -->
		</nav>
		<!-- <div v-show="isShowContent"></div> -->
		<ComplexOptionsDrawerView
			:drawer="isShowContent"
			@setClose="setCloseDrawer"
		></ComplexOptionsDrawerView>
	</div>
</template>
<script lang="ts">
import { MainNavMenuType } from '@/enum/menu'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ComplexOptionsDrawerView from '@/components/drawer/complexOptionsDrawerView.vue'
/** + 22-10-14 主要的导航栏(布局左侧) */
const DEFAULT_NAV_CLS = 'nav_menu-item'
@Component({
	components: {
		ComplexOptionsDrawerView,
	},
})
export default class MainNavMenuView extends Vue {
	mydata: any = null
	// isShowContent = false
	selectedNavMenu: MainNavMenuType = MainNavMenuType.NULL
	menuList: {
		title: string
		desc: string
		icon: string
		icons: string[]
		menuType: MainNavMenuType
	}[] = [
		{
			title: '台风点选',
			desc: '测试1测试1测试1',
			icon: `fa-solid fa-hurricane`,
			icons: ['fa-solid', 'fa-hurricane'],
			menuType: MainNavMenuType.FILTER_BY_DISTANCE,
		},
		{
			title: '台风复杂查询',
			desc: '测试1测试1测试1',
			icon: `fa-solid fa-magnifying-glass-location`,
			icons: ['fa-solid', 'fa-magnifying-glass-location'],
			menuType: MainNavMenuType.FILTER_BY_COMPLEX,
		},
		{
			title: '测试3',
			desc: '测试1测试1测试1',
			icon: `fa-solid fa-chart-simple`,
			icons: ['fa-solid', 'fa-magnifying-glass-location'],
			menuType: MainNavMenuType.NULL,
		},
	]

	/** 关闭 drawer */
	setCloseDrawer(): void {
		this.selectedNavMenu = MainNavMenuType.NULL
	}

	get isShowContent(): boolean {
		let isShow = false
		switch (this.selectedNavMenu) {
			case MainNavMenuType.NULL:
				isShow = false
				break
			case MainNavMenuType.FILTER_BY_DISTANCE:
				isShow = false
				break
			case MainNavMenuType.FILTER_BY_COMPLEX:
				isShow = true
				break
		}
		return isShow
	}
}
</script>
<style scoped lang="less">
#main_nav_menu {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	// background: #34495e;
	color: white;
	width: 50px;
	.nav_menu-item {
		background: #2c3e50;
		// margin: 10px;
		height: 40px;
		width: 40px;
		border-radius: 8px;
		// box-shadow: inset 0 0 2px rgb(255 255 255 / 40%), inset 0 0 16px 12px #141a22;
		box-shadow: 0 0 5px 0px black;
		display: flex;
		justify-content: center;
		/* align-content: center; */
		align-items: center;
		margin-top: 5px;
		margin-bottom: 5px;
	}
}
</style>
