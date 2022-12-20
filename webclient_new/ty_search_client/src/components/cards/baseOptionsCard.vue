<template>
	<div class="drawer-children-card">
		<div class="card-title">{{ optionItems.cardTitle }}</div>
		<div class="card-content">
			<div
				class="card-content-line"
				v-for="child in optionItems.options"
				:key="child.key"
				@click="unChecked(child)"
			>
				<!-- <div :class="[child.checked ? 'fas fa-check' : '', 'check-box']"> -->
				<div :class="['check-box']">
					<div v-show="child.checked">
						<i
							:class="[child.checked ? 'fas fa-check' : '']"
							v-show="child.checked"
						></i>
						{{ child.checked ? '' : ' ' }}
					</div>
				</div>
				<font class="font-shadow-base">{{ child.title }}</font>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
// + 22-03-11 抽象的父类，需要子类重写 optionsItems 属性
@Component({})
export default class IBaseOptionsCard extends Vue {
	mydata: any = null
	// @Prop()

	// 22-03-11 抽象需要子类实现的 选项item
	optionItems: {
		cardTitle: string
		options: { title: string; key: number; val: string; checked: boolean }[]
	}

	@Prop()
	defaultOptionsItems: {
		cardTitle: string
		options: { title: string; key: number; val: string; checked: boolean }[]
	}

	created() {
		this.optionItems = this.defaultOptionsItems
	}

	unChecked(val: { checked: boolean }): void {
		val.checked = !val.checked
	}
	// optionItems: {
	//     cardTitle: string
	//     options: { title: string; key: number; val: string; checked: boolean }[]
	// }[] = [
	//     {
	//         cardTitle: '测试1',
	//         options: [
	//             { title: '选项1-1', key: 1, val: 'opt1', checked: true },
	//             { title: '选项1-2', key: 2, val: 'opt2', checked: false },
	//             { title: '选项1-3', key: 3, val: 'opt3', checked: false }
	//         ]
	//     },
	//     {
	//         cardTitle: '测试2',
	//         options: [
	//             { title: '选项2-1', key: 1, val: 'opt1', checked: true },
	//             { title: '选项2-2', key: 2, val: 'opt2', checked: true },
	//             { title: '选项2-3', key: 3, val: 'opt3', checked: false }
	//         ]
	//     },
	//     {
	//         cardTitle: '测试3',
	//         options: [
	//             { title: '选项3-1', key: 1, val: 'opt1', checked: false },
	//             { title: '选项3-2', key: 2, val: 'opt2', checked: true },
	//             { title: '选项3-3', key: 3, val: 'opt3', checked: false }
	//         ]
	//     }
	// ]
	mounted() {}
	get computedTest() {
		return null
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
		}
		.card-content {
			margin: 8px;
			.card-content-line {
				display: flex;
				align-items: center;
				.check-box {
					width: 20px;
					height: 20px;
				}
				font {
					margin: 5px;
					color: whitesmoke;
				}
			}
		}
	}
}
</style>
