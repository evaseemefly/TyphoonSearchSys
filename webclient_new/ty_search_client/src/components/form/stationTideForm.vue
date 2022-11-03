<template>
	<div
		v-draggable
		id="station_surge"
		class="right-station-surge-form"
		v-show="getIsShow"
		:class="stationName == defaultStationName ? 'form-hide' : 'form-show'"
	>
		<div class="my-detail-form">
			<div class="sub-titles">
				<div
					:class="[
						index == subTitleIndex ? 'actived my-sub-title' : 'unactived my-sub-title',
						item.disabled ? 'disabled' : '',
					]"
					:key="index"
					@click="checkSubTitle(index)"
					v-for="(item, index) in subTitles"
				>
					{{ item.title }}
				</div>
			</div>
			<div class="detail-content">
				<component
					:is="getActiveCompName"
					:stationCode="stationCode"
					:stationName="stationName"
					:tyCode="tyCode"
					:tyNum="tyNum"
					:toResize="toResize"
				></component>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
import * as echarts from 'echarts'
import moment from 'moment'
import {
	DEFAULT_STATION_CODE,
	DEFAULT_STATION_NAME,
	DEFAULT_TY_CODE,
	DEFAULT_TY_NUM,
} from '@/const/default'
import { GET_COMPLEX_OPTS_CURRENT_STATION, GET_SHOW_STATION_DETAIL_FORM } from '@/store/types'
import TideChartView from '@/components/charts/tideChartsFormView.vue'
// 工具类
import { stickyTopic, reduceTopic } from '@/util/styleUtil'
import { faL, faLessThanEqual } from '@fortawesome/free-solid-svg-icons'
@Component({
	directives: {
		// drag: Draggable
	},
	components: {
		'tide-chart': TideChartView,
	},
})
export default class TabContent extends Vue {
	isExpanded = false
	ableExpaned = false
	screenHeight = 0
	screenWidth = 0
	defaultFormId = 'station_surge'
	defaultStationCode = DEFAULT_STATION_CODE
	defaultStationName = DEFAULT_STATION_NAME
	size: { divWidth: number; divHeight: number } = {
		divWidth: 0,
		divHeight: 0,
	}
	sizeDefault: { divWidth: number; divHeight: number } = {
		divWidth: 660,
		divHeight: 445,
	}
	subTitles: Array<{
		title: string
		index: number
		componetName: string
		isGroup: boolean
		disabled: boolean
	}> = [
		{
			title: '站点详情',
			index: 0,
			componetName: 'tide-chart',
			isGroup: false,
			disabled: false,
		},
	]
	toResize = false
	subTitleIndex = 0
	// @Prop({ default: DEFAULT_STATION_CODE })
	stationCode = DEFAULT_STATION_CODE

	// @Prop({ default: DEFAULT_STATION_NAME })
	stationName: string = DEFAULT_STATION_NAME

	// @Prop({ default: DEFAULT_TY_CODE })
	tyCode: string = DEFAULT_TY_CODE

	// @Prop({ default: DEFAULT_TY_NUM })
	tyNum: string = DEFAULT_TY_NUM

	myChart: echarts.ECharts = null

	isGroup = false

	get getIsShow(): boolean {
		return !(this.stationName === DEFAULT_STATION_NAME) || this.getShowStationForm
	}
	mounted() {
		const that = this
		this.screenHeight = window.innerHeight
		this.screenWidth = window.innerWidth
		this.resetSize()
		window.onresize = () => {
			return () => {
				that.screenHeight = window.innerHeight
				that.screenWidth = window.innerWidth
			}
		}
	}

	checkSubTitle(index: number): void {
		if (!this.subTitles[index].disabled) {
			this.subTitleIndex = index
		}
	}

	drag(): void {
		// this.dragCls.drag({ divId: 'station_surge' })
	}

	// 重置当前 form 的大小(使用修改style的 height 与 width)
	resetSize(): void {
		const targetDiv: HTMLElement | null = document.getElementById(this.defaultFormId)
		if (targetDiv) {
			targetDiv.style.width = this.sizeDefault.divWidth + 'px'
			targetDiv.style.height = this.sizeDefault.divHeight + 'px'
		}
	}

	@Watch('isExpanded')
	onIsExpanded(val: boolean): void {
		// 收起时触发将 form 重置大小的操作
		this.toResize = !val
		if (this.toResize) {
			this.resetSize()
		}
	}

	@Watch('size', { immediate: true, deep: true })
	onSize(val: { divWidth: number; divHeight: number }) {
		console.log(`TabContent监听到width:${val.divWidth},height:${val.divHeight}`)
		if (this.myChart) {
			this.myChart.resize()
		}
	}

	get getActiveCompName() {
		this.isGroup = this.subTitles[this.subTitleIndex].isGroup
		return this.subTitles[this.subTitleIndex].componetName
	}

	setIsExpanded(val: boolean): void {
		if (this.checkAbleExpaned()) {
			this.isExpanded = !val
			// return true
		} else {
			this.isExpanded = false
			// return false
		}
	}
	checkAbleExpaned(): boolean {
		let isOk = false
		return isOk
	}

	toTopic(ele: MouseEvent): void {
		// TODO:[*] 22-10-06 注意此处存在一个bug，即若鼠标移入的是 ty_search_form 中的子div，则ele会是子div对象
		const ELE_ID = 'station_surge'
		// const dom = ele.target

		stickyTopic(ELE_ID)
	}

	reduceTopic(ele: HTMLElement): void {
		const ELE_ID = 'station_surge'
		reduceTopic(ELE_ID)
	}

	/** 获取当前选中的海洋站的 opts */
	@Getter(GET_COMPLEX_OPTS_CURRENT_STATION, { namespace: 'complex' })
	getterComplexOptsCurrentStation: { tyNum: string; tyCode: string; stationName: string }

	/** 是否显示窗口 t:显示 */
	@Getter(GET_SHOW_STATION_DETAIL_FORM, { namespace: 'common' })
	getShowStationForm: boolean

	@Watch('getterComplexOptsCurrentStation')
	onCurrentStationOpts(val: { tyNum: string; tyCode: string; stationName: string }): void {
		// this.stationCode = val.stationName
		console.log(
			`监听到 station complex 发生变化: num:${val.tyNum}, code:${val.tyCode}, station name:${val.stationName}`
		)
		this.stationName = val.stationName
		this.tyCode = val.tyCode
		this.tyNum = val.tyNum
	}
}
</script>
<style lang="less">
@import '../../styles/station/station-chart';
// + 21-12-06 加入重写的 emelemtnui 样式
@import '../../styles/my-elementui/common';
.test {
	background: rgb(252, 182, 31);
	color: rgb(235, 232, 70);
}

#station_surge {
	min-height: 495px;
	min-width: 556px;
	height: 100%;
	position: absolute;
	z-index: 9999;
	top: 50px;
	left: 180px;
}
</style>
