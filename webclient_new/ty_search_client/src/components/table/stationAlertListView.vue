<template>
	<div id="station_alert_list">
		<div class="form-header">
			<h4>站点数量:</h4>
			<!-- <div class="primary-title"></div> -->
			<span>{{ getStationCount }}</span>
			<div class="thumb-btn" @click="setExpanded(false)">
				<i class="fa-solid fa-minus"></i>
			</div>
			<!-- <div class="desc"></div> -->
		</div>
		<section>
			<table>
				<thead>
					<tr>
						<th>站点名称</th>
						<th>增水极值</th>
						<th>时间</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(stationTemp, index) in stationExtremumList"
						:key="stationTemp.id"
						@click="commitStationExtremum(stationTemp, index)"
					>
						<td>{{ stationTemp.stationName }}</td>
						<td :class="stationTemp.surge | filterSurgeAlarmColor">
							<ValuePrgressLineView
								:value="stationTemp.surge"
								:valMax="200"
								:valMin="0"
								:realdata="stationTemp.realdata"
								:lineWidth="84"
								:alertTides="stationTemp.alerts"
							></ValuePrgressLineView>
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
// 工具类
import { fortmatData2MDHM, filterSurgeAlarmColor, filterStationNameCh } from '@/util/filter'
// 其他组件
import ValuePrgressLineView from '@/components/progress/valueProgressView.vue'
import { AlertTideEnum } from '@/enum/surge'

@Component({
	filters: {
		fortmatData2MDHM,
		filterSurgeAlarmColor,
	},
	components: {
		ValuePrgressLineView,
	},
})
export default class StationAlertListView extends Vue {
	/** 需要获取的站点codes数组 */
	@Prop({ type: Array, required: false })
	stationCodes: string[]

	@Prop({ type: Array })
	stationExtremumList: {
		stationCode: string
		stationName: string
		/** 增水 */
		surge: number
		dt: Date
		/** 实况 */
		realdata: number
		/** 天文潮 */
		tide: number
		code: string
		name_en: string
		alerts: { code: string; alert: AlertTideEnum; tide: number }[]
	}[]
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
