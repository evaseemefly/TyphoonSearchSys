<template>
	<div
		id="station_chart_form"
		class="my-detail-form"
		v-loading="isLoading"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(49, 59, 89, 0.733)"
	>
		<!-- 对于非集合路径才提供叠加天文潮位的选项 -->
		<div id="station_charts"></div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
import * as echarts from 'echarts'
// 常量
import { DEFAULT_ALERT_TIDE, DEFAULT_SURGE_DIFF } from '@/const/default'
// 接口
import { IHttpResponse } from '@/interface/common'
import {
	DEFAULT_STATION_CODE,
	DEFAULT_STATION_NAME,
	DEFAULT_TY_CODE,
	DEFAULT_TY_NAME,
	DEFAULT_TY_NUM,
	DEFAULT_SURGE_VAL,
} from '@/const/default'
//
// 枚举
import { AlertTideEnum } from '@/enum/surge'

//
import { GET_CURRENT_TY_FORECAST_DT, GET_STATION_CODE } from '@/store/types'
// api
import { loadStationAlertLevelDataList, loadStationDetailDataList } from '@/api/station'
// 工具方法
import { fortmatData2YMDHM, fortmatData2MDHM } from '@/util/filter'
import moment from 'moment'
import { MenuType } from '@/enum/menu'
import station from '@/store/modules/station'

const MARGIN_TOP = 20
const MARGIN_BOTTOM = 20

@Component({})
export default class TideChartView extends Vue {
	@Prop({ default: DEFAULT_STATION_CODE })
	stationCode: string

	@Prop({ default: DEFAULT_STATION_NAME })
	stationName: string

	@Prop({ default: DEFAULT_TY_CODE })
	tyCode: string

	@Prop({ default: DEFAULT_TY_NUM })
	tyNum: string

	isLoading = false

	/** 当前的图表charts对象(唯一) */
	myChart: echarts.ECharts = null

	/** 预报时间列表 */
	forecastDtList: Date[] = []
	/** 预报值(天文潮)列表 */
	forcastValList: number[] = []

	/** 实况值列表 */
	realValList: number[] = []

	/** 增水列表 */
	stormSurgeValList: number[] = []

	// 22-02-21 注意四色警戒潮位是对应的总潮位值
	alertBlue: number = DEFAULT_ALERT_TIDE
	alertYellow: number = DEFAULT_ALERT_TIDE
	alertOrange: number = DEFAULT_ALERT_TIDE
	alertRed: number = DEFAULT_ALERT_TIDE
	d85Diff: number = DEFAULT_SURGE_DIFF
	surgeDiff: number = DEFAULT_SURGE_DIFF

	yAxisMin = 0
	yAxisMax = 0

	initCharts(
		yForecastList: number[],
		yRealList: number[],
		ySurgeList: number[],
		xList: Date[]
	): void {
		const that = this
		const nodeDiv = document.getElementById('station_charts')
		if (nodeDiv) {
			const myChart: echarts.ECharts = echarts.init(nodeDiv)
			// this.surgeByGroupPath = []
			const option = {
				title: {
					text: `${that.stationName}`,
					subtext: '潮位站',
					textStyle: {
						color: '#f8f8f7',
					},
				},
				tooltip: {
					trigger: 'axis',
					showContent: true,
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#d4e257',
							formatter: (params): string => {
								return fortmatData2MDHM(params.value)
							},
						},
					},
					// valueFormatter: (val) => val.toFixed(1),
					formatter: (params: { seriesName: string; data: number }[]): string => {
						// + 22-10-26 params[0]:天文潮 ; params[1]:实况
						let content = '---'
						const surgeForecast = params[0].data
						const surgeReal = params[1].data

						content = `蓝色警戒潮位:${
							that.alertBlue !== DEFAULT_ALERT_TIDE ? that.alertBlue : '-'
						}</br>
						黄色警戒潮位:${that.alertYellow !== DEFAULT_ALERT_TIDE ? that.alertYellow : '-'}</br>
						橙色警戒潮位:${that.alertOrange !== DEFAULT_ALERT_TIDE ? that.alertOrange : '-'}</br>
						红色警戒潮位:${that.alertRed !== DEFAULT_ALERT_TIDE ? that.alertRed : '-'}</br>
						------</br>
						天文潮位:${surgeForecast}</br>
						实况潮位:${surgeReal}</br>
						风暴增水:${surgeReal - surgeForecast}</br>
						
						`

						return content
					},
				},
				legend: {
					data: [
						{
							name: '天文潮位',
							itemStyle: {
								color: '#ACEDD9',
							},
							textStyle: {
								color: '#ACEDD9',
							},
						},
						{
							name: '实况',
							itemStyle: {
								color: '#FE7BBF',
							},
							textStyle: {
								color: '#FE7BBF',
							},
						},
						{
							name: '风暴增水',
							itemStyle: {
								color: 'rgba(255, 191, 0)',
							},
							textStyle: {
								color: 'rgba(255, 191, 0)',
							},
						},
					],
					// itemStyle: {
					// 	color: '#f8f8f7',
					// },
					right: '10%',
				},
				toolbox: {
					feature: {
						saveAsImage: {},
					},
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						// data: that.forecastDateList,
						data: xList,
						nameTextStyle: {
							color: '#f8f8f7',
						},
						axisLabel: {
							textStyle: {
								color: '#f8f8f7', //字体颜色
								fontSize: 12, //字体大小
							},
							formatter: (val: Date) => {
								return fortmatData2YMDHM(val)
							},
						},
					},
				],
				yAxis: [
					{
						type: 'value',
						nameTextStyle: {
							color: '#f8f8f7',
						},
						axisLabel: {
							textStyle: {
								color: '#f8f8f7', //字体颜色
								fontSize: 12, //字体大小
							},
						},
						min: that.yAxisMin,
						max: that.yAxisMax,
						// scale: true
					},
				],
				series: [
					{
						name: '天文潮位',
						type: 'line',
						itemStyle: {
							formatter: function (params) {
								return params.toFixed(2)
							},
						},

						lineStyle: { color: '#ACEDD9' },

						data: yForecastList,
						showSymbol: false,
						smooth: true,
					},
					{
						name: '实况',
						type: 'line',
						lineStyle: { color: '#FE7BBF' },
						emphasis: {
							focus: 'series',
						},
						data: yRealList,
						showSymbol: false,
						smooth: true,
						// 22-12-09 取消了极值的垂直于x轴的标记线
						// markLine: {
						// 	symbol: ['none', 'none'],
						// 	label: { show: false },
						// 	// lineStyle: { type: 'solid', width: 2 },
						// 	shadowColor: 'rgba(0, 0, 0, 0.5)',
						// 	shadowBlur: 10,
						// 	data: [{ xAxis: that.getRealValMaxIndex }],
						// },
						markPoint: {
							symbol: 'circle',
							symbolSize: 2,
							data: [
								{ type: 'max', name: 'Max' },
								{ type: 'min', name: 'Min' },
							],
							symbolOffset: [0, '-500%'],
							label: {
								color: '#fff',
							},
						},
					},
					{
						name: '风暴增水',
						type: 'line',
						areaStyle: {
							opacity: 0.8,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(255, 191, 0)',
								},
								{
									offset: 1,
									color: '#C848B9',
								},
							]),
						},
						lineStyle: { color: 'rgba(255, 191, 0)' },
						emphasis: {
							focus: 'series',
						},
						data: ySurgeList,
						showSymbol: false,
						smooth: true,
						// 22-12-09 取消了极值的垂直于x轴的标记线
						// markLine: {
						// 	symbol: ['none', 'none'],
						// 	label: { show: false },
						// 	data: [{ xAxis: that.getStormSurgeMaxIndex }],
						// },
						markPoint: {
							symbol: 'circle',
							symbolSize: 2,
							data: [
								{ type: 'max', name: 'Max' },
								{ type: 'min', name: 'Min' },
							],
							symbolOffset: [0, '-500%'],
							label: {
								color: '#fff',
							},
						},
					},
					{
						name: '警戒潮位',
						type: 'line',
						markLine: {
							symbol: 'none', // 虚线不显示端点的圆圈及箭头
							itemStyle: {
								color: 'rgb(19, 184, 196)',
							},
							data: [
								{
									name: '蓝色警戒潮位',
									yAxis: this.alertBlue,
								},
							],
						},
					},
					{
						name: '警戒潮位',
						type: 'line',
						markLine: {
							symbol: 'none',
							itemStyle: {
								color: 'rgb(245, 241, 20)',
							},
							data: [
								{
									name: '黄色警戒潮位',
									yAxis: this.alertYellow,
								},
							],
						},
					},
					{
						name: '警戒潮位',
						type: 'line',
						markLine: {
							symbol: 'none',
							itemStyle: {
								color: 'rgb(235, 134, 19)',
							},
							data: [
								{
									name: '橙色警戒潮位',
									yAxis: this.alertOrange,
								},
							],
						},
					},
					{
						name: '警戒潮位',
						type: 'line',
						markLine: {
							symbol: 'none',
							itemStyle: {
								color: 'rgb(241, 11, 11)',
								lineStyle: {
									cap: 'round',
									type: 'dotted',
								},
							},
							data: [
								{
									name: '红色警戒潮位',
									yAxis: this.alertRed,
								},
							],
						},
					},
				],
			}
			// TODO:[-] 22-07-05 加入多条集合路径曲线
			const lineStyle = {
				width: 1,
				opacity: 0.5,
			}
			myChart.setOption(option)
			this.myChart = myChart
		}
	}

	get currentTyOpts(): { tyCode; tyNum; stationName; stationCode } {
		const { tyCode, tyNum, stationName, stationCode } = this
		return { tyCode, tyNum, stationName, stationCode }
	}

	@Watch('currentTyOpts')
	async onStationCode(val: {
		tyCode: string
		tyNum: string
		stationName: string
		stationCode: string
	}): Promise<void> {
		const self = this
		if (val.stationCode !== DEFAULT_STATION_CODE) {
			this.clearAllSurgeData()
			this._resetAlertLevels()
			self.isLoading = true
			// let formatXList: string[] = []
			// self.forecastDtList.map((temp) => {
			// 	formatXList.push(fortmatData2MDHM(temp))
			// })
			await this.loadStationAlertsDataList(val.stationCode)
			this.loadStationSurgeDataList(
				val.tyCode,
				val.tyNum,
				val.stationCode,
				MenuType.all,
				() => {
					self.initCharts(
						self.forcastValList,
						self.realValList,
						self.stormSurgeValList,
						self.forecastDtList
					)
				}
			)

			self.isLoading = false
		}
	}

	/** 加载对应站点潮位数据集合 */
	loadStationSurgeDataList(
		tyCode: string,
		tyNum: string,
		stationCode: string,
		forecastType: MenuType,
		callbackFunc: () => void
	): void {
		const self = this
		self.forcastValList = []
		self.forecastDtList = []
		self.realValList = []
		self.stormSurgeValList = []
		loadStationDetailDataList({
			code: tyCode,
			num: tyNum,
			name: stationCode,
			type: forecastType,
		}).then(
			(
				res: IHttpResponse<{ val_forecast: number; val_real: number; occurred: string }[]>
			) => {
				/*
				{val_forecast: 136,
				 val_real: 141,
				 occurred: '2017-08-20T16:00:00Z'}
			*/
				// 需要分别将 forecast 与 real 存入不同的 list中
				res.data.forEach((temp) => {
					// TODO:[-] 22-10-27 此处修改为 若为默认值则赋 NaN,由于对NaN 进行计算只有有NaN结果就为NaN,但对可能包含NaN的数组求 max 或 min 时，需要先剔除 NaN
					/** 天文潮 */
					const tempForecastVal =
						temp.val_forecast !== DEFAULT_SURGE_VAL ? temp.val_forecast : NaN
					/** 实况增水 */
					const tempRealVal = temp.val_real !== DEFAULT_SURGE_VAL ? temp.val_real : NaN
					/** 风暴增水 */
					const tempStormSurgeVal = tempRealVal - tempForecastVal
					// const tempStormSurgeVal =
					// 	temp.val_real !== DEFAULT_SURGE_VAL &&
					// 	temp.val_forecast !== DEFAULT_SURGE_VAL
					// 		? tempRealVal - tempForecastVal
					// 		: null
					self.forcastValList.push(tempForecastVal)
					self.forecastDtList.push(new Date(temp.occurred))
					self.realValList.push(tempRealVal)
					self.stormSurgeValList.push(tempStormSurgeVal)
				})
				const listNum: number[] = [
					...self.forcastValList,
					...self.realValList,
					...self.stormSurgeValList,
				].filter((temp) => {
					return !Number.isNaN(temp)
				})
				const surgeMax = Math.max(...listNum)
				const surgeMin = Math.min(...listNum)
				self.yAxisMax = surgeMax + MARGIN_TOP
				self.yAxisMin = surgeMin - MARGIN_BOTTOM
				// console.log(res)
				callbackFunc()
			}
		)
	}

	/** + 22-12-08 加载指定站点的警戒潮位 */
	async loadStationAlertsDataList(stationCode: string): Promise<void> {
		const self = this
		return loadStationAlertLevelDataList([stationCode]).then(
			(
				res: IHttpResponse<
					{
						code: string
						name_en: string
						alerts: { code: string; alert: AlertTideEnum; tide: number }[]
					}[]
				>
			) => {
				if (res.status === 200) {
					if (res.data.length > 0) {
						const alert = res.data[0]
						alert.alerts.forEach((val) => {
							switch (val.alert) {
								case AlertTideEnum.BLUE:
									self.alertBlue = val.tide
									break
								case AlertTideEnum.YELLOW:
									self.alertYellow = val.tide
									break
								case AlertTideEnum.ORANGE:
									self.alertOrange = val.tide
									break
								case AlertTideEnum.RED:
									self.alertRed = val.tide
									break
							}
						})
					}
				}
			}
		)
	}

	/** 清除天文潮集合 */
	_clearTideList(): void {
		this.forecastDtList = []
		this.forcastValList = []
	}

	/** 清除四色警戒潮位 */
	_clear4ColorAlert(): void {
		this.alertBlue = DEFAULT_ALERT_TIDE
		this.alertYellow = DEFAULT_ALERT_TIDE
		this.alertOrange = DEFAULT_ALERT_TIDE
		this.alertRed = DEFAULT_ALERT_TIDE
	}

	/** 重置四色警戒潮位为默认值 */
	_resetAlertLevels(): void {
		this.alertBlue = DEFAULT_ALERT_TIDE
		this.alertYellow = DEFAULT_ALERT_TIDE
		this.alertOrange = DEFAULT_ALERT_TIDE
		this.alertRed = DEFAULT_ALERT_TIDE
	}

	/** 清空 四色警戒潮位 与 天文潮集合 */
	clearAllSurgeData(): void {
		this._clearTideList()
		this._clear4ColorAlert()
	}

	get getForecastDtList(): string[] {
		const forecastDtFormatList: string[] = []
		if (this.forecastDtList.length > 0) {
			this.forecastDtList.forEach((dt: Date) => {
				forecastDtFormatList.push(fortmatData2MDHM(dt))
			})
		}
		return forecastDtFormatList
	}

	/** 获取实况极值的所在位置索引 */
	get getRealValMaxIndex(): number {
		const maxVal = Math.max(...this.realValList)
		const index = this.realValList.findIndex((temp) => {
			return temp === maxVal
		})
		return index
	}

	/** 获取风暴增水极值所在位置索引 */
	get getStormSurgeMaxIndex(): number {
		const maxVal = Math.max(...this.stormSurgeValList)
		const index = this.stormSurgeValList.findIndex((temp) => {
			return temp === maxVal
		})
		return index
	}

	@Getter(GET_STATION_CODE, { namespace: 'station' }) onCurrentStationCode
}
</script>
<style scoped lang="less">
@import '../../styles/station/station-chart.less';
// @import url('../../styles/base-form.less');
.my-detail-form {
	height: 100%;
	width: 100%;
}
#station_charts {
	// min-width: 660px;
	// min-height: 445px;
	height: 100%;
	width: 100%;
}
#station_chart_form {
	// @form-base-background();
	height: 100%;
	width: 100%;
}
</style>
