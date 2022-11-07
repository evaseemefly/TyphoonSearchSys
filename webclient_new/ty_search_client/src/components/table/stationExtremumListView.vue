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
// store
import {
	GET_SHOW_STATION_EXTREMUM_FORM,
	SET_STATION_CODE,
	SET_CURRENT_TY_FORECAST_DT,
	SET_COMPLEX_OPTS_CURRENT_STATION,
} from '@/store/types'
// api
import { loadStationExtremumDataList } from '@/api/station'
// 接口
import { IHttpResponse } from '@/interface/common'
// 工具类
import { fortmatData2MDHM, filterSurgeAlarmColor } from '@/util/filter'
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
	stationExtremumList: { stationName: string; surge: number; dt: Date }[] = []

	@Watch('tyNum')
	onTyNum(val: string): void {
		const self = this
		self.stationExtremumList = []
		loadStationExtremumDataList(val).then(
			(res: IHttpResponse<{ station_code: string; max_val: number; max_date: string }[]>) => {
				if (res.status === 200) {
					res.data.forEach((temp) => {
						self.stationExtremumList.push({
							stationName: temp.station_code,
							surge: temp.max_val,
							dt: new Date(temp.max_date),
						})
					})
				}
				// console.log(res.data)
			}
		)
	}

	get getStationCount(): number {
		return this.stationExtremumList.length
	}

	/** 提交选中的 海洋站极值info */
	commitStationExtremum(val: { stationName: string; surge: number; dt: Date }): void {
		// console.log(val)
		this.setStationCode(val.stationName)
		this.setTyForecastDt(val.dt)
		this.setStationComplexOpts({
			tyNum: this.tyNum,
			tyCode: this.tyNum,
			stationName: val.stationName,
		})
	}

	/** 是否显示当前窗口 条件:getShowForm */
	get getIsShow(): boolean {
		let isShow = false
		switch (this.getShowForm) {
			case IExpandEnum.UN_EXPANDED:
				isShow = false
				break
			case IExpandEnum.EXPANDED:
				isShow = true
				break
			case IExpandEnum.UN_SELECTED:
				isShow = this.getStationCount !== 0
				break
		}
		return isShow
	}

	/** store -> 是否显示fom t:显示 */
	@Getter(GET_SHOW_STATION_EXTREMUM_FORM, { namespace: 'common' }) getShowForm: IExpandEnum

	/** 设置当前选中的 海洋站code */
	@Mutation(SET_STATION_CODE, { namespace: 'station' })
	setStationCode: { (val: string): void }

	/** 设置当前选中的 台风预报时刻 */
	@Mutation(SET_CURRENT_TY_FORECAST_DT, { namespace: 'typhoon' })
	setTyForecastDt: { (val: Date): void }

	/** 设置当前海洋站复杂配置 */
	@Mutation(SET_COMPLEX_OPTS_CURRENT_STATION, { namespace: 'complex' })
	setStationComplexOpts: { (val: { tyNum: string; tyCode: string; stationName: string }): void }
}
</script>
<style scoped lang="less">
@import url('../../styles/base-form.less');
#station_list {
	// 统一的 shadow 效果
	@form-base-shadow();
	// 统一的边角半圆过渡
	@form-base-radius();
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
		h4 {
			color: white;
			font-size: 1.2rem;
			margin: 10px;
		}
		span {
			display: flex;
			align-items: center;
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
