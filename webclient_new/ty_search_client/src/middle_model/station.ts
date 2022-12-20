import { formatPadRightstr, formatDate2YMD, formatDate2HM } from '@/util/filter'
import { IToHtml } from '@/interface/leaflet_icon'

class IconFormDefaultMidModel implements IToHtml {
	toHtml(): string {
		throw new Error('Method not implemented.')
	}
	getClassName(): string {
		throw new Error('Method not implemented.')
	}
	getStationCode(): string {
		return ''
	}
}

/**
 * + 22-01-05 潮位站的 mid model
 *
 * @class StationSurgeMiModel
 */
class StationSurgeMiModel {
	stationName: string
	stationCode: string
	/**
	 *最大值
	 *
	 * @type {number}
	 * @memberof StationSurgeMiModel
	 */
	max: number

	/**
	 *最小值
	 *
	 * @type {number}
	 * @memberof StationSurgeMiModel
	 */
	min: number
	/**
	 *当前潮位值
	 *
	 * @type {number}
	 * @memberof StationSurgeMiModel
	 */
	surge: number

	/**
	 *预报时间(utc)
	 *
	 * @type {Date}
	 * @memberof StationSurgeMiModel
	 */
	forecastDt: Date
	lat: number
	lon: number

	/**
	 * Creates an instance of StationSurgeMiModel.
	 * @param {string} stationName
	 * @param {string} stationCode
	 * @param {number} surge 当前潮位值
	 * @param {number} max 最大值
	 * @param {number} min 最小值
	 * @param {Date} forecastDt 预报时间(utc)
	 * @param {{}} [options]
	 * @memberof StationSurgeMiModel
	 */
	constructor(
		stationName: string,
		stationCode: string,
		surge: number,
		max: number,
		min: number,
		forecastDt: Date,
		lat: number,
		lon: number,
		options?: any
	) {
		this.stationName = stationName
		this.stationCode = stationCode
		this.max = max
		this.min = min
		this.surge = surge
		this.forecastDt = forecastDt
		this.lat = lat
		this.lon = lon
	}
}
/**
 * 潮位 详细 form icon
 * 继承自 IToHtml
 *
 * @class IconFormStationDetialedMidModel
 * @implements {IToHtml}
 */
class IconFormStationDetialedMidModel implements IToHtml {
	stationName: string
	stationCode: string
	max: number
	min: number
	surge: number
	constructor(stationName: string, stationCode: string, surge: number, max: number, min: number) {
		this.stationName = stationName
		this.stationCode = stationCode
		this.max = max
		this.min = min
		this.surge = surge
	}
	get getSurgeMinStr(): string {
		return this.min !== undefined ? this.min.toString() : '-'
	}
	toHtml(): string {
		const divHtml = `<div id="my_station_surge_div">
        <div class="station-min-div-title">${this.stationName}</div>
        <div class="station-min-div-content">
          <div class="station-min-div-content-horizontal">
            <div class="station-min-div-content-field liner-cell-default">增水</div>
            <div class="station-min-div-content-val ${this.getAlarmColor(this.surge)}">${
			this.surge
		}</div>
          </div>
          <div class="station-min-div-content-horizontal">
            <div class="station-min-div-content-field ${this.getAlarmColor(this.max)}">${
			this.max
		}</div>
            <div class="station-min-div-content-val ${this.getAlarmColor(this.min)}">${
			this.getSurgeMinStr
		}</div>
          </div>
        </div>
      </div>`
		return divHtml
	}
	getClassName(): string {
		return 'station-surge-icon-default'
	}
	getStationCode(): string {
		return this.stationCode
	}

	private getAlarmColor(val: number): string {
		const surge = val
		let colorStr = ''
		switch (true) {
			case surge <= 100:
				colorStr = 'green'
				break
			case surge <= 150:
				colorStr = 'blue'
				break
			case surge <= 200:
				colorStr = 'yellow'
				break
			case surge <= 250:
				colorStr = 'orange'
				break
			case surge > 250:
				colorStr = 'red'
				break
			default:
				break
		}
		return colorStr
	}
}

class IconFormMinStationSurgeMidModel implements IToHtml {
	stationName: string
	stationCode: string
	surge: number
	productTypeStr: string
	constructor(stationName: string, stationCode: string, surge: number, productTypeStr = '潮位') {
		this.stationName = stationName
		this.stationCode = stationCode
		this.surge = surge
		this.productTypeStr = productTypeStr
	}
	toHtml(): string {
		const divHtml = `<div class="my-station-surge-div">
        <div class="station-min-div-title">${this.stationName}</div>
        <div class="station-min-div-content liner-default ">${this.productTypeStr}</div>
        <div class="station-min-div-content ${this.getAlarmColor()}">${this.surge}</div>
      </div>`
		return divHtml
	}
	getClassName(): string {
		return 'station-surge-icon-default'
	}
	getStationCode(): string {
		return this.stationCode
	}

	/**
	 * 统一为风暴潮强度5色等级
	 *
	 * @private
	 * @return {*}  {string}
	 * @memberof IconFormMinStationSurgeMidModel
	 */
	private getAlarmColor(): string {
		const surge = this.surge
		let colorStr = 'green'
		switch (true) {
			case surge <= 100:
				colorStr = 'green'
				break
			case surge <= 150:
				colorStr = 'blue'
				break
			case surge <= 200:
				colorStr = 'yellow'
				break
			case surge <= 250:
				colorStr = 'orange'
				break
			case surge > 250:
				colorStr = 'red'
				break
		}
		return colorStr
	}
}

/**
 * + 21-06-03
 * 潮位站 station form
 * 只包含标题
 * 历史台风查询加载的 station title 使用此实现类
 *
 * @class IconFormTitleStationSurgeMidModel
 * @implements {IToHtml}
 */
class IconFormTitleStationSurgeMidModel implements IToHtml {
	stationName: string
	stationCode: string
	surge: number
	productTypeStr: string
	isChecked: boolean
	constructor(
		stationName: string,
		stationCode: string,
		surge: number,
		productTypeStr = '潮位',
		isChecked = false
	) {
		this.stationName = stationName
		this.stationCode = stationCode
		this.surge = surge
		this.productTypeStr = productTypeStr
		this.isChecked = isChecked
	}
	toHtml(): string {
		const divHtml = `<div class="my-station-title-surge-div">
        <div class="station-title-div-title">${this.stationName}</div>
		<div class="station-title-div-font font-shadow font-${this.getAlarmColor()}">${
			this.surge !== 0 ? this.surge : '-'
		}</div>
        </div>`
		return divHtml
	}

	/**
	 * @description 获取 class 字符串
	 * @author evaseemefly
	 * @date 2022/07/26
	 * @returns {*}  {string}
	 * @memberof IconFormTitleStationSurgeMidModel
	 */
	getClassName(): string {
		return `station-surge-icon-onlytitle `
	}
	getStationCode(): string {
		return this.stationCode
	}
	private getAlarmColor(): string {
		const surge = this.surge
		let colorStr = 'green'
		switch (true) {
			case surge <= 0:
				colorStr = 'default'
				break
			case surge <= 100:
				colorStr = 'green'
				break
			case surge <= 150:
				colorStr = 'blue'
				break
			case surge <= 200:
				colorStr = 'yellow'
				break
			case surge <= 250:
				colorStr = 'orange'
				break
			case surge > 250:
				colorStr = 'red'
				break
		}
		return colorStr
	}

	/**
	 * @description 获取全部动态 class string
	 * @author evaseemefly
	 * @date 2022/07/26
	 * @param {boolean} [isChecked=false]
	 * @returns {*}  {string}
	 * @memberof IconFormTitleStationSurgeMidModel
	 */
	allCls(isChecked = false): string {
		// let clsStr=''
		const checkedCls = this.getCheckedCls(isChecked)
		const clsStr = `${checkedCls}`
		return clsStr
	}

	/**
	 * @description 根据是否选中添加 checked cls
	 * @author evaseemefly
	 * @date 2022/07/26
	 * @private
	 * @param {boolean} [isChecked=false]
	 * @returns {*}  {string}
	 * @memberof IconFormTitleStationSurgeMidModel
	 */
	private getCheckedCls(isChecked = false): string {
		return isChecked ? 'checked' : ''
	}
}

/** + 22-09-14 海洋站潮位集群 mid model */
class SurgeStationGroupMidModel {
	/** 海洋站name */
	stationName: string
	/** code */
	stationCode: string
	id?: number

	/** 潮位集合 */
	surgeList: {
		/** 预报时间 */
		forecastDt: Date
		/** 潮位值——默认为非85基面的surge，若转换为85，需要surge-d85*/
		surge: number
	}[] = []
	/** 四色警戒潮位，有些站位不包含警戒潮位，或警戒潮位不全(辽宁海洋站) */
	alertColor: {
		blue?: number
		yellow?: number
		orange?: number
		red?: number
	}
	d85: number

	constructor(
		name: string,
		code: string,

		d85: number,
		surgeList: {
			forecastDt: Date
			surge: number
		}[],
		alertColor: {
			blue?: number
			yellow?: number
			orange?: number
			red?: number
		}
	) {
		this.stationName = name
		this.stationCode = code
		this.d85 = d85
		this.surgeList = surgeList
		this.alertColor = { ...alertColor }
	}

	/**
	 * @description 生成要存储的 txt content
	 * @author evaseemefly
	 * @date 2022/09/15
	 * @returns {*}  {string}
	 * @memberof SurgeStationGroupMidModel
	 */
	toTxt(): string {
		const self = this
		let content = `海洋站名称:${self.stationName} | 四色警戒潮位:${self.getAlertSurge(
			self.alertColor.blue
		)} ${self.getAlertSurge(self.alertColor.yellow)} ${self.getAlertSurge(
			self.alertColor.orange
		)} ${self.getAlertSurge(self.alertColor.red)}\n`
		content = content.concat(
			`${formatPadRightstr('date', 15)}${formatPadRightstr('time', 10)}${formatPadRightstr(
				'high tide',
				15
			)}${formatPadRightstr('blue', 10)}${formatPadRightstr('yellow', 10)}${formatPadRightstr(
				'orange',
				10
			)}${formatPadRightstr('red', 10)}\n`
		)

		const surgeStrList = []
		self.surgeList.forEach((temp) => {
			// const surgeContent = `${fortmatData2YMDHM(temp.forecastDt)} :潮位 ${
			// 	temp.surge
			// } | 距蓝:${self.alertColor.blue ? self.alertColor.blue - temp.surge : '-'}| 距黄:${
			// 	self.alertColor.yellow ? self.alertColor.yellow - temp.surge : '-'
			// }| 距橙:${self.alertColor.orange ? self.alertColor.orange - temp.surge : '-'}| 距红:${
			// 	self.alertColor.red ? self.alertColor.red - temp.surge : '-'
			// }`
			// 2022-09-14T19:51:00Z : 303
			// 2022-09-15T08:43:00Z : 314
			// 2022-09-15T20:09:00Z : 300
			// 2022-09-16T09:28:00Z : 306
			const surgeContent = `${formatPadRightstr(
				formatDate2YMD(temp.forecastDt),
				15
			)}${formatPadRightstr(formatDate2HM(temp.forecastDt), 10)}${formatPadRightstr(
				temp.surge.toString(),
				15
			)}${formatPadRightstr(
				self.alertColor.blue ? (self.alertColor.blue - temp.surge).toString() : '-',
				10
			)}${formatPadRightstr(
				self.alertColor.yellow ? (self.alertColor.yellow - temp.surge).toString() : '-',
				10
			)}${formatPadRightstr(
				self.alertColor.orange ? (self.alertColor.orange - temp.surge).toString() : '-',
				10
			)}${formatPadRightstr(
				self.alertColor.red ? (self.alertColor.red - temp.surge).toString() : '-',
				10
			)}`
			surgeStrList.push(surgeContent)
		})
		const appendContent = surgeStrList
			.map((temp) => {
				return temp
			})
			.join('\n')
		content = content.concat(appendContent)
		content = content.concat('\n')
		content = content.concat(
			'--------------------------------------------------------------------------------'
		)
		content = content.concat('\n')
		return content
	}

	getAlertSurge(val: null | undefined | number): string {
		const content = val === null || val === undefined ? '-' : val.toString()
		return content
	}
}

/**
 * @description 潮位站 (重命名，原名称为StationSurge)
 * @author evaseemefly
 * @date 2022/10/23
 * @class StationSurgeMidModel
 */
class StationSurgeMidModel {
	tyCode: string
	timeStampStr: string
	forecastDt: Date
	stationName: string
	stationCode: string
	// stationIcons: IconFormStationDetialedMidModel[] = []

	constructor(
		stationName: string,
		stationCode: string,
		tyCode: string,
		timeStampStr: string,
		forecastDt: Date
	) {
		this.stationName = stationName
		this.stationCode = stationCode
		this.tyCode = tyCode
		this.timeStampStr = timeStampStr
		this.forecastDt = forecastDt
	}

	/**
	 * 根据传入的 zoom 返回对应的 icon 实现类
	 *
	 * @param {number} zoom
	 * @memberof StationSurge
	 */
	private getStationIconImplements(
		zoom: number,
		options: {
			stationName: string
			stationCode: string
			surgeMax?: number
			surgeMin?: number
			surgeVal: number
			isChecked?: boolean
		}
	): IToHtml {
		// const stationIcons: IconFormStationDetialedMidModel[] = []
		// 若放大的倍数大于五，则返回 详细的 station icon
		let iToHtml = new IconFormDefaultMidModel()
		const that = this
		if (zoom > 10) {
			iToHtml = new IconFormStationDetialedMidModel(
				options.stationName,
				options.stationCode,
				options.surgeVal,
				options.surgeMax,
				options.surgeMin
			)
		} else if (zoom === 10) {
			iToHtml = new IconFormMinStationSurgeMidModel(
				that.stationName,
				that.stationCode,
				options.surgeVal
			)
		} else {
			// zoom <10
			iToHtml = new IconFormTitleStationSurgeMidModel(
				that.stationName,
				that.stationCode,
				options.surgeVal
			)
		}
		return iToHtml
	}

	getImplements(
		zoom: number,
		options: {
			stationName: string
			stationCode: string
			surgeMax: number
			surgeMin: number
			surgeVal: number
		}
	): IToHtml {
		return this.getStationIconImplements(zoom, options)
	}
}

export {
	IconFormStationDetialedMidModel,
	IconFormDefaultMidModel,
	IconFormMinStationSurgeMidModel,
	IconFormTitleStationSurgeMidModel,
	StationSurgeMiModel,
	SurgeStationGroupMidModel,
	StationSurgeMidModel,
}
