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
					<el-slider v-model="boxRadius" :step="1000" :max="3000"></el-slider>
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
			<div class="nav_item_icon" @click="submit()">
				<div class="fa-solid fa-magnifying-glass-location"></div>
			</div>
			<TyphoonListView
				:typhoonList="filterTyList"
				:filterTyCount="filterTyCount"
				:isLoading="isLoadingTyList"
			></TyphoonListView>
			<!-- <i class="nav_item_icon fa-solid fa-eraser"></i>
			<div class="fa-solid fa-house"></div> -->
		</nav>
		<SubNavTimeItem
			:forecastDt="forecastDt"
			:step="1"
			@updateForecastDt="updateForecastDt"
		></SubNavTimeItem>
	</nav>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation, Getter } from 'vuex-class'
import SubNavTimeItem from '@/components/nav/subItems/SubNavTimeItem.vue'
import TyphoonListView from '@/components/table/tyListView.vue'
//
import * as L from 'leaflet'
// store
import {
	SET_IS_SELECT_LOOP,
	SET_BOX_LOOP_RADIUS,
	GET_BOX_LOOP_LATLNG,
	GET_CURRENT_TY_FORECAST_DT,
	SET_CURRENT_TY_FORECAST_DT,
	GET_DATE_STEP,
	SET_SELECTED_LOOP,
} from '@/store/types'
// 默认常量
import {
	DEFAULT_BOX_LOOP_RADIUS,
	DEFAULT_BOX_LOOP_RADIUS_UNIT,
	DEFAULT_DATE,
	DEFAULT_DATE_STEP,
} from '@/const/default'
// api
import { loadTyListByRange } from '@/api/typhoon'
// mid model
import { FilterTyMidModel } from '@/middle_model/typhoon'
/** + 22-10-14 副导航栏(布局:底部) */
@Component({
	components: { SubNavTimeItem, TyphoonListView },
})
export default class SubNavMenuView extends Vue {
	/** 是否圈选 */
	checkedSelectLoop = false
	boxRadius = DEFAULT_BOX_LOOP_RADIUS

	/** 筛选后的台风集合 */
	filterTyList: FilterTyMidModel[] = []
	filterTyCount = 0
	/** 是否在加载筛选后的台风集合 */
	isLoadingTyList = false

	get selectLoopCls(): string {
		return this.checkedSelectLoop ? 'activate' : 'un_activate'
	}

	forecastDt: Date = new Date()

	/** 时间间隔 */
	dateStep: number = DEFAULT_DATE_STEP

	@Watch('checkedSelectLoop')
	onCheckedSelectLoop(val: boolean): void {
		this.setIsSelectLoop(val)
	}

	/** 获取最终需要提交的 box range = radis*unit */
	get submitBoxRadius(): number {
		return this.boxRadius * DEFAULT_BOX_LOOP_RADIUS_UNIT
	}

	@Watch('boxRadius')
	onBoxRadius(val: number): void {
		this.setBoxLoopRadius(val)
	}
	submit(): void {
		const data: { boxLoopLatlng: L.LatLng; boxRadius: number } = {
			boxLoopLatlng: this.getBoxLoopLatlng,
			boxRadius: this.submitBoxRadius,
		}
		const self = this
		this.filterTyList = []
		this.isLoadingTyList = true
		loadTyListByRange({
			latlon: [data.boxLoopLatlng.lat, data.boxLoopLatlng.lng],
			range: data.boxRadius,
		})
			.then(
				(res: {
					status: number
					data: {
						list: { code: string; nameCh: string; num: string; year: number }[]
						total: number
					}
				}) => {
					/*
			  list: Array(8)
				0: {code: 'Yuri', year: 1991, num: '9128', nameCh: null}				
				[[Prototype]]				
				total: 18
			*/
					if (res.status === 200 && res.data.list.length > 0) {
						console.log(res.data)
						self.filterTyCount = res.data.total
						res.data.list.forEach((temp) => {
							self.filterTyList.push(
								new FilterTyMidModel(
									temp.code,
									temp.nameCh === null ? '-' : temp.nameCh,
									temp.num,
									temp.year
								)
							)
						})
					}
				}
			)
			.finally(() => {
				self.isLoadingTyList = false
			})
		// console.log(data)
	}

	/** 更新当前的 预报时刻  */
	updateForecastDt(val: Date): void {
		this.forecastDt = val
		this.setTyForecastDt(val)
	}

	@Getter(GET_BOX_LOOP_LATLNG, { namespace: 'map' }) getBoxLoopLatlng

	@Getter(GET_CURRENT_TY_FORECAST_DT, { namespace: 'typhoon' }) getTyForecastDt

	@Getter(GET_DATE_STEP, { namespace: 'common' }) getDateStep

	/** 设置是否进行圈选操作 */
	@Mutation(SET_IS_SELECT_LOOP, { namespace: 'map' }) setIsSelectLoop

	/** 设置圈选的半径 */
	@Mutation(SET_BOX_LOOP_RADIUS, { namespace: 'map' }) setBoxLoopRadius

	/** 设置当前台风预报时间 */
	@Mutation(SET_CURRENT_TY_FORECAST_DT, { namespace: 'typhoon' }) setTyForecastDt

	/** 设置 选中圈选 */
	// @Mutation(SET_SELECTED_LOOP, { namespace: 'common' }) setSelectedLoop

	@Watch('getTyForecastDt')
	onTyForecast(val: Date): void {
		this.forecastDt = val
	}

	@Watch('getDateStep')
	onDateStep(val: number): void {
		this.dateStep = val
	}
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
