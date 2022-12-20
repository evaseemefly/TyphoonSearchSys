<template>
	<div id="legend_list">
		<SwitchBackgroundMap></SwitchBackgroundMap>
		<TyphoonLevelLegend></TyphoonLevelLegend>
		<StationLevelLegend></StationLevelLegend>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import SwitchBackgroundMap from '@/components/toolsBar/switchBackgroundMapBar.vue'
import TyphoonLevelLegend from '@/components/toolsBar/typhoonLevelLegend.vue'
import StationLevelLegend from '@/components/toolsBar/stationLevelLegend.vue'
/** 图例集合汇总视图 */
@Component({
	components: { SwitchBackgroundMap, TyphoonLevelLegend, StationLevelLegend },
})
export default class LegendListView extends Vue {
	mydata: any = null
	mounted() {}
	get computedTest() {
		return null
	}
}
</script>
<style scoped lang="less">
#legend_list {
	display: flex;
	flex-direction: column-reverse;
	align-items: flex-end; // 副轴向左对齐
	z-index: 9999;
	position: absolute;
	bottom: 100px;
	right: 10px;
}
</style>
