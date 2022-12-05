<template>
	<div class="value-process" :style="{ width: lineWidth + 'px' }">
		<div class="process-line" :style="{ width: absWidth + 'px' }" :class="[alertLevelStr]">
			{{ value }}
		</div>
		<div class="process-line-other">{{ diffAlertLevelVal }}</div>
		<div class="process-icon"></div>
	</div>
</template>
<script lang="ts">
import { AlertTideEnum } from '@/enum/surge'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

/** 显示数值的进度条视图 */
@Component({})
export default class ValuePrgressLineView extends Vue {
	/** 标题 */
	@Prop({ type: String, default: '', required: false })
	title: string

	/** 实际增水值 */
	@Prop({ type: Number, default: 100 })
	value: number

	/** 实况潮位 */
	@Prop({ type: Number, default: 100 })
	realdata: number

	/** line最大值 */
	@Prop({ type: Number, default: 200 })
	valMax: number

	/** line 最小值 */
	@Prop({ type: Number, default: 0 })
	valMin: number

	/** line宽度 */
	@Prop({ type: Number, default: 30 })
	lineWidth

	@Prop({ type: Array, default: [] })
	alertTides: { code: string; alert: AlertTideEnum; tide: number }[]

	/** 根据 val/max-min * width */
	get absWidth(): number {
		if (this.valMax - this.valMin !== 0 && this.value !== 0) {
			return (this.value / (this.valMax - this.valMin)) * this.lineWidth
		} else {
			return 0
		}
	}

	/** 获取value 与 alertTides 超越且未超越下一级的 level  */
	get alertLevelStr(): string {
		let levelStr = 'green'
		/** 实况潮位 */
		let tide = this.realdata
		for (let index = 0; index < this.alertTides.length; index++) {
			if (tide > this.alertTides[index].tide) {
				if (index < this.alertTides.length - 1) {
					if (tide < this.alertTides[index + 1].tide) {
						levelStr = this.alertTides[index].alert.toString().toLowerCase()
					}
				} else {
					levelStr = this.alertTides[index].alert.toString().toLowerCase()
				}
			}
		}
		return levelStr
	}

	/** 获取超某颜色警戒潮位的描述文字 */
	get disAlertLevelTitle(): string {
		let level: AlertTideEnum = AlertTideEnum.GREEN
		let levelStr = '未达蓝色警戒潮位'
		/** 实况潮位 */
		let tide = this.realdata
		for (let index = 0; index < this.alertTides.length; index++) {
			if (tide > this.alertTides[index].tide) {
				if (index < this.alertTides.length - 1) {
					if (tide < this.alertTides[index + 1].tide) {
						level = this.alertTides[index].alert
					}
				} else {
					level = this.alertTides[index].alert
				}
			}
		}
		switch (level) {
			case AlertTideEnum.BLUE:
				levelStr = '超蓝色警戒潮位'
				break
			case AlertTideEnum.YELLOW:
				levelStr = '超黄色警戒潮位'
				break
			case AlertTideEnum.ORANGE:
				levelStr = '超橙色警戒潮位'
				break
			case AlertTideEnum.RED:
				levelStr = '超红色警戒潮位'
				break
		}
		return levelStr
	}

	/** 距离最近的警戒潮位的距离 */
	get diffAlertLevelVal(): number {
		let overVal = 0
		/** 实况潮位 */
		let tide = this.realdata
		for (let index = 0; index < this.alertTides.length; index++) {
			if (tide > this.alertTides[index].tide) {
				if (index < this.alertTides.length - 1) {
					if (tide < this.alertTides[index + 1].tide) {
						tide = this.alertTides[index].alert - tide
					}
				} else {
					tide = this.alertTides[index].alert - tide
				}
			}
		}
		return overVal
	}
}
</script>
<style scoped lang="less">
.value-process {
	display: flex;
	.process-line {
		background: red;
	}
}
</style>
