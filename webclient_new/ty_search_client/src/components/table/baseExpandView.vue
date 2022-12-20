<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
// enum
import { IExpandEnum } from '@/enum/common'

// store
import { GET_SHOW_STATION_EXTREMUM_FORM, SET_SHOW_STATION_EXTREMUM_FORM } from '@/store/types'
export default abstract class BaseExpandView extends Vue {
	isExpanded = true
	@Watch('getShowForm')
	onGetShowForm(val: IExpandEnum): void {
		let isShow = false
		switch (val) {
			case IExpandEnum.UN_EXPANDED:
				isShow = false && this.isExpanded
				break
			case IExpandEnum.EXPANDED:
				// this.setExpanded(true)
				this.isExpanded = true
				isShow = true && this.isExpanded
				break
			// case IExpandEnum.UN_SELECTED:
			// 	isShow = this.getStationCount !== 0 && this.isExpanded
			// 	break
		}
		this.isExpanded = isShow
	}

	/** store -> 是否显示fom t:显示 */
	@Getter(GET_SHOW_STATION_EXTREMUM_FORM, { namespace: 'common' }) getShowForm: IExpandEnum

	@Mutation(SET_SHOW_STATION_EXTREMUM_FORM, { namespace: 'common' }) setShowExtremumForm

	abstract getStationCount: () => number
}
</script>
