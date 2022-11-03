<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'

// store
import { SET_SHOW_STATION_DETAIL_FORM } from '@/store/types'
import BaseThumbView from './baseThumbView.vue'
/** 台风搜索缩略框 */
@Component({})
export default class StationSurgeListThumbView extends BaseThumbView {
	title = '潮位站详情'

	public showForm(): void {
		this.setShowStationSurgeList(true)
	}
	public hiddenForm(): void {
		this.setShowStationSurgeList(false)
	}

	@Mutation(SET_SHOW_STATION_DETAIL_FORM, { namespace: 'common' }) setShowStationSurgeList
}
</script>
