<template>
	<div id="switch-base-map">
		<font>底图切换</font>
		<!-- <el-switch
            style="display: block"
            v-model="isLocalMap"
            active-color="#16a085"
            inactive-color="#f39c12"
            active-text="卫星底图"
            inactive-text="简略底图"
        >
        </el-switch> -->
		<!-- <div class="card-list-bar">
            <div
                class="card-info "
                :class="[layer.isActive ? 'my-sub' : '', getBaseMapType(layer)]"
                :key="layer.code"
                @click="setBaseMapType(layer)"
                v-for="layer in showLayers"
            >
                {{ layer.desc }}
            </div>
        </div> -->
		<div class="card-list-bar">
			<div
				class="card-info"
				:key="layer.code"
				:class="[layer.isActive ? 'my-sub' : '', getBaseMapType(layer)]"
				@click="setBaseMapType(layer)"
				v-for="layer in showLayers"
			>
				<i :class="layer.iconCls"></i>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
// + 21-08-23 加入的切换底图的 switch bar
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation, State, namespace, Getter } from 'vuex-class'
import { MapLayerEnum } from '@/enum/map'
import { SET_BASE_MAP_KEY } from '@/store/types'
@Component({})
export default class SwitchBackgroundMap extends Vue {
	mydata: any = null
	isLocalMap = false
	showLayers: {
		code: number
		name: string
		val: string
		desc: string
		isActive: boolean
		iconCls: string
	}[] = [
		{
			code: MapLayerEnum.SATELITE_MAP,
			name: '卫星底图',
			val: '卫星底图',
			desc: '卫星底图',
			isActive: false,
			iconCls: 'fas fa-globe-asia',
		},
		{
			code: MapLayerEnum.SIMPLE_MAP,
			name: '简略底图',
			val: '简略底图',
			desc: '简略底图',
			isActive: true,
			iconCls: 'fas fa-globe',
		},
	]
	baseMapType: MapLayerEnum = MapLayerEnum.SIMPLE_MAP
	getBaseMapType(area: { code: number }): string {
		if (this.showLayers.length > 0) {
			return 'my-primary'
		}
		return ''
	}
	setBaseMapType(val: {
		code: number
		name: string
		val: string
		desc: string
		isActive: boolean
	}): void {
		this.baseMapType = val.code
		this.setBaseMapKey(this.baseMapType)
		this.showLayers.map((temp) => {
			if (temp.code === val.code) {
				temp.isActive = !temp.isActive
			} else {
				temp.isActive = false
			}
		})
	}

	@Mutation(SET_BASE_MAP_KEY, { namespace: 'map' }) setBaseMapKey
}
</script>
<style scoped lang="less">
@import '../../styles/common/card';
#switch-base-map {
	margin: 2px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	.card-list-bar {
		width: 200px;
	}
	font {
		font-size: 14px;
		color: white;
		text-shadow: 0 0 4px black;
	}
	.el-switch {
		margin-left: 15px;
	}
}
</style>
