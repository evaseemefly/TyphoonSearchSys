<template>
	<div id="station_alert_list" v-loading="isLoading" element-loading-background="loadBackground">
		<div class="form-header">
			<h4>站点总潮位极值集合</h4>
			<!-- <div class="primary-title"></div> -->
			<span></span>

			<!-- <div class="desc"></div> -->
		</div>
		<section>
			<table>
				<thead>
					<tr>
						<th>站点名称</th>
						<th>总潮位极值</th>
						<th>时间</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(stationTemp, index) in stationExtremumMergeList"
						:key="stationTemp.id"
						@click="commitStationExtremum(stationTemp, index)"
						:class="index == selectedTrIndex ? 'activate' : ' '"
					>
						<td>{{ stationTemp.stationName }}</td>
						<td class="null-color">
							<TideValuePrgressLineView
								:realdata="stationTemp.realdata"
								:lineWidth="84"
								:alertTides="stationTemp.alerts"
							></TideValuePrgressLineView>
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
import { List } from 'echarts'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
// 工具类
import { fortmatData2MDHM, filterSurgeAlarmColor, filterStationNameCh } from '@/util/filter'
// 其他组件
import TideValuePrgressLineView from '@/components/progress/tideValueProgressView.vue'
import { AlertTideEnum } from '@/enum/surge'
import { loadStationAlertLevelDataList, loadStationExtremumRealDataist } from '@/api/station'
import { IHttpResponse } from '@/interface/common'
import {
	SET_COMPLEX_OPTS_CURRENT_STATION,
	SET_CURRENT_TY_FORECAST_DT,
	SET_SHADE_NAV_TIME,
	SET_STATION_CODE,
} from '@/store/types'

@Component({
	filters: {
		fortmatData2MDHM,
		filterSurgeAlarmColor,
	},
	components: {
		TideValuePrgressLineView,
	},
})
export default class StationAlertListView extends Vue {
	/** 需要获取的站点codes数组 */
	@Prop({ type: Array, required: false })
	stationCodes: string[]

	stationExtremumList: {
		stationCode: string
		stationName: string
		/** 增水=实况-天文潮 */
		surge: number
		dt: Date
		/** 实况 */
		realdata: number
		/** 天文潮 */
		tide: number
	}[] = []

	stationExtremumMergeList: {
		stationCode: string
		stationName: string
		surge: number
		dt: Date
		code: string
		name_en: string
		alerts: { code: string; alert: AlertTideEnum; tide: number }[]
	}[] = []

	/** 海洋站名称中英文对照字典 */
	@Prop({ type: Array, required: true })
	stationNameDict: { name: string; chname: string }[]

	@Prop({ type: String, required: true })
	tyNum: string

	isLoading = false

	/** 当前选中的行序号 */
	selectedTrIndex = -1

	/** 页面加载时的背景颜色 */
	loadBackground = '#20262cd9'

	@Watch('tyNum')
	onTyNum(val: string): void {
		const self = this
		self.stationExtremumList = []
		this.isLoading = true
		loadStationExtremumRealDataist(val)
			.then(
				(
					res: IHttpResponse<
						{
							station_code: string
							max_val: number
							max_date: string
							realdata_val: number
							tide_val: number
						}[]
					>
				) => {
					/** 
					 * max_date: "2012-08-05T16:00:00Z"
						max_val: 534
						realdata_val: 534
						station_code: "AOJIANG"
						tide_val: 518
					 */
					if (res.status === 200) {
						let tempStationExtremumList: {
							stationCode: string
							stationName: string
							/** 增水 */
							surge: number
							dt: Date
							/** 实况 */
							realdata: number
							/** 天文潮 */
							tide: number
						}[] = []
						res.data.forEach((temp) => {
							const nameEn = filterStationNameCh(
								temp.station_code,
								self.stationNameDict
							)
							tempStationExtremumList.push({
								stationCode: temp.station_code,
								stationName: nameEn,
								surge: temp.realdata_val - temp.tide_val, // 最大潮位实况出现时对应的增水值
								realdata: temp.realdata_val, // 最大潮位实况
								tide: temp.tide_val, // 天文潮
								dt: new Date(temp.max_date),
							})
						})
						self.stationExtremumList = tempStationExtremumList
					}
					// console.log(res.data)
				}
			)
			.finally(() => {
				self.isLoading = false
			})
	}

	get maxVal(): number {
		return Math.max(
			...this.stationExtremumList.map((temp) => {
				return temp.realdata
			})
		)
	}

	@Watch('stationExtremumList')
	onStationExtremumList(
		val: {
			stationCode: string
			stationName: string
			surge: number
			dt: Date
			/** 实况 */
			realdata: number
			/** 天文潮 */
			tide: number
		}[]
	): void {
		const codes: string[] = val.map((temp) => {
			return temp.stationCode
		})
		loadStationAlertLevelDataList(codes).then(
			(
				res: IHttpResponse<
					{
						code: string
						name_en: string
						alerts: { code: string; alert: number; tide: number }[]
					}[]
				>
			) => {
				if (res.status === 200) {
					/**
					 * {
						"code": "BAO",
						"name_en": "BOAO",
						"alerts": [
							{
								"code": "BAO",
								"alert": 5001,
								"tide": 255
							},
						…]
						}
				 	*/
					// 将海洋站极值集合与四色警戒潮位集合merge
					let stationExtreMergeList = []
					val.forEach((tempTide) => {
						const filterRes = res.data.filter((temp) => {
							return temp.name_en == tempTide.stationCode
						})
						if (filterRes.length > 0) {
							const targetAlert = filterRes[0]
							let stationExtremumMerge = { ...targetAlert, ...tempTide }
							stationExtreMergeList.push(stationExtremumMerge)
						}
					})
					this.stationExtremumMergeList = stationExtreMergeList

					// console.log(res.data)
				}
			}
		)
	}

	/** 提交选中的 海洋站极值info */
	commitStationExtremum(
		val: {
			stationName: string
			stationCode: string
			surge: number
			dt: Date
		},
		index: number
	): void {
		// console.log(val)
		this.setStationCode(val.stationCode)
		this.setTyForecastDt(val.dt)
		this.setShadeTimebar(false)
		this.selectedTrIndex = index
		this.setStationComplexOpts({
			tyNum: this.tyNum,
			tyCode: this.tyNum,
			stationName: val.stationName,
			stationCode: val.stationCode,
		})
	}

	/** 设置当前选中的 海洋站code */
	@Mutation(SET_STATION_CODE, { namespace: 'station' })
	setStationCode: { (val: string): void }

	/** 设置当前选中的 台风预报时刻 */
	@Mutation(SET_CURRENT_TY_FORECAST_DT, { namespace: 'typhoon' })
	setTyForecastDt: { (val: Date): void }

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
#station_alert_list {
	margin: 5px;
	// 统一的 shadow 效果
	@form-base-shadow();
	// 统一的边角半圆过渡
	@form-base-radius();
	@form-base-background();
	// position: absolute;
	// top: 80px;
	// right: 450px;
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
