<template>
	<div></div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

/** + 22-10-14 只包含 title 的 sub Item */
@Component({})
export default class SubNavTitleItem extends Vue {
	mydata: any = null
	// @Prop({ type: any })
	// navItems

	mounted() {}
	get computedTest() {
		return null
	}
}
</script>
<style scoped></style>
