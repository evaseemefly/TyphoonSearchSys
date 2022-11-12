/**
 * + 22-11-12 加入了各类散点图
 */

import { loadTyScattersByRadius } from '@/api/typhoon'
import { IHttpResponse } from '@/interface/common'

import * as L from 'leaflet'

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

class TyRadiusScatter implements IScatter<L.LatLng[], Promise<L.CircleMarker[]>> {
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

	loadPoints(): Promise<L.LatLng[]> {
		const tyScatters: L.LatLng[] = []
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
							tyScatters.push(
								L.latLng(
									tempPoint.latlon.coordinates[1],
									tempPoint.latlon.coordinates[0]
								)
							)
						})
					})
				}
				return tyScatters
			}
		)
		// .finally(() => {
		// 	console.log(tyScatters[0])
		// 	return tyScatters
		// })
		// throw new Error('Method not implemented.')
	}
	getScatter(): Promise<L.CircleMarker[]> {
		const scatterColor = '#3388ff'
		const scatterMarker: L.CircleMarker[] = []
		return this.loadPoints().then((res) => {
			// console.log(res)
			// @ts-ignore
			res.forEach((ele) => {
				scatterMarker.push(
					new L.CircleMarker([ele.lat, ele.lng], {
						radius: 1,
						color: scatterColor,
					})
				)
			})
			return scatterMarker
		})
		// return scatterMarker
		// throw new Error('Method not implemented.')
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
	loadPoints(): Promise<L.LatLng[]> {
		const tyScatters: L.LatLng[] = []
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
							tyScatters.push(
								L.latLng(
									tempPoint.latlon.coordinates[1],
									tempPoint.latlon.coordinates[0]
								)
							)
						})
					})
				}
				return tyScatters
			}
		)
	}

	getScatter(): Promise<{ lat: number; lng: number; count: number }[]> {
		// const scatterColor = '#3388ff'
		const heatList: { lat: number; lng: number; count: number }[] = []
		return this.loadPoints().then((res) => {
			// console.log(res)
			// @ts-ignore
			res.forEach((ele) => {
				heatList.push({
					lat: ele.lat,
					lng: ele.lng,
					count: 2,
				})
			})
			return heatList
		})
	}
}

export { TyRadiusScatter, TyRadiusHeatMap }
