<template>
	<el-tooltip class="item" effect="dark" :content="alertMsg" placement="top-start">
		<div class="value-process" :style="{ width: lineWidth + 'px' }">
			<div class="process-line" :style="{ width: absWidth + 'px' }" :class="[alertLevelStr]">
				{{ realdata }}
			</div>
			<div class="process-line-other">
				<!-- {{ disAlertLevelTitle }}:{{ diffAlertLevelVal | filterStationAlertTideVal }} -->
			</div>
			<div class="process-icon"></div>
		</div>
	</el-tooltip>
</template>
<script lang="ts">
import { AlertTideEnum } from '@/enum/surge'
import { filterStationAlertTideVal } from '@/util/filter'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

/** 显示数值的进度条视图 */
@Component({ filters: { filterStationAlertTideVal } })
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
		if (
			this.valMax - this.valMin !== 0 &&
			this.realdata !== 0 &&
			this.valMax >= this.realdata
		) {
			return (this.realdata / (this.valMax - this.valMin)) * this.lineWidth
		} else if (this.valMax < this.realdata) {
			return this.lineWidth
		} else {
			return 0
		}
	}

	get alertMsg(): string {
		let msg = '四色警戒潮位读取错误'
		if (this.alertTides.length > 3) {
			msg = `蓝色警戒潮位:${this.alertTides[0].tide}\n
		黄色警戒潮位:${this.alertTides[1].tide}\n
		橙色警戒潮位:${this.alertTides[2].tide}\n
		红色警戒潮位:${this.alertTides[3].tide}\n`
		}

		return msg
	}

	/** 获取value 与 alertTides 超越且未超越下一级的 level  */
	get alertLevelStr(): string {
		let levelStr = 'green'
		/** 实况潮位 */
		let tide = this.realdata
		// TODO:[-] 22-12-06 注意此处可能存在警戒潮位为null的情况
		if (
			this.alertTides.filter((temp) => {
				return temp.tide === null
			}).length > 2
		) {
			levelStr = 'null-color'
		} else {
			for (let index = 0; index < this.alertTides.length; index++) {
				if (tide > this.alertTides[index].tide) {
					if (index < this.alertTides.length - 1) {
						if (tide < this.alertTides[index + 1].tide) {
							levelStr = AlertTideEnum[this.alertTides[index].alert].toLowerCase()
							break
						}
					} else {
						levelStr = AlertTideEnum[this.alertTides[index].alert].toLowerCase()
						break
					}
				}
			}
		}

		return levelStr
	}

	/** 获取超某颜色警戒潮位的描述文字 */
	get disAlertLevelTitle(): string {
		let level: AlertTideEnum = AlertTideEnum.GREEN
		let levelStr = '未达蓝'
		/** 实况潮位 */
		let tide = this.realdata
		for (let index = 0; index < this.alertTides.length; index++) {
			if (tide > this.alertTides[index].tide) {
				if (index < this.alertTides.length - 1) {
					if (tide < this.alertTides[index + 1].tide) {
						level = this.alertTides[index].alert
						break
					}
				} else {
					level = this.alertTides[index].alert
					break
				}
			}
		}
		switch (level) {
			case AlertTideEnum.BLUE:
				levelStr = '超蓝'
				break
			case AlertTideEnum.YELLOW:
				levelStr = '超黄'
				break
			case AlertTideEnum.ORANGE:
				levelStr = '超橙'
				break
			case AlertTideEnum.RED:
				levelStr = '超红'
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
						overVal = tide - this.alertTides[index].tide
						break
					}
				} else {
					overVal = tide - this.alertTides[index].tide
					break
				}
			} else {
				overVal = tide - this.alertTides[index].tide
				break
			}
		}
		return overVal
	}
}
</script>
<style scoped lang="less">
.value-process {
	display: flex;
	background: rgba(49, 59, 89, 0.733);
	.process-line {
		// background: red;
	}
	.process-line-other {
		// width: 100%;
	}
}
.null-color {
	background: rgba(49, 59, 89, 0.98);
}
</style>
