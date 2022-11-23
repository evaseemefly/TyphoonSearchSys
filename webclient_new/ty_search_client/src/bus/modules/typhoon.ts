import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class TyphoonComponent extends Vue {
	count = 0

	@Emit('my-add-to-count')
	addToCount(n: number) {
		this.count += n
		console.log(`监听到count发声变化:${this.count}`)
	}
}
