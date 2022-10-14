<template>
	<nav id="sub_nav_menu">
		<!-- sub-nav-menu -->
		<!-- <div class="nav_menu-item" v-for="menItem in menuList" :key="menItem.id">
			{{ menItem.title }}
		</div> -->
		<nav class="nav_item_icons">
			<i class="fa-solid fa-house"></i>
		</nav>
		<nav class="nav_item_icons">
			<!-- <div class="fa-solid fa-house"></div> -->
			<i class="fa-solid fa-anchor-circle-check"></i>
			<i class="fa-solid fa-eraser"></i>
		</nav>
		<SubNavTimeItem></SubNavTimeItem>
	</nav>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SubNavTimeItem from '@/components/nav/subItems/SubNavTimeItem.vue'
/** + 22-10-14 副导航栏(布局:底部) */
@Component({
	components: { SubNavTimeItem },
})
export default class SubNavMenuView extends Vue {
	mydata: any = null
	mounted() {}
	get computedTest() {
		return null
	}
}
</script>
<style scoped lang="less">
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
		svg {
			margin-left: 5px;
			margin-right: 5px;
		}
	}
}
</style>
