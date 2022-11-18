<template>
	<div class="thumb-list">
		<TySearchThumbView title="台风查询列表"></TySearchThumbView>
		<StationExtremumListThumbView title="潮位站极值列表"></StationExtremumListThumbView>
		<StationSurgeListThumbView title="潮位站详情"></StationSurgeListThumbView>
		<!-- <BaseThumbView title="站点极值列表"></BaseThumbView>
		<BaseThumbView title="站点详情"></BaseThumbView> -->
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

// import BaseThumbView from '@/components/thumbs/baseThumbView.vue'
import TySearchThumbView from '@/components/thumbs/tySearchThumbView.vue'
import StationExtremumListThumbView from '@/components/thumbs/stationExtremumListThumbView.vue'
import StationSurgeListThumbView from '@/components/thumbs/stationSurgeListViewThumbView.vue'
@Component({
	components: { TySearchThumbView, StationExtremumListThumbView, StationSurgeListThumbView },
})
export default class ThumbListView extends Vue {}
</script>
<style scoped lang="less">
.thumb-list {
	display: flex;
	position: absolute;
	top: 0px;
	left: 100px;
	z-index: 998;
	// z-index: 9999;
}
</style>
