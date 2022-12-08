<template>
	<div class="value-process" :style="{ width: lineWidth + 'px' }">
		<div class="process-line" :style="{ width: absWidth + 'px' }" :class="[alertLevelStr]">
			{{ value }}
		</div>
		<div class="process-line-other"></div>
		<div class="process-icon"></div>
	</div>
</template>
<script lang="ts">
import { AlertTideEnum } from '@/enum/surge'
import { filterStationAlertTideVal, filterSurgeAlarmColor } from '@/util/filter'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

/** 增水进度条 */
@Component({ filters: { filterStationAlertTideVal } })
export default class SurgeValuePrgressLineView extends Vue {
	/** 标题 */
	@Prop({ type: String, default: '', required: false })
	title: string

	/** 实际增水值 */
	@Prop({ type: Number, default: 100 })
	value: number

	/** line最大值 */
	@Prop({ type: Number, default: 200 })
	valMax: number

	/** line 最小值 */
	@Prop({ type: Number, default: 0 })
	valMin: number

	/** line宽度 */
	@Prop({ type: Number, default: 30 })
	lineWidth

	/** 根据 val/max-min * width */
	get absWidth(): number {
		if (this.valMax - this.valMin !== 0 && this.value !== 0 && this.valMax >= this.value) {
			return (this.value / (this.valMax - this.valMin)) * this.lineWidth
		} else if (this.valMax < this.value) {
			return this.lineWidth
		} else {
			return 0
		}
	}

	/** 根据 this.value 获取 level 字符串  */
	get alertLevelStr(): string {
		let levelStr = 'green'
		/** 实况潮位 */
		let tide = this.value
		levelStr = filterSurgeAlarmColor(tide)

		return levelStr
	}
}
</script>
<style scoped lang="less">
.value-process {
	display: flex;
	background: rgba(49, 59, 89, 0.733);
	border-radius: 5px;
	.process-line {
		// background: red;
		border-radius: 5px;
	}
	.process-line-other {
		// width: 100%;
	}
}
.null-color {
	background: rgba(49, 59, 89, 0.98);
}
</style>
