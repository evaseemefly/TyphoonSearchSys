/**
 * + 22-11-12 加入了各类散点图
 */

import { loadTyScatterByComplex, loadTyScattersByRadius } from '@/api/typhoon'
import { IHttpResponse } from '@/interface/common'
import { TyRealDataBpMidModel } from '@/middle_model/typhoon'
import { convertBp2HeatMapFactor, getBpRange } from '@/middle_model/util'

import * as L from 'leaflet'
import chroma from 'chroma-js'
import { FilterTypeEnum } from '@/enum/filter'

/**
 * @description 散点接口
 * @author evaseemefly
 * @date 2022/11/12
 * @interface IScatter
 * @template T
 * @template V
 */
interface IScatter<T, V> {
	/**
	 * addPoints
	 */
	loadPoints(): void

	getScatter(): V
}

/** 抽象 台风散点 父类 */
abstract class AbsBaseTyScatter implements IScatter<L.LatLng[], Promise<L.CircleMarker[]>> {
	abstract loadPoints(): Promise<TyRealDataBpMidModel[]>

	getScatter(): Promise<L.CircleMarker[]> {
		const BP_MAX = Math.max(...getBpRange())
		const BP_MIN = Math.min(...getBpRange())
		const scale = chroma.scale(['#2A4858', '#fafa6e']).domain([BP_MIN, BP_MAX])
		const scatterMarker: L.CircleMarker[] = []
		return this.loadPoints().then((res) => {
			// console.log(res)
			// @ts-ignore
			res.forEach((ele) => {
				scatterMarker.push(
					new L.CircleMarker([ele.latlng.lat, ele.latlng.lng], {
						radius: 1,
						color: scale(ele.factor).hex(),
					})
				)
			})
			return scatterMarker
		})
	}
}

abstract class AbsBaseTyHeatmap
	implements IScatter<L.LatLng[], Promise<{ lat: number; lng: number; count: number }[]>>
{
	abstract loadPoints(): Promise<TyRealDataBpMidModel[]>

	/**
	 * @description 获取散点集合
	 * @author evaseemefly
	 * @date 2022/11/29
	 * @returns {*}  {Promise<{ lat: number; lng: number; count: number }[]>}
	 * @memberof AbsBaseTyHeatmap
	 */
	getScatter(): Promise<{ lat: number; lng: number; count: number }[]> {
		// const scatterColor = '#3388ff'
		const heatList: { lat: number; lng: number; count: number }[] = []

		return this.loadPoints().then((res) => {
			// console.log(res)
			// @ts-ignore
			res.forEach((ele) => {
				heatList.push({
					lat: ele.latlng.lat,
					lng: ele.latlng.lng,
					count: ele.factor,
				})
			})
			return heatList
		})
	}
}

/** 根据半径过滤的台风散点实现类 */
class TyRadiusScatter extends AbsBaseTyScatter {
	/**
	 * @description 台风编号(四位英文)
	 * @author evaseemefly
	 * @date 2022/11/12
	 * @private
	 * @type {string}
	 * @memberof TyRadiusScatter
	 */
	private tyNum: string

	/**
	 * @description 中心位置
	 * @author evaseemefly
	 * @date 2022/11/12
	 * @private
	 * @type {L.LatLng[]}
	 * @memberof TyRadiusScatter
	 */
	private center: L.LatLng

	/**
	 * @description 检索半径范围
	 * @author evaseemefly
	 * @date 2022/11/12
	 * @private
	 * @type {number}
	 * @memberof TyRadiusScatter
	 */
	private radius: number

	constructor(center: L.LatLng, radius: number) {
		super()
		// this.tyNum = tyNum
		this.radius = radius
		this.center = center
	}

	loadPoints(): Promise<TyRealDataBpMidModel[]> {
		// const tyScatters: L.LatLng[] = []
		const bpList: TyRealDataBpMidModel[] = []
		return loadTyScattersByRadius({
			latlon: [this.center.lat, this.center.lng],
			range: this.radius,
		}).then(
			(
				res: IHttpResponse<
					{
						num: number
						list_ty_geo: {
							code: string
							date: Date
							num: string
							bp: number
							wsm: number
							level: number
							latlon: {
								coordinates: number[]
							}
						}[]
					}[]
				>
			) => {
				if (res.status === 200) {
					res.data.forEach((tempTy) => {
						tempTy.list_ty_geo.forEach((tempPoint) => {
							// tyScatters.push(
							// 	L.latLng(
							// 		tempPoint.latlon.coordinates[1],
							// 		tempPoint.latlon.coordinates[0]
							// 	)
							// )
							bpList.push(
								new TyRealDataBpMidModel(
									L.latLng(
										tempPoint.latlon.coordinates[1],
										tempPoint.latlon.coordinates[0]
									),
									tempPoint.bp
								)
							)
						})
					})
				}
				return bpList
			}
		)
		// .finally(() => {
		// 	console.log(tyScatters[0])
		// 	return tyScatters
		// })
		// throw new Error('Method not implemented.')
	}
}

/** 根据唯一性条件过滤的 台风散点实现类 */
class TyUniqueFilterScatter extends AbsBaseTyScatter {
	/** 唯一性过滤类型 */
	uniqueFilterType: FilterTypeEnum = FilterTypeEnum.NULL
	/** 过滤年份 */
	year = ''
	/** 过滤月份 */
	month = ''
	tyNum = ''

	constructor(filterType: FilterTypeEnum, year = '', month = '', tyNum = '') {
		super()
		this.year = year
		this.month = month
		this.tyNum = tyNum
		this.uniqueFilterType = filterType
	}

	loadPoints(): Promise<TyRealDataBpMidModel[]> {
		const bpList: TyRealDataBpMidModel[] = []
		const self = this
		return loadTyScatterByComplex({
			filterType: self.uniqueFilterType,
			year: self.year,
			month: self.month,
			tyNum: self.tyNum,
		}).then(
			(
				res: IHttpResponse<
					{
						num: number
						list_ty_geo: {
							code: string
							date: Date
							num: string
							bp: number
							wsm: number
							level: number
							latlon: {
								coordinates: number[]
							}
						}[]
					}[]
				>
			) => {
				if (res.status === 200) {
					res.data.forEach((tempTy) => {
						tempTy.list_ty_geo.forEach((tempPoint) => {
							bpList.push(
								new TyRealDataBpMidModel(
									L.latLng(
										tempPoint.latlon.coordinates[1],
										tempPoint.latlon.coordinates[0]
									),
									tempPoint.bp
								)
							)
						})
					})
				}
				// console.log(res.data)
				return bpList
			}
		)
	}
}

class TyRadiusHeatMap
	implements IScatter<L.LatLng[], Promise<{ lat: number; lng: number; count: number }[]>>
{
	/**
	 * @description 台风编号(四位英文)
	 * @author evaseemefly
	 * @date 2022/11/12
	 * @private
	 * @type {string}
	 * @memberof TyRadiusScatter
	 */
	private tyNum: string

	/**
	 * @description 中心位置
	 * @author evaseemefly
	 * @date 2022/11/12
	 * @private
	 * @type {L.LatLng[]}
	 * @memberof TyRadiusScatter
	 */
	private center: L.LatLng

	/**
	 * @description 检索半径范围
	 * @author evaseemefly
	 * @date 2022/11/12
	 * @private
	 * @type {number}
	 * @memberof TyRadiusScatter
	 */
	private radius: number
	constructor(center: L.LatLng, radius: number) {
		// this.tyNum = tyNum
		this.radius = radius
		this.center = center
	}

	/**
	 * @description 根据 this.center 与 this.radius 加载该范围内的所有台风 bp mid model
	 * @author evaseemefly
	 * @date 2022/11/15
	 * @returns {*}  {Promise<TyRealDataBpMidModel[]>}
	 * @memberof TyRadiusHeatMap
	 */
	loadPoints(): Promise<TyRealDataBpMidModel[]> {
		const tyScatters: L.LatLng[] = []
		const bpList: TyRealDataBpMidModel[] = []
		return loadTyScattersByRadius({
			latlon: [this.center.lat, this.center.lng],
			range: this.radius,
		}).then(
			(
				res: IHttpResponse<
					{
						num: number
						list_ty_geo: {
							code: string
							date: Date
							num: string
							bp: number
							wsm: number
							level: number
							latlon: {
								coordinates: number[]
							}
						}[]
					}[]
				>
			) => {
				if (res.status === 200) {
					res.data.forEach((tempTy) => {
						tempTy.list_ty_geo.forEach((tempPoint) => {
							// tyScatters.push(
							// 	L.latLng(
							// 		tempPoint.latlon.coordinates[1],
							// 		tempPoint.latlon.coordinates[0]
							// 	)
							// )
							bpList.push(
								new TyRealDataBpMidModel(
									L.latLng(
										tempPoint.latlon.coordinates[1],
										tempPoint.latlon.coordinates[0]
									),
									tempPoint.bp
								)
							)
						})
					})
				}
				return bpList
			}
		)
	}

	/**
	 * @description 获取 热图的 散点
	 * @author evaseemefly
	 * @date 2022/11/15
	 * @returns {*}  {Promise<{ lat: number; lng: number; count: number }[]>}
	 * @memberof TyRadiusHeatMap
	 */
	getScatter(): Promise<{ lat: number; lng: number; count: number }[]> {
		// const scatterColor = '#3388ff'
		const heatList: { lat: number; lng: number; count: number }[] = []

		return this.loadPoints().then((res) => {
			// console.log(res)
			// @ts-ignore
			res.forEach((ele) => {
				heatList.push({
					lat: ele.latlng.lat,
					lng: ele.latlng.lng,
					count: ele.factor,
				})
			})
			return heatList
		})
	}
}

class TyUniquerFilterHeatMap extends AbsBaseTyHeatmap {
	/** 唯一性过滤类型 */
	uniqueFilterType: FilterTypeEnum = FilterTypeEnum.NULL
	/** 过滤年份 */
	year = ''
	/** 过滤月份 */
	month = ''

	constructor(filterType: FilterTypeEnum, year = '', month = '') {
		super()
		this.year = year
		this.month = month
		this.uniqueFilterType = filterType
	}

	loadPoints(): Promise<TyRealDataBpMidModel[]> {
		const bpList: TyRealDataBpMidModel[] = []
		const self = this
		return loadTyScatterByComplex({
			filterType: self.uniqueFilterType,
			year: self.year,
			month: self.month,
		}).then(
			(
				res: IHttpResponse<
					{
						num: number
						list_ty_geo: {
							code: string
							date: Date
							num: string
							bp: number
							wsm: number
							level: number
							latlon: {
								coordinates: number[]
							}
						}[]
					}[]
				>
			) => {
				if (res.status === 200) {
					res.data.forEach((tempTy) => {
						tempTy.list_ty_geo.forEach((tempPoint) => {
							bpList.push(
								new TyRealDataBpMidModel(
									L.latLng(
										tempPoint.latlon.coordinates[1],
										tempPoint.latlon.coordinates[0]
									),
									tempPoint.bp
								)
							)
						})
					})
				}
				return bpList
			}
		)
	}
}

export {
	TyRadiusScatter,
	TyRadiusHeatMap,
	TyUniqueFilterScatter,
	TyUniquerFilterHeatMap,
	AbsBaseTyScatter,
	AbsBaseTyHeatmap,
}
