<template>
	<div id="map_content" v-loading="loading" element-loading-background="rgba(28, 34, 52, 0.733)">
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
				:visible="getSelectLoop"
			></LCircle>
		</l-map>
	</div>
</template>
<script lang="ts">
// vue 相关组件
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator'
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
import { addStationIcon2Map, IconTyphoonCirlePulsing } from '@/middle_model/icon'
// 接口类
import { IStationIcon, IStationInfo } from '@/interface/station'
import { IHttpResponse } from '@/interface/common'
import { IPoint } from '@/interface/geo'
import { ITyphoonParams4Station } from '@/interface/station'
// store
import {
	GET_IS_SELECT_LOOP,
	GET_BOX_LOOP_RADIUS,
	SET_BOX_LOOP_LATLNG,
	GET_CURRENT_TY,
	GET_CURRENT_TY_FORECAST_DT,
	SET_CURRENT_TY_FORECAST_DT,
	SET_DATE_STEP,
	SET_STATION_CODE,
	SET_COMPLEX_OPTS_CURRENT_STATION,
	GET_BASE_MAP_KEY,
	GET_TO_FILTER_TY_SCATTER,
	SET_TO_FILTER_TY_SCATTER,
	GET_FILTER_TY_SCATTER_MENU_TYPE,
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
	DEFAULT_TY_NUM,
	DEFAULT_STATION_NAME,
	DEFAULT_SURGE_VAL,
	DEFAULT_STATION_CODE,
} from '@/const/default'
// enum
import { IconTypeEnum } from '@/enum/common'
import { MenuType, TyScatterMenuType } from '@/enum/menu'
import { MapLayerEnum } from '@/enum/map'

// api
import { loadTyRealDataList, loadStationTideDataList } from '@/api/typhoon'
import { loadStationDetailDataList, loadStationNameDict } from '@/api/station'
// 各类插件
import { TyMiniMarker } from '@/plugins/customerMarker'
import {
	AbsBaseTyHeatmap,
	AbsBaseTyScatter,
	TyRadiusHeatMap,
	TyRadiusScatter,
	TyUniqueFilterScatter,
	TyUniquerFilterHeatMap,
} from '@/plugins/scatter'
// 工具类
import { convertTyRealDataMongo2TyCMAPathLine } from '@/middle_model/util'
import moment from 'moment'
import { ITyPath } from '@/interface/typhoon'
import { Collapse } from 'element-ui'
import station from '@/store/modules/station'
// 第三方插件
// 当前布局会导致此热图插件出错，暂时无法解决
// 以前使用的 heatmap 出现了问题，暂时不使用
// 方式1: 使用 heatmap.js 并使用对应 leaflet-heatmap.js 插件
import 'heatmap.js'
import HeatmapOverlay from '@/plugins/leaflet-heatmap.js'
// import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap'
// 方式2: 也不可行
// https://github.com/Leaflet/Leaflet.heat
// import HeatLayer from 'leaflet.heat'

// 其他方式:
// https://github.com/mejackreed/leaflet-solr-heatmap

// 方式4: 使用 leaflet-webgl-heatmap 但由于缺少部分组件，放弃
// https://github.com/ursudio/leaflet-webgl-heatmap
// leaflet-webgl-heatmap 需要引入 webgl-heatmap
// import 'path-browserify'
// import 'webgl-heatmap'
// import 'leaflet-webgl-heatmap'
// 方式3:
// import 'simpleheat'

// 引入事件总线
import { EventBus } from '@/bus/BUS'
import {
	TO_CLEAR_ALL_LAYER,
	TO_FILTER_TY_PATH_LIST,
	TO_GET_UNIQUE_TY_SEARCH_READ_DATA,
} from '@/bus/types'
import { FilterType4ScattersEnum, FilterTypeEnum } from '@/enum/filter'

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
	zoom = 5
	center: number[] = [27.45, 130.8833]
	url =
		'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
	// url = 'http://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png'
	// TODO:[-] 20-11-09 新加入的 map 相关的一些基础静态配置
	mapOptions: { preferCanvas: boolean; minZoom: number; maxZoom: number; render: any } = {
		preferCanvas: true,
		minZoom: 4,
		// 可缩放的最大 level
		maxZoom: 11,
		// 目前已经使用了 canvas 渲染
		render: L.canvas(),
	}

	isSelectLoop = false
	/** 当前窗口正在加载 */
	loading = false
	/** 当前圈选的中心位置 */
	currentLatlng: L.LatLng = new L.LatLng(28, 130)
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
		color: '#1abc9c',
		colorOpacity: 0.6,
		background: '#1abc9c',
		backgroundOpacity: 0.7,
	}

	/** 当前台风当前选中的时刻 */
	currentTyDateTime: Date = DEFAULT_DATE
	currentTyCode: string = DEFAULT_TY_CODE
	currentTyNum: string = DEFAULT_TY_NUM
	currentTyNameCH: string = DEFAULT_TY_NAME_CH
	currentTyName: string = DEFAULT_TY_NAME
	/** 当前台风的 cma 台风路径 */
	currentTyCMAPathList: ITyPath[] = []

	tyCMAGroupLayersId: number = DEFAULT_LAYER_ID

	/** 当前选定的海洋站 name (en) */
	currentStationName: string = DEFAULT_STATION_NAME
	currentStationCode: string = DEFAULT_STATION_CODE

	/** 当前时刻的台风所在位置脉冲 icon marker */
	currentTyPulsingMarker: L.Marker = null

	currentTyPulsingMarkerId: number = DEFAULT_LAYER_ID

	/** 加载的台风散点 group layer id */
	tyScattersGroupLayerId: number = DEFAULT_LAYER_ID

	tyScatterHeatMapLayer: L.Layer = null

	stationLayerGroupIds: number[] = []
	/** 海洋站名称中英文对照字典 */
	stationNameDict: { name: string; chname: string }[] = []

	@Getter(GET_IS_SELECT_LOOP, { namespace: 'map' }) getSelectLoop: boolean

	@Getter(GET_BOX_LOOP_RADIUS, { namespace: 'map' }) getBoxLoopRadius: number

	@Getter(GET_CURRENT_TY, { namespace: 'typhoon' }) getCurrentTy

	created() {
		EventBus.$on(TO_GET_UNIQUE_TY_SEARCH_READ_DATA, this.toLoadUniqueTyPathRealData)
		EventBus.$on(TO_CLEAR_ALL_LAYER, this.clearAllLayersByTy)
		EventBus.$on(TO_FILTER_TY_PATH_LIST, this.busToFilterTyPathList)
	}

	mounted() {
		const self = this
		self.stationNameDict = []
		//1- 页面首次加载加载站点对应字典
		loadStationNameDict().then((res: IHttpResponse<{ name: string; chname: string }[]>) => {
			if (res.status === 200) {
				res.data.length > 0
					? res.data.forEach((temp) => {
							self.stationNameDict.push(temp)
					  })
					: ''
			}
		})
	}

	@Watch('getSelectLoop')
	onSelectLoop(val: boolean): void {
		this.isSelectLoop = val
		const mymap: L.Map = this.$refs.basemap['mapObject']
		const self = this
		if (val) {
			mymap.on('click', (e: L.LeafletMouseEvent) => {
				// @ts-ignore
				self.currentLatlng = e.latlng

				// console.log(`更新当前位置:lat:${e.latlng.lat},lng:${e.latlng.lng}`)
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

	/** TODO:[*] 22-11-28 计算属性:获取根据范围圈选的个变量状态(目前未使用) */
	get boxTyByRadius(): {
		currentLatlng: L.LatLng
		getBoxLoopRadius: number
		getSelectLoop: boolean
	} {
		const { currentLatlng, getBoxLoopRadius, getSelectLoop } = this
		return { currentLatlng, getBoxLoopRadius, getSelectLoop }
	}

	/** 当前选中的台风 */
	get currentTy(): FilterTyMidModel {
		return this.getCurrentTy
	}

	/** TODO:[*] 22-11-28 监听:获取根据范围圈选的个变量状态(目前未使用) */
	@Watch('boxTyByRadius')
	onBoxTyByRadius(val: {
		currentLatlng: L.LatLng
		getBoxLoopRadius: number
		getSelectLoop: boolean
	}): void {
		if (val.getSelectLoop) {
			console.log(val)
			// const tyScatter = new TyRadiusScatter(val.currentLatlng, val.getBoxLoopRadius)
		}
	}

	/** 监听当前台风,当前台风发生变化加载该台风的台风路径,并添加点击icon对应的事件 */
	@Watch('currentTy')
	onCurrentTy(ty: FilterTyMidModel): void {
		const mymap: any = this.$refs.basemap['mapObject']
		const self = this
		// TODO:[-] 22-11-08 注意修改此处为了 触发 onCurrentTyOpts 方法，更新加载对应的当前时间的所有站点的潮位情况并加载至map中
		console.log(`监听到 MapView.currentTy 发生变化:${ty}`)

		if (ty !== null) {
			this.currentTyNum = ty.tyNum
			this.currentTyCode = ty.code
			// 注意当前台风边锋变化时不需要清除散点图层
			this.clearAllLayersByTy(false)
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
						/** 通用的台风路径 */
						const tyCMAPathList =
							convertTyRealDataMongo2TyCMAPathLine(tyRealDataMongoList)
						self.currentTyCMAPathList = tyCMAPathList
						// 将转换为 cma 的台风 list add 2 map
						// 添加至地图中
						/** 台风路径  */
						const cmaPathLine = new TyCMAPathLine(mymap, tyCMAPathList)

						// TODO:[*] 22-05-30 注意此处修改尝试使用 canvas 渲染路径中心点(png)
						// TODO:[*] 22-10-09 加入了鼠标移入与点击事件
						let dateStep = 1
						if (tyCMAPathList.length > 1) {
							let first = tyCMAPathList[0].forecastDt
							let second = tyCMAPathList[1].forecastDt
							dateStep = moment(second).hours() - moment(first).hours()
						}
						this.setDateStep(dateStep)
						/** 台风路径 layer */
						const cmaPathLineLayer = cmaPathLine.add2Map({
							onClick: (e: {
								target: {
									options: {
										customData: TyphoonCircleStatus
									}
								}
							}) => {
								// console.log(e.target.options.customData.forecastDt)
								this.currentTyCode = ty.code
								this.currentTyName = ty.name
								this.currentTyDateTime = e.target.options.customData.forecastDt
								this.currentTyNum = ty.tyNum
								// this.setTyForecastDt(this.currentTyDateTime)

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
						// @ts-ignore
						self.tyCMAGroupLayersId = cmaPathLineLayer._leaflet_id

						const lastTyLatlng = cmaPathLine.getlastTyLatlng()
						if (lastTyLatlng) {
							this.center = [lastTyLatlng.lat, lastTyLatlng.lng]
						}
					}
				}
			)
		} else {
			// 若传入的 currentTy 为 null 则清空全部 台风相关图层
			this.clearAllLayersByTy()
		}
	}

	/** 清除当前的台风的全部layer */
	clearAllLayersByTy(clearScatter = true): void {
		// 1- 清除当前台风路径 group layer
		// @ts-ignore
		this.clearLayerById(this.tyCMAGroupLayersId)
		// 2- 清除当前台风当前时刻对应的海洋站 group layers
		this.clearAllStationGroupLayers()
		// 3- 清除当前台风的脉冲 layer
		this.clearTyPulsingIconLayer()
		if (clearScatter) {
			// 4- 清除当前台风的散点 layer
			this.clearTyScattersLayer()
		}
	}

	/** 清除当前所有海洋站的 group layer */
	clearAllStationGroupLayers(): void {
		const self = this
		// this.clearLayersByIds(self.stationLayerGroupIds)
		this.stationLayerGroupIds.forEach((tempid) => {
			// @ts-ignore
			self.clearLayerById(tempid)
		})
	}

	/** 清除当前的台风脉冲 layer */
	clearTyPulsingIconLayer(): void {
		if (this.currentTyPulsingMarker !== null) {
			const mymap: L.Map = this.$refs.basemap['mapObject']
			mymap.removeLayer(this.currentTyPulsingMarker)
		}
	}

	/** 清除当前选定的圈选位置的中心点 */
	private clearCurrentLatlng(): void {
		this.currentLatlng = null
	}

	/** 清除全部台风(通过 radius过滤的) 的散点 layer */
	private clearTyScattersLayer(): void {
		// @ts-ignore
		this.clearLayerById(this.tyScattersGroupLayerId)
	}

	/** 设置当前圈选中心位置 */
	@Mutation(SET_BOX_LOOP_LATLNG, { namespace: 'map' }) setBoxLoopLatlng

	/** 设置当前的预报时间 */
	@Mutation(SET_CURRENT_TY_FORECAST_DT, { namespace: 'typhoon' }) setTyForecastDt

	/** 设置台风的时间间隔步长 */
	@Mutation(SET_DATE_STEP, { namespace: 'common' }) setDateStep

	/** 设置当前选中的海洋站 code */
	@Mutation(SET_STATION_CODE, { namespace: 'station' }) setStationCode

	/** 设置当前选中的海洋站 complex opts */
	@Mutation(SET_COMPLEX_OPTS_CURRENT_STATION, { namespace: 'complex' }) setCurrentStationOpts

	@Mutation(SET_TO_FILTER_TY_SCATTER, { namespace: 'common' }) setToFilterTy4Scatters

	/** 获取当前的预报时间 */
	@Getter(GET_CURRENT_TY_FORECAST_DT, { namespace: 'typhoon' }) getTyForecastDt

	/** 获取是否执行加载通过制定范围的全部台风散点 */
	@Getter(GET_TO_FILTER_TY_SCATTER, { namespace: 'common' }) get2FilterTy4Scatters: {
		(): boolean
	}

	/** 设置 当前圈选范围内的台风 散点|热图 菜单按钮 */
	@Getter(GET_FILTER_TY_SCATTER_MENU_TYPE, { namespace: 'map' })
	getFilterTyScatterMenuType: TyScatterMenuType

	@Watch('getTyForecastDt')
	onTyForecastDt(val: Date): void {
		this.currentTyDateTime = val
	}

	/** 根据展示类型加载对应的散点
	 * - 22-11-29 统一修改为 factoryLoadTy4Scatters
	 *
	 */
	async loadFilter4Scatters(val: boolean, scatterMenuType: TyScatterMenuType): Promise<void> {
		const self = this
		this.clearTyScattersLayer()
		if (val) {
			const mymap: L.Map = this.$refs.basemap['mapObject']
			this.loading = true
			// this.clearTyScattersLayer()
			switch (scatterMenuType) {
				case TyScatterMenuType.SCATTER:
					// 方式1: 散点
					const tyScatter = new TyRadiusScatter(
						this.currentLatlng,
						this.boxRadius * this.boxRadiusUnit
					)
					// 方式1: 散点
					tyScatter
						.getScatter()
						.then((res) => {
							// @ts-ignore
							self.tyScattersGroupLayerId = L.layerGroup(res).addTo(mymap)._leaflet_id
						})
						.finally(() => {
							// self.setToFilterTy4Scatters(false)
							self.loading = false
						})
					break
				case TyScatterMenuType.HEATMAP:
					// 方式2: 热图
					const tyHeatMap = new TyRadiusHeatMap(
						this.currentLatlng,
						this.boxRadius * this.boxRadiusUnit
					)

					// 方式2: 热图
					let heatmapData: { lat: number; lng: number; count: number }[] = []
					await tyHeatMap.getScatter().then((res) => {
						heatmapData = res
					})

					// 增加过滤环节
					const filterHeatmapData = heatmapData.filter((temp) => {
						return !Number.isNaN(temp.lat) && !Number.isNaN(temp.lng)
					})

					// 方式1:heatmap.js 会出错
					const heatData = {
						max: 2,
						data: filterHeatmapData,
					}
					const heatConfig = {
						// 此半径可以有效的滤掉由于 status = 2 造成的应该滤掉区域
						radius: 0.5, // 每个数据点的半径
						// radius: 0.01,
						maxOpacity: 0.6,
						minOpacity: 0.2,
						blur: 0.9, // 模糊因子，越高过度越平滑
						scaleRadius: true,
						useLocalExtrema: true,
						latField: 'lat',
						lngField: 'lng',
						valueField: 'count',
					}
					// @ts-ignore
					// mymap.invalidateSize()
					let heatLayer = new HeatmapOverlay(heatConfig)
					heatLayer.setData(heatData)

					//此处不论是放在异步方法中或是放在外侧均会出现以下错误
					/*
				ERROR:
				Uncaught (in promise) DOMException: Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The image argument is a canvas element with a width or height of 0.
				*/
					// 解决办法: https://stackoverflow.com/questions/72219281/failed-to-execute-createpattern-on-canvasrenderingcontext2d-the-image-argum
					// 无效
					self.tyScattersGroupLayerId = heatLayer.addTo(mymap)._leaflet_id
					self.loading = false
					// 方式2: leaflet.heat  此种方式也不可行
					// let heatData: number[][] = []
					// for (let index = 0; index < heatmapData.length; index++) {
					// 	const element = [
					// 		heatmapData[index].lat,
					// 		heatmapData[index].lng,
					// 		heatmapData[index].count,
					// 	]
					// 	heatData.push(element)
					// }
					// // @ts-ignore
					// var heat = HeatLayer(heatData, { radius: 25 }).addTo(mymap)

					// 方式4: leaflet-webgl-heatmap
					// @ts-ignore
					// var heatmap = L.webGLHeatmap({ size: 1000 })
					// heatmap.setData(heatData)
					// // ERROR: TypeError: window.createWebGLHeatmap is not a function
					// // 引入 webgl-heatmap 后出现
					// // ERROR in ./node_modules/webgl-heatmap/index.js 8:9-22
					// // Module not found: Error: Can't resolve 'fs' in '...\node_modules\webgl-heatmap'
					// // 相同的问题: https://github.com/pyalot/webgl-heatmap/issues/19
					// // 暂时不使用
					// mymap.addLayer(heatmap)
					break
			}
		}
	}

	/**
	 *
	 * @param filterType: 过滤类型: 复杂查询(唯一性查询) | 区域查询
	 * @param scatterMenuType: 加载散点类型: 散点 | 热图
	 * @param uniqueParams:	复杂查询(唯一性查询) 条件(可选) :
	 * @param uniqueParams.uniqueFilterType: 复杂查询类型 按年份 | 按月份
	 * @param uniqueParams.year 按指定年份进行复杂查询
	 * @param uniqueParams.month 按指定月份进行复杂查询
	 */
	async factoryLoadTy4Scatters(
		filterType: FilterType4ScattersEnum,
		scatterMenuType: TyScatterMenuType,
		uniqueParams?: {
			uniqueFilterType: FilterTypeEnum
			year?: string
			month?: string
		}
	): Promise<void> {
		const self = this
		const mymap: any = this.$refs.basemap['mapObject']
		self.loading = true
		this.clearTyScattersLayer()
		// step1: 根据 filterType 判断是 根据条件过滤 还是 根据圈选范围过滤

		switch (scatterMenuType) {
			// 散点
			case TyScatterMenuType.SCATTER:
				let tyScatter: AbsBaseTyScatter = null
				switch (filterType) {
					case FilterType4ScattersEnum.FILTER_BY_RADIUS:
						tyScatter = new TyRadiusScatter(
							this.currentLatlng,
							this.boxRadius * this.boxRadiusUnit
						)
						break
					case FilterType4ScattersEnum.FILTER_BY_UNIQUE_QUERY:
						if (uniqueParams !== undefined) {
							tyScatter = new TyUniqueFilterScatter(
								uniqueParams.uniqueFilterType,
								uniqueParams.year,
								uniqueParams.month
							)
						}
						break
					default:
						break
				}
				tyScatter
					.getScatter()
					.then((res) => {
						// @ts-ignore
						self.tyScattersGroupLayerId = L.layerGroup(res).addTo(mymap)._leaflet_id
					})
					.finally(() => {
						// self.setToFilterTy4Scatters(false)
						self.loading = false
					})
				break
			// 热图
			case TyScatterMenuType.HEATMAP:
				let tyHeatMap: AbsBaseTyHeatmap = null
				switch (filterType) {
					case FilterType4ScattersEnum.FILTER_BY_RADIUS:
						tyHeatMap = new TyRadiusHeatMap(
							this.currentLatlng,
							this.boxRadius * this.boxRadiusUnit
						)
						break
					case FilterType4ScattersEnum.FILTER_BY_UNIQUE_QUERY:
						tyHeatMap = new TyUniquerFilterHeatMap(
							uniqueParams.uniqueFilterType,
							uniqueParams.year,
							uniqueParams.month
						)
						break
					default:
						break
				}
				if (tyHeatMap !== null) {
					// 方式2: 热图
					let heatmapData: { lat: number; lng: number; count: number }[] = []
					await tyHeatMap.getScatter().then((res) => {
						heatmapData = res
					})

					// 增加过滤环节
					const filterHeatmapData = heatmapData.filter((temp) => {
						return !Number.isNaN(temp.lat) && !Number.isNaN(temp.lng)
					})

					// 方式1:heatmap.js 会出错
					const heatData = {
						max: 2,
						data: filterHeatmapData,
					}
					const heatConfig = {
						// 此半径可以有效的滤掉由于 status = 2 造成的应该滤掉区域
						radius: 0.5, // 每个数据点的半径
						// radius: 0.01,
						maxOpacity: 0.6,
						minOpacity: 0.2,
						blur: 0.9, // 模糊因子，越高过度越平滑
						scaleRadius: true,
						useLocalExtrema: true,
						latField: 'lat',
						lngField: 'lng',
						valueField: 'count',
					}
					// @ts-ignore
					// mymap.invalidateSize()
					let heatLayer = new HeatmapOverlay(heatConfig)
					heatLayer.setData(heatData)

					self.tyScattersGroupLayerId = heatLayer.addTo(mymap)._leaflet_id
				}

				self.loading = false
				break
			default:
				self.loading = false
				break
		}
	}

	/** 计算属性:监听 是否加载台风散点(bool) 与 散点|热图菜单枚举
	 * - 22-11-30 不再使用，由事件总线替代 busToFilterTyPathList
	 */
	get toLoadFilterTy4Scatters() {
		const { get2FilterTy4Scatters, getFilterTyScatterMenuType } = this
		return { get2FilterTy4Scatters, getFilterTyScatterMenuType }
	}

	/** + 22-11-30 通过 事件总线 加载过滤后的台风路径集合 散点|热图 */
	busToFilterTyPathList(): void {
		console.log('由事件总线触发过滤并加载台风路径的操作')
		this.factoryLoadTy4Scatters(
			FilterType4ScattersEnum.FILTER_BY_RADIUS,
			this.getFilterTyScatterMenuType
		)
	}

	@Watch('getFilterTyScatterMenuType')
	onFilterTyScattersMenuType(val: TyScatterMenuType): void {
		if (val === TyScatterMenuType.UN_SELECT) {
			this.clearTyScattersLayer()
		}
	}

	/** 监听获取台风散点变量
	 * - 22-11-30 不再使用，由事件总线替代 busToFilterTyPathList
	 */
	@Watch('toLoadFilterTy4Scatters')
	onToLoadFilterTy4Scatters(val: {
		get2FilterTy4Scatters: boolean
		getFilterTyScatterMenuType: TyScatterMenuType
	}): void {
		// if (
		// 	val.get2FilterTy4Scatters &&
		// 	val.getFilterTyScatterMenuType !== TyScatterMenuType.UN_SELECT
		// ) {
		// 	this.factoryLoadTy4Scatters(
		// 		FilterType4ScattersEnum.FILTER_BY_RADIUS,
		// 		val.getFilterTyScatterMenuType
		// 	)
		// 	// this.loadFilter4Scatters(true, val.getFilterTyScatterMenuType)
		// } else if (val.getFilterTyScatterMenuType === TyScatterMenuType.UN_SELECT) {
		// 	this.clearTyScattersLayer()
		// }
	}

	@Watch('currentTyDateTime')
	onCurrentTyDate(val: Date): void {
		this.addTargetDateTyIcon2Map(val)
	}

	get currentTyOpts(): { currentTyNum; currentTyName; currentTyDateTime } {
		const { currentTyNum, currentTyName, currentTyDateTime } = this
		return { currentTyNum, currentTyName, currentTyDateTime }
	}

	/** 当前海洋站的 opts 选项 */
	get currentStationOpts(): {
		currentTyNum: string
		currentTyCode: string
		currentStationName: string
		currentStationCode: string
	} {
		const { currentTyNum, currentTyCode, currentStationName, currentStationCode } = this
		return { currentTyNum, currentTyCode, currentStationName, currentStationCode }
	}

	@Watch('currentStationOpts')
	onCurrentStationOpts(val: {
		currentTyNum: string
		currentTyCode: string
		currentStationName: string
		currentStationCode: string
	}): void {
		this.setCurrentStationOpts({
			tyNum: val.currentTyNum,
			tyCode: val.currentTyCode,
			stationName: val.currentStationName,
			stationCode: val.currentStationCode,
		})
	}

	/** 根据 tyCode,forecastDt 加载海洋站列表 */
	@Watch('currentTyOpts')
	onCurrentTyOpts(val: { currentTyNum; currentTyName; currentTyDateTime }): void {
		// console.log(`监听到currentTy的参数发生变化:${val}`)
		const self = this
		const mymap: L.Map = this.$refs.basemap['mapObject']
		/** 潮位数据的上限(单位厘米) */
		const SURGE_MAX = 300
		let layerGroupIds: number[] = []
		console.log(`监听到 MapView.currentTyOpts 发生变化:${val}`)
		this.setTyForecastDt(val.currentTyDateTime)
		this.clearAllStationGroupLayers()
		loadStationTideDataList({
			num: val.currentTyNum,
			name: val.currentTyName,
			date: val.currentTyDateTime,
		}).then(
			(
				res: IHttpResponse<
					{
						forecast: { occurred: string; val_forecast: number; val_real: number }
						station: {
							code: string
							harmonicconstant: string
							jw: number
							lev: number
							startdate: string
							stationname: string
							point: IPoint
						}
					}[]
				>
			) => {
				if (res.status === 200) {
					/*
				1. forecast:
					1. occurred: "2015-07-11T00:00:00Z"
					2. val_forecast: 651
					3. val_real: 702
					4. [[Prototype]]: Object
				2. station:
					1. code: "DONGSHAN"
					2. harmonicconstant: "H.G.Y.2009"
					3. jw: 750
					4. lev: 538
					5. point: {type: 'Point', coordinates: Array(2)}
					6. startdate: "2015-07-08T16:00:00Z"
					7. stationname: "DONGSHAN"
					8. [[Prototype]]: Object
				[]
				*/
					let stationInfoList: IStationInfo[] = []
					res.data.forEach((temp) => {
						const tempStationInfo: IStationInfo = {
							id: -1,
							code: temp.station.code,
							name: temp.station.stationname,
							lat: temp.station.point.coordinates[1],
							lon: temp.station.point.coordinates[0],
							/*
							 ERROR: Cannot use 'in' operator to search for 'val_real' in null
							*/
							surge:
								temp !== null &&
								'forecast' in temp &&
								temp.forecast !== null &&
								'val_real' in temp.forecast &&
								temp.forecast['val_real'] != null &&
								'val_forecast' in temp.forecast &&
								temp.forecast['val_forecast'] &&
								temp.forecast.val_real !== DEFAULT_SURGE_VAL &&
								temp.forecast.val_forecast !== DEFAULT_SURGE_VAL
									? temp.forecast.val_real - temp.forecast.val_forecast
									: 0,
						}
						stationInfoList.push(tempStationInfo)
					})
					layerGroupIds = addStationIcon2Map(
						mymap,
						stationInfoList,
						SURGE_MAX,
						self.stationNameDict,
						(stationTemp: { code: string; name: string }): void => {
							console.log(
								`获取当前点击的station marker, name:${stationTemp.name},code:${stationTemp.code}`
							)
							self.currentStationCode = stationTemp.code
							self.currentStationName = stationTemp.name
						}
					)
					// TODO:[-] 22-10-23 注意此处会引发一个比较隐蔽的bug,由于是在异步中，更新 ids 需要放在异步方法中，注意！
					this.stationLayerGroupIds = layerGroupIds
				}
			}
		)
	}

	/** 获取当前地图key */
	@Getter(GET_BASE_MAP_KEY, { namespace: 'map' }) getBaseMapKey

	@Watch('getBaseMapKey')
	onBaseMapKey(val: MapLayerEnum): void {
		const mymap: L.Map = this.$refs.basemap['mapObject']
		switch (true) {
			// case val === MapLayerEnum.SATELITE_MAP:
			//     this.url = `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${MAPTITLELAYER_TOKEN_KEY}`
			case val === MapLayerEnum.SATELITE_MAP:
				this.url = 'http://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png'

				// this.getMapBoxLayerClass('0TuB9SR4KyaoCi4FUrPM').addTo(mymap)
				break
			case val === MapLayerEnum.SIMPLE_MAP:
				// 使用 geoq 的底图
				this.url =
					'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
				break
		}
	}

	/** + 22-10-24 加载 targetDt 的台风脉冲 icon 2 map */
	addTargetDateTyIcon2Map(targetDt: Date): void {
		const mymap: L.Map = this.$refs.basemap['mapObject']
		// 清除当前台风的脉冲 layer
		this.clearTyPulsingIconLayer()
		/** 当前时刻对应的 ITyPath */
		let targetTy: ITyPath = null
		/** 一小时换算成毫秒 */
		const HOUR_MS_UNIT: number = 60 * 60 * 1000
		if (this.currentTyCMAPathList.length > 0) {
			targetTy = this.currentTyCMAPathList.find((temp) => {
				return moment(temp.forecastDt).valueOf() === moment(targetDt).valueOf()
			})

			// TODO:[*] 22-10-25 加入了插值
			/*
			 step:
			  1- 对 tyCMAPathlist 进行排序，升序
			  2- 找到临近的前后两个值
			*/
			if (targetTy === undefined) {
				const tyCMAPathList = this.currentTyCMAPathList.sort((a, b) => {
					return a.forecastDt.getTime() - b.forecastDt.getTime()
				})
				/** 下一个时刻的台风实况 */
				let next: ITyPath = null
				/** 上一个时刻的台风实况 */
				let last: ITyPath = null
				for (let index = 0; index < tyCMAPathList.length - 1; index++) {
					if (
						targetDt.getTime() < tyCMAPathList[index + 1].forecastDt.getTime() &&
						targetDt.getTime() > tyCMAPathList[index].forecastDt.getTime()
					) {
						next = tyCMAPathList[index + 1]
						last = tyCMAPathList[index]
						/** 前后的时间差(小时) */
						const diffHours: number =
							(next.forecastDt.getTime() - last.forecastDt.getTime()) / HOUR_MS_UNIT
						/**  获取当前时间在 last 与 next 中的位置 */
						const nowDiffLastDtIndex: number = Math.floor(
							(targetDt.getTime() - last.forecastDt.getTime()) / HOUR_MS_UNIT
						)
						/** 插值计算后的当前时间对应的台风model */
						const interTy: ITyPath = {
							forecastDt: targetDt,
							lat:
								last.lat + ((next.lat - last.lat) / diffHours) * nowDiffLastDtIndex,
							lon:
								last.lon + ((next.lon - last.lon) / diffHours) * nowDiffLastDtIndex,
							bp: last.bp + ((next.bp - last.bp) / diffHours) * nowDiffLastDtIndex,
							isForecast: true,
							tyType: last.tyType,
						}
						targetTy = interTy
					}
				}
			}
			const tyMax = 10
			const tyMin = 1
			const tyCirleIcon = new IconTyphoonCirlePulsing({
				val: 10,
				max: tyMax,
				min: tyMin,
				iconType: IconTypeEnum.TY_PULSING_ICON,
			})
			const tyDivIcon = L.divIcon({
				className: 'surge_pulsing_icon_default',
				html: tyCirleIcon.toHtml(),
			})
			const tyPulsingMarker = L.marker([targetTy.lat, targetTy.lon], {
				icon: tyDivIcon,
			})
			this.currentTyPulsingMarker = tyPulsingMarker.addTo(mymap)
		}
	}

	// @Emit('my-add-to-count')
	/** + 22-11-21 根据唯一性条件查询获取过滤的所有台风实况 */
	toLoadUniqueTyPathRealData(params: { year: string; month: string }) {
		// this.count += n
		// console.log(`监听到count发声变化:${this.count}`)
		let tyUniqueFilterType = FilterTypeEnum.NULL
		this.clearTyScattersLayer()
		if (params.year !== '') {
			tyUniqueFilterType = FilterTypeEnum.FILTER_BY_UNIQUE_YEAR
		} else if (params.month !== '') {
			tyUniqueFilterType = FilterTypeEnum.FILTER_BY_UNIQUE_MONTH
		}
		let tyScatterMenuType = this.getFilterTyScatterMenuType
		this.factoryLoadTy4Scatters(
			FilterType4ScattersEnum.FILTER_BY_UNIQUE_QUERY,
			tyScatterMenuType,
			{ uniqueFilterType: tyUniqueFilterType, year: params.year, month: params.month }
		)
		// this.loadTyUniqueFilter4Scatters(
		// 	tyScatterMenuType,
		// 	tyUniqueFilterType,
		// 	params.year,
		// 	params.month
		// )
	}
}
</script>
<style lang="less">
@import '../../styles/base';
@import '../../styles/map/my-leaflet';
@import '../../styles/typhoon/typhoonDivicon';
@import '../../styles/station/stationIcon';

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
