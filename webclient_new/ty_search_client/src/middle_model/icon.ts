/**
 * 脉冲圆形icon
 *
 * @class IconCirlePulsing
 */

import * as L from 'leaflet'

import { IconTypeEnum } from '@/enum/common'
// 待实现的接口
import { IStationInfo, IStationIcon } from '@/interface/station'
import { IToHtml } from '@/interface/leaflet_icon'
// 中间 model
import { StationSurgeMidModel } from '@/middle_model/station'

interface IIconPlusingOptions {
	val?: number
	min?: number
	max?: number
	radius?: number
	iconType: IconTypeEnum
}

const iconPlusingDefaultOptions = {
	min: 1,
	max: 10,
	radius: 20,
	iconType: IconTypeEnum.TY_PULSING_ICON,
}

/**
 * 实现方式1
 * 功能：根据传入的值，动态调整脉冲边缘的半径以及脉冲圆点的半径大小
 * 具体实现：
 * r=20px
 * math.abs(val-min)/math.abs(max-min) * r
 * @author evaseemefly
 * @class IconCirlePulsing
 */
class IconCirlePulsing {
	// radiusUnit:number=
	// x 与 y 的偏移量
	shiftX = 0
	shiftY = 0
	iconBorder = 3
	/**
	 * 当前 cirle 对应的 surge val
	 *
	 * @type {number}
	 * @memberof IconCirlePulsing
	 */
	val: number
	max: number
	min: number
	radius: number
	config: IIconPlusingOptions
	constructor(options: IIconPlusingOptions) {
		// Object.assign(this, { max: 10, min: 1, radius: 10 }, options)
		this.config = { ...iconPlusingDefaultOptions, ...options }
	}
	toHtml(): string {
		const that = this
		// TODO:[-] 22-05-16 注意此处若为 海洋站静态位置 则 宽高都为 NaN
		// 海洋站icon的宽高
		const iconPulsingWidth = that.getPlusingIconRectangle()[0]
		const iconPulsingHeight = that.getPlusingIconRectangle()[1]
		// icon 的外侧脉冲的宽高
		const iconBorderWidth = that.getPlusingIconBorderRectangle()[0]
		const iconBorderHeight = that.getPlusingIconBorderRectangle()[1]
		// - 22-03-08 注意由于在 /styles/map/my-leaflet.less -> my-leaflet-icon-border 中对box-shadow 设置了3px的阴影宽度，但 box的border是不会向内挤占空间的
		const borderUnit = 3 / 2
		// 第一个div是外侧脉冲,第二个div是内部的icon
		// TODO:[*] 22-03-07 注意此处 my-leaflet-icon-border orange 会有一个 3px的border的距离，但外侧的border是不会影响内部的定位，所以不需要加入对该border边距的计算
		// 最终: 只需要平移 (-r/2,-r/2)
		const divHtml = `<div class="my-leaflet-pulsing-marker" >
              <div class="my-leaflet-icon-border ${this.getAlarmColor()}" style="width: ${iconBorderWidth}px;height:${iconBorderHeight}px;left:${
			-iconBorderWidth / 2
		}px;top:${-iconBorderHeight / 2}px"></div>
              <div class="my-leaflet-pulsing-icon ${this.getAlarmColor()}" style="width: ${iconPulsingWidth}px;height:${iconPulsingHeight}px;left:${
			-iconPulsingWidth / 2
		}px;top:${-iconPulsingHeight / 2}px"></div>
            </div>`
		return divHtml
	}

	/**
	 * 获取当前 surge 在 min - max 的百分位数
	 *
	 * @returns {number}
	 * @memberof IconCirlePulsing
	 */
	getRadius(): number {
		// TODO:[-] 22-05-16 此处存在可能的bug，对于 max 与 min 均为 0的情况 分母可能是0
		const defaultVal = 1
		const val =
			Math.abs(this.config.val - this.config.min) /
			Math.abs(this.config.max - this.config.min)
		return isNaN(val) ? defaultVal : val
	}

	/**
	 * + 21-06-02 获取当前的 surge 的 脉冲icon的绝对半径
	 *
	 * @returns {number}
	 * @memberof IconCirlePulsing
	 */
	getPlusingIconAbsRadius(): number {
		// 半径的最大 px
		const radiusMaxVal = 10
		// 半径的最小 px
		const radiusMinVal = 3
		// 半径最大与最小的差值 px
		const radiusDiffVal = radiusMaxVal - radiusMinVal
		// 半径差值的绝对值
		const radiusDiffAbsVal = radiusDiffVal * this.getRadius()
		return radiusMinVal + radiusDiffAbsVal
	}

	/**
	 * + 21-06-02 获取当前 surge 的 脉冲icon矩形的 width 与 height
	 *
	 * @returns {number[]}
	 * @memberof IconCirlePulsing
	 */
	getPlusingIconRectangle(): number[] {
		const confficient = 1.5
		const width = confficient * (this.getPlusingIconAbsRadius() + this.shiftX)
		const height = confficient * (this.getPlusingIconAbsRadius() + this.shiftY)
		return [width, height]
	}

	getPlusingIconBorderAbsRadius(): number {
		// 半径的最大 px
		const radiusMaxVal = 16
		// 半径的最小 px
		// const radiusMinVal = 10
		const radiusMinVal = 8
		// 半径最大与最小的差值 px
		const radiusDiffVal = radiusMaxVal - radiusMinVal
		// 半径差值的绝对值
		const radiusDiffAbsVal = radiusDiffVal * this.getRadius()
		return radiusMinVal + radiusDiffAbsVal
	}

	getPlusingIconBorderRectangle(): number[] {
		const confficient = 1.5
		const width = confficient * this.getPlusingIconBorderAbsRadius()
		const height = confficient * this.getPlusingIconBorderAbsRadius()
		return [width, height]
	}

	private getAlarmColor(): string {
		// TODO:[-] 21-06-08 此处代码与 middle_model -> stations.ts -> IconFormMinStationSurgeMidModel -> getAlarmColor 重复
		const surge = this.config.val
		let colorStr = 'green'
		if (surge) {
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
		}

		return colorStr
	}
}

/**
 * @description 台风脉冲圆 icon
 * @author evaseemefly
 * @date 2022/10/24
 * @class IconTyphoonCirlePulsing
 */
class IconTyphoonCirlePulsing {
	// radiusUnit:number=
	// x 与 y 的偏移量
	shiftX = 4
	shiftY = 4
	/**
	 * 当前 cirle 对应的 surge val
	 *
	 * @type {number}
	 * @memberof IconCirlePulsing
	 */
	val: number
	max: number
	min: number
	radius: number
	config: IIconPlusingOptions
	constructor(options: IIconPlusingOptions) {
		// Object.assign(this, { max: 10, min: 1, radius: 10 }, options)
		this.config = { ...iconPlusingDefaultOptions, ...options }
	}
	toHtml(): string {
		const that = this
		const iconBorderWidth = that.getPlusingIconRectangle()[0]
		const iconBorderHeight = that.getPlusingIconRectangle()[1]
		const iconPulsingWidth = that.getPlusingIconBorderRectangle()[0]
		const iconPulsingHeight = that.getPlusingIconBorderRectangle()[1]
		let divHtml = ''
		switch (true) {
			case this.config.iconType === IconTypeEnum.TY_PULSING_ICON:
				// - 22-03-07 暂时注释掉台风脉冲信号(带位置偏移)
				// divHtml = `<div class="my-leaflet-pulsing-marker" >
				//     <div class="my-leaflet-icon-border ${this.getAlarmColor()}" style="width: ${iconBorderWidth}px;height:${iconBorderHeight}px;left:${
				//     that.shiftX
				// }px;top:${that.shiftY}px"></div>
				//     <div class="my-leaflet-pulsing-icon ${this.getAlarmColor()}" style="width: ${iconPulsingWidth}px;height:${iconPulsingHeight}px;"></div>
				//   </div>`
				//---
				// TODO:[-] 22-03-07 注意此处的icon div 均需要 left:-width/2;top:-height/2
				divHtml = `<div class="my-leaflet-pulsing-marker" >
                      <div class="my-leaflet-icon-border ${this.getAlarmColor()}" style="width: ${iconBorderWidth}px;height:${iconBorderHeight}px;left:${
					-iconBorderWidth / 2
				}px;top:${-iconBorderHeight / 2}px"></div>
                      <div class="my-leaflet-pulsing-icon ${this.getAlarmColor()}" style="width: ${iconPulsingWidth}px;height:${iconPulsingHeight}px;left:${
					-iconPulsingWidth / 2
				}px;top:${-iconPulsingHeight / 2}px"></div>
                    </div>`
				//---
				//         divHtml = `<div class="my-leaflet-pulsing-marker" >
				//     <div class="my-leaflet-icon-border ${this.getAlarmColor()}" style="width: ${iconBorderWidth}px;height:${iconBorderHeight}px;"></div>
				//     <div class="my-leaflet-pulsing-icon ${this.getAlarmColor()}" style="width: ${iconPulsingWidth}px;height:${iconPulsingHeight}px;"></div>
				//   </div>`
				break
			case this.config.iconType === IconTypeEnum.TY_PATH_ICON:
				// 台风路径示意点
				const cirleUnit = 12
				const cirleRadius = `${cirleUnit}px`
				divHtml = `<div class="my-leaflet-pulsing-marker" >
                  <div class="my-leaflet-icon-border orange}" style="width:${cirleRadius};height:${cirleRadius};left:${
					-cirleUnit / 2
				}px;top:${-cirleUnit / 2}px"></div>
                  <div class="my-leaflet-pulsing-icon orange}" style="width: ${cirleRadius};height:${cirleRadius};left:${
					-cirleUnit / 2
				}px;top:${-cirleUnit / 2}px"></div>
                </div>`
				break
		}

		return divHtml
	}

	/**
	 * 获取当前 surge 在 min - max 的百分位数
	 *
	 * @returns {number}
	 * @memberof IconCirlePulsing
	 */
	getRadius(): number {
		const val =
			Math.abs(this.config.val - this.config.min) /
			Math.abs(this.config.max - this.config.min)
		return val
	}

	/**
	 * + 21-06-02 获取当前的 surge 的 脉冲icon的绝对半径
	 *
	 * @returns {number}
	 * @memberof IconCirlePulsing
	 */
	getPlusingIconAbsRadius(): number {
		// 半径的最大 px
		const radiusMaxVal = 10
		// 半径的最小 px
		const radiusMinVal = 6
		// 半径最大与最小的差值 px
		const radiusDiffVal = radiusMaxVal - radiusMinVal
		// 半径差值的绝对值
		const radiusDiffAbsVal = radiusDiffVal * this.getRadius()
		return radiusMinVal + radiusDiffAbsVal
	}

	/**
	 * + 21-06-02 获取当前 surge 的 脉冲icon矩形的 width 与 height
	 *
	 * @returns {number[]}
	 * @memberof IconCirlePulsing
	 */
	getPlusingIconRectangle(): number[] {
		const confficient = 1.8
		const width = confficient * (this.getPlusingIconAbsRadius() + this.shiftX)
		const height = confficient * (this.getPlusingIconAbsRadius() + this.shiftY)
		return [width, height]
	}

	getPlusingIconBorderAbsRadius(): number {
		// 半径的最大 px
		const radiusMaxVal = 16
		// 半径的最小 px
		// const radiusMinVal = 10
		const radiusMinVal = 8
		// 半径最大与最小的差值 px
		const radiusDiffVal = radiusMaxVal - radiusMinVal
		// 半径差值的绝对值
		const radiusDiffAbsVal = radiusDiffVal * this.getRadius()
		return radiusMinVal + radiusDiffAbsVal
	}

	getPlusingIconBorderRectangle(): number[] {
		const confficient = 1.5
		const width = confficient * this.getPlusingIconBorderAbsRadius()
		const height = confficient * this.getPlusingIconBorderAbsRadius()
		return [width, height]
	}

	private getAlarmColor(): string {
		// TODO:[-] 21-06-08 此处代码与 middle_model -> stations.ts -> IconFormMinStationSurgeMidModel -> getAlarmColor 重复
		const surge = this.config.val
		let colorStr = 'green'
		if (surge) {
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
		}

		return colorStr
	}
}

/**
 * 台风自定义 icon (图片)
 *
 * @class IconTyphoonCustom
 * @extends {IconTyphoonCirlePulsing}
 */
class IconTyphoonCustom extends IconTyphoonCirlePulsing {
	toHtml(): string {
		const that = this
		const iconBorderWidth = that.getPlusingIconRectangle()[0]
		const iconBorderHeight = that.getPlusingIconRectangle()[1]
		const iconPulsingWidth = that.getPlusingIconBorderRectangle()[0]
		const iconPulsingHeight = that.getPlusingIconBorderRectangle()[1]
		let divHtml = ''
		const cirleUnit = 12
		const cirleRadius = `${cirleUnit}px`
		divHtml = `<div class="my-leaflet-pulsing-marker" >
                  <div class="my-leaflet-custom-icon-border orange}" style="width:${cirleRadius};height:${cirleRadius};left:${
			-cirleUnit / 2
		}px;top:${-cirleUnit / 2}px"></div>
                  <div class="my-leaflet-custom-icon orange}" style="width: ${cirleRadius};height:${cirleRadius};left:${
			-cirleUnit / 2
		}px;top:${-cirleUnit / 2}px">
              <img>
              </div>
                </div>`

		return divHtml
	}
}

/**
 * 海洋站精简 icon form 精简信息框
 *
 * @class IconStationSurge
 */
class IconMinStationSurge {
	stationName: string
	surge: number
	productTypeStr: string
	constructor(name: string, surge: number, productTypeStr = '潮位') {
		this.stationName = name
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
 * 潮位站的详细 icon form 详情信息框
 *
 * @class IconDetailedStationSurge
 */
class IconDetailedStationSurge {
	stationName: string
	surge: number
	productTypeStr: string
	surgeMin: number
	surgeMax: number
	constructor(
		name: string,
		surge: number,
		surgeMin: number,
		surgeMax: number,
		productTypeStr = '潮位'
	) {
		this.stationName = name
		this.surge = surge
		this.surgeMin = surgeMin
		this.surgeMax = surgeMax
		this.productTypeStr = productTypeStr
	}
}

/**
 * 根据台风等级获取对应的台风 icon url
 *
 * @param {string} tyType
 * @return {*}
 */
const getTyIconUrlByType = (tyType: string) => {
	let iconUrl = ''
	switch (true) {
		// 热带风暴
		case tyType === 'TS':
			iconUrl = '/static/icons/ty/ty_icon_green.svg'
			break
		// 强热带风暴
		case tyType === 'STS':
			iconUrl = '/static/icons/ty/ty_icon_blue.svg'
			break
		// 台风
		case tyType === 'TY':
			iconUrl = '/static/icons/ty/ty_icon_yellow.svg'
			break
		// 强台风
		case tyType === 'STY':
			iconUrl = '/static/icons/ty/ty_icon_orange.svg'
			break
		// 超强台风
		case tyType === 'SuperTY':
			iconUrl = '/static/icons/ty/ty_icon_red.svg'
			break
		default:
			iconUrl = '/static/icons/ty/ty_icon_green.svg'
			break
	}
	return iconUrl
}

/**
 * @description 根据 海洋站info集合 以 icon 的形式添加至 map,并返回 layergroup ids 集合
 * @author evaseemefly
 * @date 2022/10/23
 * @param {L.Map} mymap
 * @param {IStationInfo[]} stationList
 * @returns {*}  {IStationIcon[]}
 */
const addStationIcon2Map = (
	mymap: L.Map,
	stationList: IStationInfo[],
	surgeMax: number
): number[] => {
	const zoom = 7
	const self = this
	const iconArr: IconCirlePulsing[] = []
	const iconSurgeMinArr: IToHtml[] = []
	const stationArr: StationSurgeMidModel[] = []
	const layerItemsList: IStationIcon[] = []

	const pulsingMarkers: L.Marker[] = []
	const divMarkers: L.Marker[] = []
	// 获取极值
	stationList.forEach((temp) => {
		/** 海洋站 icon */
		const icon = new IconCirlePulsing({
			val: temp.surge,
			max: surgeMax,
			min: 0,
			iconType: IconTypeEnum.TY_PULSING_ICON,
		})
		const tempStationSurge = new StationSurgeMidModel(temp.name, temp.code, '', '', new Date())
		const iconSurgeMin = tempStationSurge.getImplements(zoom, {
			stationName: temp.name,
			stationCode: temp.code,
			surgeMax: surgeMax,
			surgeMin: 0,
			surgeVal: temp.surge,
		})
		iconArr.push(icon)
		iconSurgeMinArr.push(iconSurgeMin)
		stationArr.push(tempStationSurge)
	})
	let index = 0
	// 批量添加至 map 中
	iconArr.forEach((temp) => {
		const tempCode = stationArr[index].stationCode
		const tempStationName = stationArr[index].stationName
		const stationDivIcon = L.divIcon({
			className: `surge_pulsing_icon_default ${iconSurgeMinArr[index].getClassName()}`,
			html: temp.toHtml(),
			// 目前需要此部分，因为会造成 位置的位移
			// 坐标，[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]
			// iconAnchor: [-20, 30]
		})
		iconSurgeMinArr.forEach((temp) => {}) // 2- 台站 station data form icon
		const stationSurgeMinDivICOn = L.divIcon({
			className: iconSurgeMinArr[index].getClassName(),
			html: iconSurgeMinArr[index].toHtml(),
			// 坐标，[相对于原点的水平位置（左加右减），相对原点的垂直位置（上加下减）]
			iconAnchor: [10, 30],
		})

		// TODO:[-] 22-10-23
		const stationCirlePulsingMakrer: L.Marker = L.marker(
			[stationList[index].lat, stationList[index].lon],
			{
				icon: stationDivIcon,
			}
		)
		pulsingMarkers.push(stationCirlePulsingMakrer)

		const stationDivIconMarker: L.Marker = L.marker(
			[stationList[index].lat, stationList[index].lon],
			{
				icon: stationSurgeMinDivICOn,
				// @ts-ignore
				customData: { code: tempCode, name: tempStationName },
				riseOnHover: true, // 鼠标移入zindex升级
			}
		).on(
			'click',
			(e: {
				target: {
					options: {
						customData: { code: string; name: string }
					}
				}
			}) => {
				// self.$message(
				// 	`加载站点:${
				// 		e.target &&
				// 		e.target.options &&
				// 		e.target.options.customData &&
				// 		e.target.options.customData.name
				// 	}`
				// )
				// self.setCurrentStationCode(
				// 	e.target &&
				// 		e.target.options &&
				// 		e.target.options.customData &&
				// 		e.target.options.customData.code
				// )
				// self.setCurrentStationName(
				// 	e.target &&
				// 		e.target.options &&
				// 		e.target.options.customData &&
				// 		e.target.options.customData.name
				// )
			}
		)

		divMarkers.push(stationDivIconMarker)
		// const layerItem: IStationIcon = {
		// 	cirlePulsingId: stationCirlePulsingLayerId,
		// 	divIconId: stationDivIconLayerId,
		// 	code: tempCode,
		// 	name: tempStationName,
		// }
		// layerItemsList.push(layerItem)
		index++
	})
	// @ts-ignore
	const pulsingLayerGroupId: number = L.layerGroup(pulsingMarkers).addTo(mymap)._leaflet_id
	// @ts-ignore
	const divLayerGroupId: number = L.layerGroup(divMarkers).addTo(mymap)._leaflet_id
	return [pulsingLayerGroupId, divLayerGroupId]
}

export {
	IconCirlePulsing,
	IconMinStationSurge,
	IconDetailedStationSurge,
	IconTyphoonCirlePulsing,
	IconTyphoonCustom,
	getTyIconUrlByType,
	addStationIcon2Map,
}
