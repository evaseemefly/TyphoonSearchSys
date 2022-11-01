<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'

// store
import { SET_SHOW_TY_SEARCH_FORM } from '@/store/types'
import BaseThumbView from './baseThumbView.vue'
/** 台风搜索缩略框 */
@Component({})
export default class TySearchThumbView extends BaseThumbView {
	title = '台风查询列表'

	public showForm(): void {
		this.setShowTySearchForm(true)
	}
	public hiddenForm(): void {
		this.setShowTySearchForm(false)
	}

	@Mutation(SET_SHOW_TY_SEARCH_FORM, { namespace: 'common' }) setShowTySearchForm
}
</script>
