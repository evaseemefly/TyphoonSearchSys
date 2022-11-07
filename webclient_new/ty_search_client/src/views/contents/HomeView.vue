<template>
	<div class="home">
		<div class="layout-top">
			<div class="layout-left"><MainNavMenuView></MainNavMenuView></div>
			<div class="layout-right"><MainMapView></MainMapView></div>
		</div>
		<div class="layout-bottom"><SubNavMenuView></SubNavMenuView></div>
		<div><StationTideFormView></StationTideFormView></div>
		<StationExtremumListView :tyNum="tyNum"></StationExtremumListView>
		<ThumbListView></ThumbListView>
		<HeaderLogoView title="历史台风风暴潮查询系统"></HeaderLogoView>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'

import MainNavMenuView from '@/components/nav/MainNavMenuView.vue'
import SubNavMenuView from '@/components/nav/SubNavMenuView.vue'
import MainMapView from '@/views/map/MapView.vue'
import StationTideFormView from '@/components/form/stationTideForm.vue'
import StationExtremumListView from '@/components/table/stationExtremumListView.vue'
import ThumbListView from '@/components/thumbs/thumbListView.vue'
import HeaderLogoView from '@/components/header/headerLogoView.vue'
// mid model
import { FilterTyMidModel } from '@/middle_model/typhoon'
// store
import { GET_CURRENT_TY } from '@/store/types'
// 默认值
import { DEFAULT_TY_NUM } from '@/const/default'

@Component({
	components: {
		MainNavMenuView,
		SubNavMenuView,
		MainMapView,
		StationTideFormView,
		StationExtremumListView,
		ThumbListView,
		HeaderLogoView,
	},
})
export default class HomeView extends Vue {
	@Getter(GET_CURRENT_TY, { namespace: 'typhoon' }) getCurrentTy

	/** 当前台风编号 */
	tyNum: string = DEFAULT_TY_NUM

	/** 当前选中的台风 */
	@Watch('getCurrentTy')
	onCurrentTy(val: FilterTyMidModel): void {
		this.tyNum = val !== null ? val.tyNum : DEFAULT_TY_NUM
	}
}
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
