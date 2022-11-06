<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'

// store
import { SET_SHOW_TY_SEARCH_FORM } from '@/store/types'
import BaseThumbView from './baseThumbView.vue'
import { IExpandEnum } from '@/enum/common'
/** 台风搜索缩略框 */
@Component({})
export default class TySearchThumbView extends BaseThumbView {
	title = '台风查询列表'

	public showForm(): void {
		this.setShowTySearchForm(IExpandEnum.EXPANDED)
	}
	public hiddenForm(): void {
		this.setShowTySearchForm(IExpandEnum.UN_EXPANDED)
	}

	@Mutation(SET_SHOW_TY_SEARCH_FORM, { namespace: 'common' }) setShowTySearchForm
}
</script>
