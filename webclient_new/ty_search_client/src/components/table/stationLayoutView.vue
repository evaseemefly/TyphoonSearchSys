<template>
	<div v-draggable id="station_list_main_layout" v-show="getIsShow">
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
import { Getter, Mutation, State, namespace } from 'vuex-class'
// 接口
import { IHttpResponse } from '@/interface/common'

import StationAlertListView from './stationAlertListView.vue'
import StationExtremumListView from './stationExtremumListView.vue'
import { AlertTideEnum } from '@/enum/surge'
import { GET_SHOW_STATION_EXTREMUM_FORM } from '@/store/types'
import { IExpandEnum } from '@/enum/common'
@Component({
	components: {
		StationAlertListView,
		StationExtremumListView,
	},
})
export default class StationLayoutView extends Vue {
	@Prop({ type: String })
	tyNum: string

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

	/** store -> 是否显示fom t:显示 */
	@Getter(GET_SHOW_STATION_EXTREMUM_FORM, { namespace: 'common' }) getShowForm: IExpandEnum

	/** 是否显示当前窗口 条件:getShowForm */
	get getIsShow(): boolean {
		let isShow = false
		switch (this.getShowForm) {
			case IExpandEnum.UN_EXPANDED:
				isShow = false
				break
			case IExpandEnum.EXPANDED:
				// this.setExpanded(true)
				// this.isExpanded = true
				isShow = true
				break
			case IExpandEnum.UN_SELECTED:
				break
		}
		return isShow
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
