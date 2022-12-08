<template>
	<div class="nav_item_timebar" :class="isShade ? 'is-shade' : ''">
		<div class="timebar_child">
			<div class="nav_item_icon nav_icon_operator" @click="addDt('YYYY', -1)">-</div>
			<div>{{ convertDt2Str('YYYY') }}</div>
			<div class="nav_item_icon nav_icon_operator" @click="addDt('YYYY')">+</div>
		</div>
		<div class="timebar_child">
			<div class="nav_item_icon nav_icon_operator" @click="addDt('MM', -1)">-</div>
			<div>{{ convertDt2Str('MM') }}</div>
			<div class="nav_item_icon nav_icon_operator" @click="addDt('MM')">+</div>
		</div>
		<div class="timebar_child">
			<div class="nav_item_icon nav_icon_operator" @click="addDt('DD', -1)">-</div>
			<div>{{ convertDt2Str('DD') }}</div>
			<div class="nav_item_icon nav_icon_operator" @click="addDt('DD')">+</div>
		</div>
		<div class="timebar_child">
			<div class="nav_item_icon nav_icon_operator" @click="addDt('HH', -step)">-</div>
			<div>{{ convertDt2Str('HH') }}</div>
			<div class="nav_item_icon nav_icon_operator" @click="addDt('HH', step)">+</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
import moment from 'moment'
import { GET_SHADE_NAV_TIME } from '@/store/types'
/** + 22-10-14 时间选择框 */
@Component({})
export default class SubNavTimeItem extends Vue {
	/** 当前选定的预报时间 */
	@Prop({ type: Date, default: new Date() })
	forecastDt: Date

	/** 当前的时间步长(单位:小时) */
	@Prop({ type: Number, default: 1 })
	step: number

	// @Prop({ type: Boolean, default: true })
	/** 是否遮罩 t:遮罩|f:不遮罩 */
	isShade = false

	currentDt: Date = new Date()

	@Watch('forecastDt')
	onForecastDt(val: Date): void {
		this.currentDt = val
	}

	convertDt2Str(formatStr: string): string {
		const dt: Date = this.currentDt
		const dtMoment: moment.Moment = moment(dt)
		let convertStr = ''
		switch (formatStr) {
			case 'YYYY':
				convertStr = dtMoment.format('YYYY')
				break
			case 'MM':
				convertStr = dtMoment.format('MM') + '月'
				break
			case 'DD':
				convertStr = dtMoment.format('DD') + '日'
				break
			case 'HH':
				convertStr = dtMoment.format('HH') + '时'
				break
			default:
				convertStr = ''
				break
		}
		return convertStr
	}

	/** 对当前 currentDt 进行操作 */
	addDt(formatStr: string, num = 1): void {
		let modifyDt: Date = this.currentDt
		switch (formatStr) {
			case 'YYYY':
				modifyDt = moment(this.currentDt).add(num, 'y').toDate()
				break
			case 'MM':
				modifyDt = moment(this.currentDt).add(num, 'M').toDate()
				break
			case 'DD':
				modifyDt = moment(this.currentDt).add(num, 'd').toDate()
				break
			case 'HH':
				modifyDt = moment(this.currentDt).add(num, 'h').toDate()
				break
			default:
				break
		}
		this.currentDt = modifyDt
		this.setFatherForecastDt(modifyDt)
	}

	/** 为父组件的 forecastDt 赋值 */
	setFatherForecastDt(val: Date): void {
		this.$emit('updateForecastDt', val)
	}

	/** 是否遮罩 timebar */
	@Getter(GET_SHADE_NAV_TIME, { namespace: 'common' }) getIsShadeTimeBar: boolean

	@Watch('getIsShadeTimeBar')
	onGetIsShadeTimebar(val: boolean): void {
		this.isShade = val
	}
}
</script>
<style scoped lang="less">
@import '../../../styles/btn.less';
@import '../../../styles/base-form.less';
.nav_item_timebar {
	display: flex;
	align-items: center;
	background: #233446;
	// padding: 5px;
	margin: 5px;
	border-radius: 8px;
	box-shadow: 0 0 5px 0px black;
	.timebar_child {
		display: flex;
		margin-left: 5px;
		margin-right: 5px;
		font-weight: 500;
		height: 100%;
		align-items: center;
		div {
			height: 100%;
		}
		.nav_icon_operator {
			width: 10px;
		}
		.nav_icon_operator:hover {
			// background: #16a085;
		}

		div:nth-child(2) {
			width: 60px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
.is-shade {
	@div-filter();
}
</style>
