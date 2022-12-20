<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'

// store
import { SET_SHOW_STATION_EXTREMUM_FORM } from '@/store/types'
import BaseThumbView from './baseThumbView.vue'
import { IExpandEnum } from '@/enum/common'
/** 台风搜索缩略框 */
@Component({})
export default class StationExtremumListThumbView extends BaseThumbView {
	title = '潮位站极值'

	public showForm(): void {
		this.setShowStationExtremum(IExpandEnum.EXPANDED)
	}
	public hiddenForm(): void {
		this.setShowStationExtremum(IExpandEnum.UN_EXPANDED)
	}

	@Mutation(SET_SHOW_STATION_EXTREMUM_FORM, { namespace: 'common' }) setShowStationExtremum
}
</script>
