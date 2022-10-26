<template>
	<div class="home">
		<div class="layout-top">
			<div class="layout-left"><MainNavMenuView></MainNavMenuView></div>
			<div class="layout-right"><MainMapView></MainMapView></div>
		</div>
		<div class="layout-bottom"><SubNavMenuView></SubNavMenuView></div>
		<div><StationTideFormView></StationTideFormView></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainNavMenuView from '@/components/nav/MainNavMenuView.vue'
import SubNavMenuView from '@/components/nav/SubNavMenuView.vue'
import MainMapView from '@/views/map/MapView.vue'
import StationTideFormView from '@/components/form/stationTideForm.vue'

@Component({
	components: {
		MainNavMenuView,
		SubNavMenuView,
		MainMapView,
		StationTideFormView,
	},
})
export default class HomeView extends Vue {}
</script>

<style scoped lang="less">
@import '../../styles/base';
.home {
	@center();
	flex-direction: column;
	.layout-top {
		height: 100%;
		// background: green;
		display: flex;
		flex-direction: row;
		.layout-left {
			margin: 5px;
			background: #34495e;
			border-radius: 8px;
			box-shadow: 0 0 10px 0px black;
		}
		.layout-right {
			margin-top: 5px;
			width: 100%;
			background: #34495e;
			border-radius: 8px;
			margin-right: 5px;
			margin-bottom: 5px;
			box-shadow: 0 0 10px 0px black;
			// 防止地图溢出
			overflow: hidden;
		}
	}
	.layout-bottom {
		height: 50px;
		// TODO:[-] 22-10-17 win 系统中的浏览器会出现垂直和水平的滚动条
		// width: 100%;
		background: #34495e;
		border-radius: 8px;
		margin: 5px;
		box-shadow: 0 0 10px 0px black;
		display: flex;
		align-content: center;
		justify-content: center;
	}
}
</style>
