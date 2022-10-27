<template>
	<div id="typhoon_search_list">
		<div class="form-header">
			<h4>匹配台风数量:</h4>
			<!-- <div class="primary-title"></div> -->
			<span>{{ filterTyCount }}</span>
			<!-- <div class="desc"></div> -->
		</div>
		<section>
			<table>
				<thead>
					<tr>
						<th>年份</th>
						<th>台风名称</th>
						<th>台风编号</th>
						<th>code</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(tyTemp, index) in typhoonList"
						:key="tyTemp.id"
						@click="commitTy(tyTemp, index)"
						:class="index == selectedTrIndex ? 'activate' : ' '"
					>
						<td>{{ tyTemp.year }}</td>
						<td>{{ tyTemp.name }}</td>
						<td>
							{{ tyTemp.tyNum }}
						</td>
						<td>{{ tyTemp.code }}</td>
					</tr>
				</tbody>
			</table>
		</section>
		<div class="form-footer"></div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation, Getter } from 'vuex-class'
import { FilterTyMidModel } from '@/middle_model/typhoon'
// store
import { SET_CURRENT_TY } from '@/store/types'
@Component({})
export default class TyphoonListView extends Vue {
	// typhoonList: { code: string; name: string; tyNum: string; year: string }[] = [
	// 	{ code: 'numsdf', name: '桑美', tyNum: '1710', year: '2017' },
	// ]
	selectedTrIndex = -1

	@Prop({ type: Number, default: 0 })
	filterTyCount: number

	@Prop({ type: Array, default: [] })
	typhoonList: FilterTyMidModel[]

	commitTy(val: FilterTyMidModel, index: number): void {
		this.setCurrentTy(val)
		this.selectedTrIndex = index
	}

	@Mutation(SET_CURRENT_TY, { namespace: 'typhoon' }) setCurrentTy
}
</script>
<style scoped lang="less">
#typhoon_search_list {
	position: absolute;
	top: 80px;
	right: 50px;
	width: 300px;
	// height: 450px;
	background-color: #20262cd9;
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
