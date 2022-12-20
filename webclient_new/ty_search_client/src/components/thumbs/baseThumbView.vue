<template>
	<div class="thumb-btn">
		<span>{{ title }}</span>
		<div class="thumb-btn" @click="onClick(true)">
			<i class="fa-solid fa-up-right-and-down-left-from-center"></i>
		</div>
		<!-- <div class="thumb-btn" @click="onClick(false)">
			<i class="fa-solid fa-minus"></i>
		</div> -->
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
/** 基础的缩略按钮视图 */
/**
 *  Argument of type 'typeof BaseThumbView' is not assignable to parameter of type 'VueClass<Vue<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => Vue<Record<string, any>, Record<string, any>, never, never, ...>>>'.
  Type 'typeof BaseThumbView' is not assignable to type 'new (...args: any[]) => Vue<Record<string, any>, Record<string, any>, never, never, (event: string, ...args: any[]) => Vue<Record<string, any>, Record<string, any>, never, never, ...>>'.
    Cannot assign an abstract constructor type to a non-abstract constructor type.
 */
// @Component
export default abstract class BaseThumbView extends Vue {
	// title = '测试标题'
	@Prop({ default: '默认标题', type: String })
	title: string

	// @Prop({ default: '默认标题', type: String })
	// title: string

	/** 是否展开显示 */
	isShow = false

	onClick(val: boolean): void {
		// console.log(val)
		this.isShow = val

		if (val) {
			this.showForm()
		} else {
			this.hiddenForm()
		}
	}

	// @Watch('isShow')
	// onIsShow(val: boolean): void {
	// 	if (val) {
	// 		this.showForm()
	// 	} else {
	// 		this.hiddenForm()
	// 	}
	// }

	public abstract showForm(): void

	public abstract hiddenForm(): void
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
	@form-base-background();
	margin: 10px;
	color: white;

	.thumb-btn {
		padding: 5px;
		margin-left: 5px;
		margin-right: 5px;
	}
}
</style>
