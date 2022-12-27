<template>
	<div class="drawer-children-card">
		<div class="card-title">台风唯一查询</div>
		<div class="card-body">
			<div class="card-nav-row">
				<span>按年检索</span>
				<el-input v-model="filterYear" placeholder="输入年份"></el-input>
			</div>
			<div class="card-nav-row">
				<span>按月检索</span>
				<el-input v-model="filterMonth" placeholder="输入月份"></el-input>
			</div>
			<div class="card-nav-row">
				<span>按编号检索</span>
				<el-input v-model="filterTyNum" placeholder="输入月份"></el-input>
			</div>
			<!-- <div class="card-nav-row">
				<span>按范围检索</span>
				<el-date-picker
					v-model="filterStartDt"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
			</div> -->
		</div>
		<div class="card-footer">
			<button class="primary" @click="submit">查询</button>
			<button class="error">清除</button>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
// 引入事件总线
import { EventBus } from '@/bus/BUS'
import {
	TO_GET_UNIQUE_TY_SEARCH_LIST,
	TO_GET_UNIQUE_TY_SEARCH_READ_DATA,
	TO_CLOSE_COMPLEX_OPTS_DRAWER,
} from '@/bus/types'

import TyphoonComponent from '@/bus/modules/typhoon'
@Component({})
export default class TyUniqueSearchCardView extends Vue {
	/** 过滤的年份 */
	filterYear = ''
	/** 过滤的月份(全部年份的该月份) */
	filterMonth = ''
	/** 暂时不用 起止时间 */
	filterStartDt: Date = new Date()
	/** 过滤台风编号 */
	filterTyNum = ''
	// filterEndDt:Date=new Date()

	/** 加入了当输入 月份 则清除 年份输入框输入的内容，不需要加入单选框进行额外的控制 */
	@Watch('filterMonth')
	onFilterMonth(val: string): void {
		if (val !== '') {
			this.filterYear = ''
			this.filterTyNum = ''
		}
	}

	@Watch('filterYear')
	onFilterYear(val: string): void {
		if (val !== '') {
			this.filterMonth = ''
			this.filterTyNum = ''
		}
	}

	@Watch('filterTyNum')
	onFilterTyNum(val: string): void {
		if (val !== '') {
			this.filterMonth = ''
			this.filterYear = ''
		}
	}

	/** 提交查询操作  */
	submit(): void {
		// TODO:[-] 22-11-21
		// TypeError: Cannot read properties of undefined (reading '$emit')
		// @ts-ignore
		// this.$bus.$emit('my-add-to-count')
		/** 提交唯一性查询的参数 */
		const params: { year: string; month: string; tyNum: string } = {
			year: this.filterYear,
			month: this.filterMonth,
			tyNum: this.filterTyNum,
		}
		EventBus.$emit(TO_GET_UNIQUE_TY_SEARCH_READ_DATA, params)
		EventBus.$emit(TO_GET_UNIQUE_TY_SEARCH_LIST, params)
		// 触发外侧 drawe 收起
		EventBus.$emit(TO_CLOSE_COMPLEX_OPTS_DRAWER)
	}
}
</script>
<style scoped lang="less">
@import '../../styles/base';
.options-drawer-card-root {
	width: 80%;

	.drawer-children-card {
		background: linear-gradient(to right, #34495e9a 40%, rgba(74, 145, 148, 0.726));
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: baseline;
		box-shadow: 3px 7px 10px 0px #000000c7;
		margin-bottom: 20px;
		.card-title {
			margin: 10px;
			color: white;
		}
		.card-body {
			margin: 8px;
			text-shadow: 2px 2px 8px #212020;
			.card-nav-row {
				color: white;
				display: flex;
				align-items: center;
				span {
					width: 100%;
				}
				margin: 8px;
			}
		}
	}
}
.card-footer {
	color: white;
	display: flex;
	button {
		padding: 8px;
		margin: 5px;
		color: white;
		border-radius: 5px;
		border: 0px;
		font-size: 14px;
		box-shadow: 0 0 7px 0px black;
	}
	.primary {
		background: #16a085;
	}
	.error {
		background: #a04916;
	}
}
.el-input {
	box-shadow: 1px 1px 5px 1px black;
}
</style>
