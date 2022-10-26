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
import { loadStationDetailDataList } from '@/api/station'
// 工具方法
import { fortmatData2YMDHM, fortmatData2MDHM } from '@/util/filter'
import moment from 'moment'
import { MenuType } from '@/enum/menu'

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
	/** 预报值列表 */
	forcastValList: number[] = []

	realValList: number[] = []

	// 22-02-21 注意四色警戒潮位是对应的总潮位值
	alertBlue: number = DEFAULT_ALERT_TIDE
	alertBlueD85: number = DEFAULT_ALERT_TIDE
	alertYellow: number = DEFAULT_ALERT_TIDE
	alertYellowD85: number = DEFAULT_ALERT_TIDE
	alertOrange: number = DEFAULT_ALERT_TIDE
	alertOrangeD85: number = DEFAULT_ALERT_TIDE
	alertRed: number = DEFAULT_ALERT_TIDE
	alertRedD85: number = DEFAULT_ALERT_TIDE
	d85Diff: number = DEFAULT_SURGE_DIFF
	surgeDiff: number = DEFAULT_SURGE_DIFF

	yAxisMin = 0
	yAxisMax = 0

	initCharts(yForecastList: number[], yRealList: number[], xList: Date[]): void {
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
						},
					},
					// valueFormatter: (val) => val.toFixed(1),
					formatter: (params: { seriesName: string; data: number }[]): string => {
						// + 22-10-26 params[0]:天文潮 ; params[1]:实况
						let content = '---'
						const surgeForecast = params[0].data
						const surgeReal = params[1].data

						content = `天文潮位:${surgeForecast}</br>
						实况潮位:${surgeReal}</br>
						风暴增水:${surgeReal - surgeForecast}</br>`

						return content
					},
				},
				legend: {
					data: [
						{
							name: '距离警戒潮位阈值',
							itemStyle: {
								color: '#2ecc71',
							},
						},
						{
							name: '天文潮位',
							itemStyle: {
								color: 'rgba(255, 191, 0)',
							},
						},
						{
							name: '蓝色',
							itemStyle: {
								color: 'rgb(19, 184, 196)',
							},
						},
						{
							name: '黄色',
							itemStyle: {
								color: 'rgb(245, 241, 20)',
							},
						},
						{
							name: '橙色',
							itemStyle: {
								color: 'rgb(235, 134, 19)',
							},
						},
						{
							name: '红色',
							itemStyle: {
								color: 'rgb(241, 11, 11)',
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
							// formatter: (val: Date) => {
							// 	return fortmatData2YMDHM(val)
							// },
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
						// areaStyle: { color: '#e67e22' },
						areaStyle: {
							opacity: 0.4,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(128, 255, 165)',
								},
								{
									offset: 1,
									color: 'rgba(1, 191, 236)',
								},
							]),
						},
						itemStyle: {
							formatter: function (params) {
								return params.toFixed(2)
							},
						},

						lineStyle: { color: 'rgba(128, 255, 165)' },

						data: yForecastList,
						showSymbol: false,
						smooth: true,
					},
					{
						name: '实况',
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
									color: 'rgba(224, 62, 76)',
								},
							]),
						},
						lineStyle: { color: 'rgba(255, 191, 0)' },
						emphasis: {
							focus: 'series',
						},
						data: yRealList,
						showSymbol: false,
						smooth: true,
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

	get currentTyOpts(): { tyCode; tyNum; stationName } {
		const { tyCode, tyNum, stationName } = this
		return { tyCode, tyNum, stationName }
	}

	@Watch('currentTyOpts')
	async onStationCode(val: {
		tyCode: string
		tyNum: string
		stationName: string
	}): Promise<void> {
		const self = this
		if (val.stationName !== DEFAULT_STATION_NAME) {
			this.clearAllSurgeData()
			self.isLoading = true
			this.loadStationSurgeDataList(
				val.tyCode,
				val.tyNum,
				val.stationName,
				MenuType.all,
				() => {
					self.initCharts(self.forcastValList, self.realValList, self.forecastDtList)
				}
			)
			self.isLoading = false
		}
	}

	/** 加载对应站点潮位数据集合 */
	loadStationSurgeDataList(
		tyCode: string,
		tyNum: string,
		stationName: string,
		forecastType: MenuType,
		callbackFunc: () => void
	): void {
		const self = this
		self.forcastValList = []
		self.forecastDtList = []
		self.realValList = []
		loadStationDetailDataList({
			code: tyCode,
			num: tyNum,
			name: stationName,
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
					const tempForecastVal =
						temp.val_forecast !== DEFAULT_SURGE_VAL ? temp.val_forecast : null
					const tempRealVal = temp.val_real !== DEFAULT_SURGE_VAL ? temp.val_real : null
					self.forcastValList.push(tempForecastVal)
					self.forecastDtList.push(new Date(temp.occurred))
					self.realValList.push(tempRealVal)
				})
				const surgeMax = Math.max(...self.forcastValList, ...self.realValList)
				const surgeMin = Math.min(...self.forcastValList, ...self.realValList)
				self.yAxisMax = surgeMax + MARGIN_TOP
				self.yAxisMin = surgeMin - MARGIN_BOTTOM
				// console.log(res)
				callbackFunc()
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

	@Getter(GET_STATION_CODE, { namespace: 'station' }) onCurrentStationCode
}
</script>
<style scoped lang="less">
@import '../../styles/station/station-chart.less';
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
	@base-station-form();
	height: 100%;
	width: 100%;
}
</style>
