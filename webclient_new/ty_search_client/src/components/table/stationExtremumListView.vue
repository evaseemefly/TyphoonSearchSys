<template>
	<div
		v-draggable
		id="station_list"
		v-loading="isLoading"
		element-loading-background="loadBackground"
	>
		<div class="form-header">
			<h4>站点数量:</h4>
			<!-- <div class="primary-title"></div> -->
			<span>{{ getStationCode }}</span>
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
						@click="commitStation(stationTemp, index)"
						:class="index == selectedTrIndex ? 'activate' : ' '"
					>
						<td>{{ stationTemp.stationName }}</td>
						<td :class="stationTemp.surge | filterSurgeAlarmColor">
							{{ stationTemp.surge }}
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { DEFAULT_TY_NUM } from '@/const/default'

// api
import { loadStationExtremumDataList } from '@/api/station'
// 接口
import { IHttpResponse } from '@/interface/common'
// 工具类
import { fortmatData2MDHM, filterSurgeAlarmColor } from '@/util/filter'
/** 海洋站极值列表 */
@Component({
	filters: {
		fortmatData2MDHM,
		filterSurgeAlarmColor,
	},
})
export default class StationExtremumListView extends Vue {
	/** 台风编号(str) */
	@Prop({ default: DEFAULT_TY_NUM, type: String })
	tyNum: string

	/** 海洋站数量 */
	stationCount = 0

	/** 海洋站极值集合 */
	stationExtremumList: { stationName: string; surge: number; dt: Date }[] = []

	@Watch('tyNum')
	onTyNum(val: string): void {
		const self = this
		self.stationExtremumList = []
		loadStationExtremumDataList(val).then(
			(res: IHttpResponse<{ station_code: string; max_val: number; max_date: string }[]>) => {
				if (res.status === 200) {
					res.data.forEach((temp) => {
						self.stationExtremumList.push({
							stationName: temp.station_code,
							surge: temp.max_val,
							dt: new Date(temp.max_date),
						})
					})
				}
				// console.log(res.data)
			}
		)
	}

	get getStationCode(): number {
		return this.stationExtremumList.length
	}
}
</script>
<style scoped lang="less">
@import url('../../styles/base-form.less');
#station_list {
	// 统一的 shadow 效果
	@form-base-shadow();
	// 统一的边角半圆过渡
	@form-base-radius();
	position: absolute;
	top: 80px;
	right: 450px;
	width: 300px;
	// height: 450px;
	// background-color: #20262cd9;
	z-index: 999;
	max-height: 600px;
	.form-header {
		display: flex;
		margin: 5px;
		h4 {
			color: white;
			font-size: 1.2rem;
			margin: 10px;
		}
		span {
			display: flex;
			align-items: center;
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
