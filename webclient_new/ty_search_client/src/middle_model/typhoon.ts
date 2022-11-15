import * as L from 'leaflet'
import moment from 'moment'
import { convertBp2HeatMapFactor } from './util'

/**
 * @description 过滤台风 mid model
 * @author evaseemefly
 * @date 2022/10/19
 * @class FilterTyMidModel
 */
class FilterTyMidModel {
	code: string
	name: string
	tyNum: string
	year: number
	constructor(code: string, name: string, tyNum: string, year: number) {
		this.code = code
		this.name = name
		this.tyNum = tyNum
		this.year = year
	}
}

/**
 * @description 台风实时路径
 * @author evaseemefly
 * @date 2022/10/19
 * @class TyRealDataMongoMidModel
 */
class TyRealDataMongoMidModel {
	code: string
	/** 2011-09-23T06:00:00Z utc 时间*/
	dateStr: string
	tyNum: string
	bp: number
	wsm: number
	latlng: L.LatLng
	constructor(
		code: string,
		dateStr: string,
		tyNum: string,
		bp: number,
		wsm: number,
		latlng: L.LatLng
	) {
		this.code = code
		this.dateStr = dateStr
		this.tyNum = tyNum
		this.bp = bp
		this.wsm = wsm
		this.latlng = latlng
	}

	/** 当前路径的时间(utc) */
	get forecastDt(): Date {
		const dt: Date = moment(this.dateStr).toDate()
		return dt
	}
}

/**
 * @description 为热图使用的台风位置及对应的因子(气压)
 * @author evaseemefly
 * @date 2022/11/15
 * @class TyRealDataHeatmapFactorMidModel
 */
class TyRealDataBpMidModel {
	latlng: L.LatLng
	// factor: number
	bp: number
	constructor(latlng: L.LatLng, bp: number) {
		this.latlng = latlng
		this.bp = bp
	}

	/**
	 * @description 热图因子
	 * @author evaseemefly
	 * @date 2022/11/15
	 * @readonly
	 * @type {number}
	 * @memberof TyRealDataBpMidModel
	 */
	get factor(): number {
		return convertBp2HeatMapFactor(this.bp)
	}
}

export { FilterTyMidModel, TyRealDataMongoMidModel, TyRealDataBpMidModel }
