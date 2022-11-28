<template>
	<div
		v-draggable
		id="typhoon_search_list"
		v-loading="isLoading"
		element-loading-background="loadBackground"
		v-show="getIsShow"
	>
		<div class="form-header">
			<h4>匹配台风数量:</h4>
			<span>{{ filterTyCount }}</span>
			<div class="thumb-btn" @click="setExpanded(false)">
				<i class="fa-solid fa-minus"></i>
			</div>
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
import {
	SET_CURRENT_TY,
	GET_SHOW_TY_SEARCH_FORM,
	SET_SHOW_TY_SEARCH_FORM,
	SET_SHADE_NAV_TIME,
} from '@/store/types'
// enum
import { IExpandEnum } from '@/enum/common'
import { EventBus } from '@/bus/BUS'
import { TO_CLEAR_ALL_FILTER_TYS } from '@/bus/types'
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

	@Prop({ type: Boolean, default: false })
	isLoading: boolean

	isExpanded = true

	loadBackground = '#38536dac'

	commitTy(val: FilterTyMidModel, index: number): void {
		this.setCurrentTy(val)
		this.selectedTrIndex = index
		this.setShadeTimebar(false)
	}

	clearFilterTys(): void {}

	get getIsShow(): boolean {
		let isShow = false
		switch (this.getShowForm) {
			case IExpandEnum.UN_EXPANDED:
				isShow = false
				break
			case IExpandEnum.EXPANDED:
				isShow = true
				break
			case IExpandEnum.UN_SELECTED:
				isShow = this.filterTyCount !== 0
				break
		}
		return isShow
	}

	setExpanded(val: boolean): void {
		this.isExpanded = val
		this.setShowTySearchForm(val)
	}

	@Watch('getShowForm')
	onGetShowForm(val: IExpandEnum): void {
		let isShow = false
		switch (val) {
			case IExpandEnum.UN_EXPANDED:
				isShow = false && this.isExpanded
				break
			case IExpandEnum.EXPANDED:
				// this.setExpanded(true)
				this.isExpanded = true
				isShow = true && this.isExpanded
				break
			case IExpandEnum.UN_SELECTED:
				isShow = this.filterTyCount !== 0 && this.isExpanded
				break
		}
		this.isExpanded = isShow
	}

	@Mutation(SET_SHOW_TY_SEARCH_FORM, { namespace: 'common' }) setShowTySearchForm

	@Mutation(SET_CURRENT_TY, { namespace: 'typhoon' }) setCurrentTy

	/** 设置 遮罩 timebar */
	@Mutation(SET_SHADE_NAV_TIME, { namespace: 'common' }) setShadeTimebar

	/** 获取当前窗口是否展开的状态 */
	@Getter(GET_SHOW_TY_SEARCH_FORM, { namespace: 'common' }) getShowForm: IExpandEnum
}
</script>
<style scoped lang="less">
@import url('../../styles/base-form.less');
#typhoon_search_list {
	position: absolute;
	top: 80px;
	right: 50px;
	width: 300px;
	// height: 450px;
	// background-color: #20262cd9;
	// 统一的 shadow 效果
	@form-base-shadow();
	// 统一的边角半圆过渡
	@form-base-radius();
	@form-base-background();
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
