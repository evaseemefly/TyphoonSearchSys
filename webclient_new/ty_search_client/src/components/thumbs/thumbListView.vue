<template>
	<div class="thumb-list">
		<BaseThumbView title="台风查询列表"></BaseThumbView>
		<BaseThumbView title="站点极值列表"></BaseThumbView>
		<BaseThumbView title="站点详情"></BaseThumbView>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import BaseThumbView from '@/components/thumbs/baseThumbView.vue'
@Component({ components: { BaseThumbView } })
export default class ThumbListView extends Vue {
	mydata: any = null
	mounted() {}
	get computedTest() {
		return null
	}
}
</script>
<style scoped lang="less">
.thumb-list {
	display: flex;
	position: absolute;
	top: 50px;
	left: 100px;
	z-index: 9999;
}
</style>
