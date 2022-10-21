<template>
	<div id="map_content">
		<l-map
			ref="basemap"
			:zoom="zoom"
			:center="center"
			:options="mapOptions"
			:maxZoom="mapOptions.maxZoom"
			:minZoom="mapOptions.minZoom"
			id="ceshimap"
		>
			<l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
			<l-wms-tile-layer
				:baseUrl="ninelineWMS.url"
				:layers="ninelineWMS.options.layer"
				:format="ninelineWMS.options.format"
				:transparent="ninelineWMS.options.transparent"
			></l-wms-tile-layer>
			<!-- 南海岛礁 -->
			<l-wms-tile-layer
				:baseUrl="southlandWMS.url"
				:layers="southlandWMS.options.layer"
				:format="southlandWMS.options.format"
				:transparent="southlandWMS.options.transparent"
			></l-wms-tile-layer>

			<!-- TODO:[-] 20-08-26 新加入的世界国境线 -->
			<l-wms-tile-layer
				:baseUrl="worldLineWMS.url"
				:layers="worldLineWMS.options.layer"
				:format="worldLineWMS.options.format"
				:transparent="worldLineWMS.options.transparent"
				:zIndex="worldLineWMS.options.zindex"
			></l-wms-tile-layer>

			<LCircle
				:lat-lng="currentLatlng"
				:radius="boxRadius * boxRadiusUnit"
				:opacity="boxOptions.colorOpacity"
				:color="boxOptions.background"
				:fillColor="boxOptions.background"
				:fillOpacity="boxOptions.backgroundOpacity"
			></LCircle>
		</l-map>
	</div>
</template>
<script lang="ts">
// vue 相关组件
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation, State, namespace } from 'vuex-class'
import { mixins } from 'vue-class-component'
// gis引擎组件
import * as L from 'leaflet'
import {
	LMap,
	LTileLayer,
	LMarker,
	LPopup,
	LPolyline,
	LPolygon,
	LCircle,
	LIcon,
	LWMSTileLayer,
	LGeoJson,
	LRectangle,
	// LeafletHeatmap
} from 'vue2-leaflet'

// mixin
import { WMSMixin } from '@/views/map/mixin/wmsMixin'
import { MapMixin } from '@/views/map/mixin/mapMixin'
// mid model
import { FilterTyMidModel, TyRealDataMongoMidModel } from '@/middle_model/typhoon'
import { ISearchTyStationParams } from '@/middle_model/api_params'
import { TyphoonCircleStatus, TyCMAPathLine } from '@/middle_model/leaflet_plugin'
// store
import {
	GET_IS_SELECT_LOOP,
	GET_BOX_LOOP_RADIUS,
	SET_BOX_LOOP_LATLNG,
	GET_CURRENT_TY,
} from '@/store/types'
// 默认常量
import {
	DEFAULT_BOX_LOOP_RADIUS,
	DEFAULT_BOX_LOOP_RADIUS_UNIT,
	DEFAULT_BOX_LOOP_LATLNG,
	DEFAULT_LAYER_ID,
	DEFAULT_DATE,
	DEFAULT_TY_CODE,
	DEFAULT_TY_NAME_CH,
	DEFAULT_TY_NAME,
} from '@/const/default'

// api
import { loadTyRealDataList } from '@/api/typhoon'
// 各类插件
import { TyMiniMarker } from '@/plugins/customerMarker'
// 工具类
import { convertTyRealDataMongo2TyCMAPathLine } from '@/middle_model/util'

@Component({
	components: {
		// LMarker,
		// LMap,
		// LTileLayer,
		// LPolyline,
		// LCircle,
		// LIcon,
		// LWMSTileLayer,
		// LGeoJson,
		// LPolygon,
		// LRectangle,
		'l-marker': LMarker,
		'l-map': LMap,
		'l-tile-layer': LTileLayer,
		'l-polyline': LPolyline,
		LCircle,
		'l-icon': LIcon,
		'l-wms-tile-layer': LWMSTileLayer,
		'l-geo-json': LGeoJson,
		'l-polygon': LPolygon,
		'l-rectangle': LRectangle,
	},
	mixins: [WMSMixin, MapMixin],
})
export default class MainMapView extends Vue {
	zoom = 7
	center: number[] = [22.45, 113.8833]
	url =
		'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
	// TODO:[-] 20-11-09 新加入的 map 相关的一些基础静态配置
	mapOptions: { preferCanvas: boolean; minZoom: number; maxZoom: number; render: any } = {
		preferCanvas: true,
		minZoom: 5,
		// 可缩放的最大 level
		maxZoom: 11,
		// 目前已经使用了 canvas 渲染
		render: L.canvas(),
	}

	isSelectLoop = false
	/** 当前圈选的中心位置 */
	currentLatlng: L.LatLng = new L.LatLng(30, 150)
	/** 圈选半径 */
	boxRadius = DEFAULT_BOX_LOOP_RADIUS
	/** 圈选半径基础单位 */
	boxRadiusUnit = DEFAULT_BOX_LOOP_RADIUS_UNIT

	tyRealDataList: TyRealDataMongoMidModel[] = []
	tyCMAPathLineId = -1
	tempTyMarkerId = -1
	/** 临时的台风marker 主要显示 时间,bp */
	tempTyMarker: L.Marker<any> = null
	/** 圈选选项 */
	boxOptions = {
		color: '#2ecc71',
		colorOpacity: 0.6,
		background: '#2ecc71',
		backgroundOpacity: 0.7,
	}

	/** 当前台风当前选中的时刻 */
	currentTyDateTime: Date = DEFAULT_DATE
	currentTyCode: string = DEFAULT_TY_CODE
	currentTyNameCH: string = DEFAULT_TY_NAME_CH
	currentTyName: string = DEFAULT_TY_NAME

	@Getter(GET_IS_SELECT_LOOP, { namespace: 'map' }) getSelectLoop

	@Getter(GET_BOX_LOOP_RADIUS, { namespace: 'map' }) getBoxLoopRadius

	@Getter(GET_CURRENT_TY, { namespace: 'typhoon' }) getCurrentTy

	@Watch('getSelectLoop')
	onSelectLoop(val: boolean): void {
		this.isSelectLoop = val
		const mymap: L.Map = this.$refs.basemap['mapObject']
		const self = this
		if (val) {
			mymap.on('click', (e: L.LeafletMouseEvent) => {
				// @ts-ignore
				self.currentLatlng = e.latlng

				console.log(`更新当前位置:lat:${e.latlng.lat},lng:${e.latlng.lng}`)
				// console.log('被点击了')
			})
		} else {
			mymap.off('mousedown')
		}
	}

	@Watch('getBoxLoopRadius')
	onGetBoxLoopRadius(val: number): void {
		this.boxRadius = val
	}

	@Watch('currentLatlng')
	onCurrentLatlng(val: L.LatLng): void {
		this.setBoxLoopLatlng(val)
	}

	/** 当前选中的台风 */
	get currentTy(): FilterTyMidModel {
		return this.getCurrentTy
	}

	@Watch('currentTy')
	onCurrentTy(ty: FilterTyMidModel): void {
		const mymap: any = this.$refs.basemap['mapObject']
		const self = this
		if (ty !== null) {
			const code = ty.code
			const tyNum = ty.tyNum
			loadTyRealDataList(code, tyNum).then(
				(res: {
					status: number
					data: {
						code: string
						date: string
						num: string
						bp: number
						wsm: number
						latlon: { coordinates: number[]; type: string }
					}[]
				}) => {
					if (res.status === 200 && res.data.length > 0) {
						/*
					  {code: 'Nesat',
					   date: '2011-09-23T06:00:00Z',
					   num: '1117',
					   bp: 1002,
					   wsm: 12, …}
					*/
						self.tyRealDataList = []
						let tyRealDataMongoList: TyRealDataMongoMidModel[] = []
						res.data.forEach((temp) => {
							tyRealDataMongoList.push(
								new TyRealDataMongoMidModel(
									temp.code,
									temp.date,
									temp.num,
									temp.bp,
									temp.wsm,
									new L.LatLng(
										temp.latlon.coordinates[1],
										temp.latlon.coordinates[0]
									)
								)
							)
						})
						// 将 mongo ty list -> cma path line
						// 通用的台风路径
						const tyCMAPathList =
							convertTyRealDataMongo2TyCMAPathLine(tyRealDataMongoList)
						// 将转换为 cma 的台风 list add 2 map
						// 添加至地图中
						const cmaPathLine = new TyCMAPathLine(mymap, tyCMAPathList)

						// TODO:[*] 22-05-30 注意此处修改尝试使用 canvas 渲染路径中心点(png)
						// TODO:[*] 22-10-09 加入了鼠标移入与点击事件
						const cmaPathLineLayer = cmaPathLine.add2Map({
							onClick: (e: {
								target: {
									options: {
										customData: TyphoonCircleStatus
									}
								}
							}) => {
								console.log(e.target.options.customData.forecastDt)
								this.currentTyCode = ty.code
								// this.setTyForecastDt(e.target.options.customData.forecastDt)
							},
							onMouseOver: (e: {
								target: {
									options: {
										customData: TyphoonCircleStatus
									}
								}
							}) => {
								const customData = e.target.options.customData
								const tyMarkerInstance = new TyMiniMarker(
									customData.lat,
									customData.lon,
									customData.forecastDt,
									customData.bp
								)
								const divIcon = L.divIcon({
									className: 'leaflet_marker_tyhoon-mini',
									html: tyMarkerInstance.toHtml(),
									iconAnchor: [20, -30], // point of the icon which will
								})
								// console.log()
								const tyMarker = L.marker([customData.lat, customData.lon], {
									icon: divIcon,
									// zIndexOffset: 9999,
								})
								// @ts-ignore
								self.tempTyMarkerId = tyMarker.addTo(mymap)._leaflet_id
							},
							onMouseOut: (e: {
								target: {
									options: {
										customData: TyphoonCircleStatus
									}
								}
							}) => {
								// 清除当前 ty marker
								// @ts-ignore
								self.clearLayerById(self.tempTyMarkerId)
								self.tempTyMarkerId = DEFAULT_LAYER_ID
								self.tempTyMarker = null
							},
						})
						// cmaPathLine.add2MapByCanvas()
						const lastTyLatlng = cmaPathLine.getlastTyLatlng()
						if (lastTyLatlng) {
							this.center = [lastTyLatlng.lat, lastTyLatlng.lng]
						}
						console.log(tyCMAPathList)
					}
				}
			)
		}
	}

	/** 设置当前圈选中心位置 */
	@Mutation(SET_BOX_LOOP_LATLNG, { namespace: 'map' }) setBoxLoopLatlng
}
</script>
<style lang="less">
@import '../../styles/base';
@import '../../styles/map/my-leaflet';
@import '../../styles/typhoon/typhoonDivicon';

#map_content {
	// 此处放在base.less中的@centermap中
	// padding: 10px;
	flex: 5;
	display: flex;
	flex-direction: column;
	// 留出右侧的 信息栏 的位置
	// margin-right: 50px;
	@centermap();
	@center();

	#process {
		display: flex;
		z-index: 1500;
		width: 100%;

		.progress {
			width: 100%;
		}
	}

	// TODO:[-] 20-06-18 添加的 overlayer 的样式
	.leaflet-control-layers-list label {
		color: black !important;
	}

	// 20-08-04 覆盖一下leaflet的control-zoom 样式
	.leaflet-control-container {
		.leaflet-top {
			top: 60px;
		}
	}
}
</style>
