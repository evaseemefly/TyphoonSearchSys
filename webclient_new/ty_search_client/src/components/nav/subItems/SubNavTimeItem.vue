<template>
	<div class="nav_item_timebar">
		<div class="timebar_child">
			<div>-</div>
			<div>2022</div>
			<div>+</div>
		</div>
		<div class="timebar_child">
			<div>-</div>
			<div>10</div>
			<div>+</div>
		</div>
		<div class="timebar_child">
			<div>-</div>
			<div>14</div>
			<div>+</div>
		</div>
		<div class="timebar_child">
			<div>-</div>
			<div>16</div>
			<div>+</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
/** + 22-10-14 时间选择框 */
@Component({})
export default class SubNavTimeItem extends Vue {
	mydata: any = null
	mounted() {}
	get computedTest() {
		return null
	}
}
</script>
<style scoped lang="less">
.nav_item_timebar {
	display: flex;
	align-items: center;
	background: #233446;
	padding: 5px;
	margin: 5px;
	border-radius: 8px;
	.timebar_child {
		display: flex;
		margin-left: 5px;
		margin-right: 5px;
		font-weight: 500;
		div:nth-child(2) {
			width: 60px;
		}
	}
}
</style>
