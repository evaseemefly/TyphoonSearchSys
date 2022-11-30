<template>
	<div
		v-draggable
		id="station_list"
		v-loading="isLoading"
		element-loading-background="loadBackground"
		v-show="getIsShow"
	>
		<div class="form-header">
			<h4>站点数量:</h4>
			<!-- <div class="primary-title"></div> -->
			<span>{{ getStationCount }}</span>
			<div class="thumb-btn" @click="setExpanded(false)">
				<i class="fa-solid fa-minus"></i>
			</div>
			<!-- <div class="desc"></div> -->
		</div>
		<section>
			<table>
				<thead>
					<tr>
						<th>站点名称</th>
						<th>增水极值</th>
						<th>时间</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(stationTemp, index) in stationExtremumList"
						:key="stationTemp.id"
						@click="commitStationExtremum(stationTemp, index)"
						:class="index == selectedTrIndex ? 'activate' : ' '"
					>
						<td>{{ stationTemp.stationName }}</td>
						<td :class="stationTemp.surge | filterSurgeAlarmColor">
							{{ stationTemp.surge }}
						</td>
						<td>{{ stationTemp.dt | fortmatData2MDHM }}</td>
					</tr>
				</tbody>
			</table>
		</section>
		<div class="form-footer"></div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
import { DEFAULT_TY_NUM } from '@/const/default'
// 父类
// import x from './baseExpandView.vue'
// store
import {
	GET_SHOW_STATION_EXTREMUM_FORM,
	SET_SHOW_STATION_EXTREMUM_FORM,
	SET_STATION_CODE,
	SET_CURRENT_TY_FORECAST_DT,
	SET_COMPLEX_OPTS_CURRENT_STATION,
	SET_SHADE_NAV_TIME,
} from '@/store/types'
// api
import { loadStationExtremumDataList, loadStationNameDict } from '@/api/station'
// 接口
import { IHttpResponse } from '@/interface/common'
// 工具类
import { fortmatData2MDHM, filterSurgeAlarmColor, filterStationNameCh } from '@/util/filter'
// enum
import { IExpandEnum } from '@/enum/common'
/** 海洋站极值列表 */
@Component({
	filters: {
		fortmatData2MDHM,
		filterSurgeAlarmColor,
	},
})
export default class StationExtremumListView extends Vue {
	/** 台风编号(str) */
	@Prop({ default: DEFAULT_TY_NUM, type: String })
	tyNum: string

	/** 海洋站数量 */
	stationCount = 0

	/** 海洋站极值集合 */
	stationExtremumList: { stationCode: string; stationName: string; surge: number; dt: Date }[] =
		[]

	/** 海洋站名称中英文对照字典 */
	stationNameDict: { name: string; chname: string }[] = []

	/** 是否加载 */
	isLoading = false

	// isShow = true

	isExpanded = true

	mounted() {
		const self = this
		self.stationNameDict = []
		//1- 页面首次加载加载站点对应字典
		loadStationNameDict().then((res: IHttpResponse<{ name: string; chname: string }[]>) => {
			if (res.status === 200) {
				res.data.length > 0
					? res.data.forEach((temp) => {
							self.stationNameDict.push(temp)
					  })
					: ''
			}
		})
	}

	setExpanded(val: boolean): void {
		this.isExpanded = val
		this.setShowExtremumForm(val)
	}

	@Watch('tyNum')
	onTyNum(val: string): void {
		const self = this
		self.stationExtremumList = []
		this.isLoading = true
		loadStationExtremumDataList(val)
			.then(
				(
					res: IHttpResponse<
						{ station_code: string; max_val: number; max_date: string }[]
					>
				) => {
					if (res.status === 200) {
						res.data.forEach((temp) => {
							const nameEn = filterStationNameCh(
								temp.station_code,
								self.stationNameDict
							)
							self.stationExtremumList.push({
								stationCode: temp.station_code,
								stationName: nameEn,
								surge: temp.max_val,
								dt: new Date(temp.max_date),
							})
						})
					}
					// console.log(res.data)
				}
			)
			.finally(() => {
				self.isLoading = false
			})
	}

	get getStationCount(): number {
		return this.stationExtremumList.length
	}

	/** 提交选中的 海洋站极值info */
	commitStationExtremum(val: {
		stationName: string
		stationCode: string
		surge: number
		dt: Date
	}): void {
		// console.log(val)
		this.setStationCode(val.stationCode)
		this.setTyForecastDt(val.dt)
		this.setShadeTimebar(false)
		this.setStationComplexOpts({
			tyNum: this.tyNum,
			tyCode: this.tyNum,
			stationName: val.stationName,
			stationCode: val.stationCode,
		})
	}

	/** 是否显示当前窗口 条件:getShowForm */
	get getIsShow(): boolean {
		let isShow = false
		switch (this.getShowForm) {
			case IExpandEnum.UN_EXPANDED:
				isShow = false && this.isExpanded
				break
			case IExpandEnum.EXPANDED:
				// this.setExpanded(true)
				// this.isExpanded = true
				isShow = true && this.isExpanded
				break
			case IExpandEnum.UN_SELECTED:
				isShow = this.getStationCount !== 0 && this.isExpanded
				break
		}
		return isShow
	}

	/** TODO:[*] 22-11-11 注意此方法与getIsShow  */
	@Watch('getShowForm')
	onGetShowForm(val: IExpandEnum): void {
		let isShow = false
		switch (val) {
			case IExpandEnum.UN_EXPANDED:
				isShow = false && this.isExpanded
				break
			case IExpandEnum.EXPANDED:
				// this.setExpanded(true)
				this.isExpanded = true
				isShow = true && this.isExpanded
				break
			case IExpandEnum.UN_SELECTED:
				isShow = this.getStationCount !== 0 && this.isExpanded
				break
		}
		this.isExpanded = isShow
	}

	/** store -> 是否显示fom t:显示 */
	@Getter(GET_SHOW_STATION_EXTREMUM_FORM, { namespace: 'common' }) getShowForm: IExpandEnum

	/** 设置当前选中的 海洋站code */
	@Mutation(SET_STATION_CODE, { namespace: 'station' })
	setStationCode: { (val: string): void }

	/** 设置当前选中的 台风预报时刻 */
	@Mutation(SET_CURRENT_TY_FORECAST_DT, { namespace: 'typhoon' })
	setTyForecastDt: { (val: Date): void }

	@Mutation(SET_SHOW_STATION_EXTREMUM_FORM, { namespace: 'common' }) setShowExtremumForm

	/** 设置当前海洋站复杂配置 */
	@Mutation(SET_COMPLEX_OPTS_CURRENT_STATION, { namespace: 'complex' })
	setStationComplexOpts: {
		(val: { tyNum: string; tyCode: string; stationName: string; stationCode: string }): void
	}

	/** 设置 遮罩 timebar */
	@Mutation(SET_SHADE_NAV_TIME, { namespace: 'common' }) setShadeTimebar
}
</script>
<style scoped lang="less">
@import url('../../styles/base-form.less');
#station_list {
	// 统一的 shadow 效果
	@form-base-shadow();
	// 统一的边角半圆过渡
	@form-base-radius();
	@form-base-background();
	position: absolute;
	top: 80px;
	right: 450px;
	width: 300px;
	// height: 450px;
	// background-color: #20262cd9;
	z-index: 999;
	max-height: 600px;
	.form-header {
		display: flex;
		margin: 5px;
		align-items: center;
		h4 {
			color: white;
			font-size: 1.2rem;
			margin: 10px;
		}
		span {
			display: flex;
			align-items: center;
			color: white;
		}
		// +
		.thumb-btn {
			@form-header-expand();
		}
	}
	section {
		font-size: 13px;
		color: white;
		margin: 5px;
		max-height: 420px;
		overflow: auto;
		// height: 400px;
		// overflow: auto;
		table {
			width: 100%;
			tbody {
				max-height: 250px;
				// @typhoon-legend();
				tr:hover {
					background: #27ae60;
				}
				.activate {
					background: #9b59b6;
				}
			}
		}
	}
}
</style>
