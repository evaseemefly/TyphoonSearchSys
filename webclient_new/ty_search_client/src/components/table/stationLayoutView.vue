<template>
	<div id="station_list_main_layout">
		<StationExtremumListView
			:tyNum="tyNum"
			:stationNameDict="stationNameDict"
		></StationExtremumListView>
		<StationAlertListView
			:tyNum="tyNum"
			:stationNameDict="stationNameDict"
		></StationAlertListView>
	</div>
</template>
<script lang="ts">
import { loadStationAlertLevelDataList, loadStationNameDict } from '@/api/station'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

// 接口
import { IHttpResponse } from '@/interface/common'

import StationAlertListView from './stationAlertListView.vue'
import StationExtremumListView from './stationExtremumListView.vue'
import { AlertTideEnum } from '@/enum/surge'
@Component({
	components: {
		StationAlertListView,
		StationExtremumListView,
	},
})
export default class StationLayoutView extends Vue {
	@Prop({ type: String })
	tyNum: string

	stationExtremumList: { stationCode: string; stationName: string; surge: number; dt: Date }[] =
		[]
	/** 海洋站名称中英文对照字典 */
	stationNameDict: { name: string; chname: string }[] = []

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

	/** 海洋站极值融合警戒潮位集合 */
	stationExtremumMergeList: {
		stationCode: string
		stationName: string
		surge: number
		dt: Date
		code: string
		name_en: string
		alerts: { code: string; alert: AlertTideEnum; tide: number }[]
	}[] = []

	submitStationExtremumList(
		val: { stationCode: string; stationName: string; surge: number; dt: Date }[]
	): void {
		console.log(`监听到调用submitStationExtremumList:${val}`)
		this.stationExtremumList = val
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
}
</script>
<style scoped lang="less">
#station_list_main_layout {
	position: absolute;
	top: 80px;
	right: 450px;
	// width: 300px;
	// height: 450px;
	// background-color: #20262cd9;
	z-index: 999;
	display: flex;
}
</style>
