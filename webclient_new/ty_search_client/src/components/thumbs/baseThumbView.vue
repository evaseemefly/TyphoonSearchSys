<template>
	<div class="thumb-btn">
		<span>{{ title }}</span>
		<div class="thumb-btn fa-solid fa-up-right-and-down-left-from-center"></div>
		<div class="thumb-btn fa-solid fa-minus"></div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
/** 基础的缩略按钮视图 */
@Component({})
export default class BaseThumbView extends Vue {
	// title = '测试标题'
	@Prop({ default: '默认标题' })
	title: string
}
</script>
<style scoped lang="less">
@import url('../../styles/base-form.less');
.thumb-btn {
	display: flex;
	align-items: center;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	padding-bottom: 5px;
	// background: black;
	@form-base-shadow();
	@form-base-radius();
	margin: 10px;
	color: white;

	.thumb-btn {
		padding: 5px;
		margin-left: 5px;
		margin-right: 5px;
	}
}
</style>
