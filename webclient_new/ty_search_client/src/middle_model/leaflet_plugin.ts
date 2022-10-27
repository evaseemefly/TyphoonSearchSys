//
import * as L from 'leaflet'
// TODO:[-] 22-04-13 加入多颜色线段
// https://github.com/Oliv/leaflet-polycolor
import leafletPolycolor from 'leaflet-polycolor'
leafletPolycolor(L)
// 插件类
import { CanvasMarkerLayer } from '@/plugins/canvasMarkerLayer'
import { getTyPathLineColor } from '@/plugins/scaleColor'
// 接口类
import { ITyPath } from '@/interface/typhoon'
// 其他 mid model
import { getTyIconUrlByType } from '@/middle_model/icon'

import fecha from 'fecha'

const DEFAULT_RADIUS = 1

/**
 * + 21-04-20 台风圆 状态
 *
 * @class TyphoonCircleStatus
 */
class TyphoonCircleStatus {
	// color_enum=Color
	// 最大风速
	radius = DEFAULT_RADIUS
	// + 21-10-08 有效数字保留的位数
	EFFECTIVE_UNIT = 3
	// 气压
	bp: number
	forecastDt: Date
	lat: number
	lon: number

	constructor(radius: number, bp: number, forecastDt: Date, lat: number, lon: number) {
		this.radius = radius
		this.bp = bp
		this.forecastDt = forecastDt
		this.lat = lat
		this.lon = lon
	}

	public get latFiltered(): number | string {
		let filteredVal: number | string = ''
		if (this.lat) {
			filteredVal = parseFloat(this.lat.toFixed(this.EFFECTIVE_UNIT))
		}
		return filteredVal
	}

	public get lonFiltered(): number | string {
		let filteredVal: number | string = ''
		if (this.lon) {
			filteredVal = parseFloat(this.lon.toFixed(this.EFFECTIVE_UNIT))
		}
		return filteredVal
	}

	public get bpFiltered(): number | string {
		let filteredVal: number | string = ''
		if (this.bp) {
			filteredVal = parseFloat(this.bp.toFixed(this.EFFECTIVE_UNIT))
		}
		return filteredVal
	}
	public get radiusFiltered(): number | string {
		let filteredVal: number | string = ''
		if (this.radius) {
			filteredVal = parseFloat(this.radius.toFixed(this.EFFECTIVE_UNIT))
		}
		return filteredVal
	}

	//获取颜色（string）
	getColor(): string {
		let colorStr = 'blue'
		const val = this.radius
		if (val <= 2) {
			// return color_str
		} else if (val < 4) {
			colorStr = 'yellow'
			// return color_str
		} else if (val < 6) {
			colorStr = 'red'
		}
		return colorStr
	}

	/**
	 * 获取圆圈的半径
	 *  + 21-05-07 加入一个系数，因为之前的圆圈的半径不够大
	 *
	 * @return {*}  {number}
	 * @memberof TyphoonCircleStatus
	 */
	getWeight(): number {
		let weight = 2
		const coeff = 1.25
		const val = this.radius
		if (val <= 30) {
			weight = 2
		} else if (val < 40) {
			weight = 3
		} else if (val < 60) {
			weight = 4
		} else if (val < 100) {
			weight = 5
		} else {
			weight = 6
		}
		return weight * weight
	}

	toDivIconHtml(): string {
		const that = this

		const htmlStr = `
    <div class='typhoon_data_div mb-4 col-md-4 box-shadow'>
				<div class='card-header'>台风数据</div>
				<div class='card-body'>
					<div class='row'>
						<div class='col-md-4'>时间</div>
						<div class='col-md-8'>${fecha.format(new Date(that.forecastDt), 'YYYY-MM-DD HH:mm')}</div>
					</div>
					<div class='row'>
						<div class='col-md-4'>中心位置</div>
						<div class='col-md-8'>${that.latFiltered}, ${that.lonFiltered}</div>
					</div>
					
				</div>
				<div class='row_footer'>
                    <div class='columnar'>
                        <div class='subitem_top'>${that.bpFiltered}</div>
                        <div class='subitem_foot'>气压</div>
                    </div>
                    <div class='columnar'>
                        <div class='subitem_top'>${that.radiusFiltered}</div>
                        <div class='subitem_foot'>大风半径</div>
                    </div>
				</div>
			</div>
    `
		return htmlStr
	}
}

class TyCMAPathLine {
	public tyPathList: ITyPath[] = []
	protected myMap: L.Map
	constructor(mymap: L.Map, tyPathList: ITyPath[]) {
		this.tyPathList = tyPathList
		this.myMap = mymap
	}

	add2Map(markerFuncs: {
		onClick: (opt: any) => void
		onMouseOver: (opt: any) => void
		onMouseOut: (opt: any) => void
	}): L.LayerGroup<any> {
		const tyPointsList = this.initCenterPulsingIcon(markerFuncs)
		const tyPolylineRealdata = this.initLineRealdataLayer()
		const tyPolylineForecast = this.initLineForecastLayer()
		return new L.LayerGroup([...tyPointsList, tyPolylineRealdata, tyPolylineForecast]).addTo(
			this.myMap
		)
	}

	add2MapByCanvas(markerFuncs: {
		onClick: (opt: any) => void
		onMouseOver: (opt: any) => void
		onMouseOut: (opt: any) => void
	}): L.LayerGroup<any> {
		const tyPointsList = this.initCenterPulsingIcon(markerFuncs)
		const tyPolylineRealdata = this.initLineRealdataLayer()
		const tyPolylineForecast = this.initLineForecastLayer()
		const canvasMarkerLayer = new CanvasMarkerLayer().addTo(this.myMap)
		canvasMarkerLayer.addLayers(tyPointsList)
		return new L.LayerGroup([tyPolylineRealdata, tyPolylineForecast]).addTo(this.myMap)
	}

	getlastTyLatlng(): L.LatLng | null {
		if (this.tyPathList.length > 0) {
			const lastTy = this.tyPathList[this.tyPathList.length - 1]
			return new L.LatLng(lastTy.lat, lastTy.lon)
		} else {
			return null
		}
	}

	/**
	 * @description 初始化 icon
	 * @author evaseemefly
	 * @date 2022/10/09
	 * @protected
	 * @param {{
	 * 		onClick: (opt: any) => void 鼠标点击回调函数
	 * 		onMouseOver: (opt: any) => void	鼠标移入回调函数
	 * 	}} markerFuncs	marker 相关函数
	 * @returns {*}  {L.Marker[]}
	 * @memberof TyCMAPathLine
	 */
	protected initCenterPulsingIcon(markerFuncs: {
		onClick: (opt: any) => void
		onMouseOver: (opt: any) => void
		onMouseOut: (opt: any) => void
	}): L.Marker[] {
		const tyPointsList: L.Marker[] = []
		this.tyPathList.forEach((tempPath) => {
			const typhoonStatus = new TyphoonCircleStatus(
				0,
				tempPath.bp,
				tempPath.forecastDt,
				tempPath.lat,
				tempPath.lon
			)
			// TODO:[-] 22-03-15 修改为 台风img marker
			const tyCustomIcon = L.icon({
				iconUrl: getTyIconUrlByType(tempPath.tyType),
				iconSize: [40, 40], // size of the icon
				// shadowSize: [50, 64], // size of the shadow
				iconAnchor: [20, 20], // point of the icon which will
				className: 'my-leaflet-custom-icon',
			})
			// TODO:[-] 22-03-17 修改之前的台风中心路径由脉冲mark改为台风标准图片marker，切记需要加入 customData!!
			const tyCustomMarker = L.marker([tempPath.lat, tempPath.lon], {
				icon: tyCustomIcon,
				// @ts-ignore
				customData: typhoonStatus,
				riseOnHover: true,
			})
			// TODO:[*] 22-10-09 对于鼠标移入与点击加入对应的事件
			tyCustomMarker
				.on('click', (e) => {
					markerFuncs.onClick(e)
				})
				.on('mouseover', (e) => {
					markerFuncs.onMouseOver(e)
				})
				.on('mouseout', (e) => {
					markerFuncs.onMouseOut(e)
				})
			tyPointsList.push(tyCustomMarker)
		})
		return tyPointsList
	}
	/**
	 * 实时台风路径
	 *
	 * @protected
	 * @return {*}  {L.Polyline}
	 * @memberof TyCMAPathLine
	 */
	protected initLineRealdataLayer(): any {
		const latLngs: L.LatLng[] = []
		this.tyPathList.forEach((temp) => {
			if (!temp.isForecast) {
				latLngs.push(new L.LatLng(temp.lat, temp.lon))
			}
		})
		// 对于实况需要加入一个循环判断

		//方式1: 此种方式不行
		// const tyTypes: string[] = ['TS', 'STS', 'TY', 'STY', 'SuperTY']
		// const polylines: L.Polyline[] = []
		// tyTypes.forEach((tempTyType) => {
		//     const tempTyTypePathList = this.tyPathList.filter((tempTyPath) => {
		//         return tempTyPath.tyType === tempTyType
		//     })
		//     const tempLatlng: L.LatLng[] = []
		//     tempTyTypePathList.map((temp) => tempLatlng.push(new L.LatLng(temp.lat, temp.lon)))
		//     const tempTyPolyline = new L.Polyline(tempLatlng, {
		//         color: getTyPathLineColor(tempTyType)
		//     })
		//     polylines.push(tempTyPolyline)
		// })
		// ---
		// 方法2:
		/*
            实现思路
            step1: 获取不同的台风等级的所在位置index，以及对应的颜色
        */
		const tyTypes: string[] = ['TS', 'STS', 'TY', 'STY', 'SuperTY']
		const polylines: L.Polyline[] = []
		const latlngs: number[][] = []
		const colorScales: string[] = []
		this.tyPathList.forEach((temp) => {
			if (!temp.isForecast) {
				latlngs.push([temp.lat, temp.lon])
				colorScales.push(getTyPathLineColor(temp.tyType))
			}
		})
		// 此处使用 leaflet-polycolor 实现折线的多颜色(线性过度)
		// latlngs 每个折点的坐标数组;
		// colorScales 每个折点的起止颜色数组
		// eslint-disable-next-line
		// @ts-ignore
		const polyLine = L.polycolor(latlngs, {
			colors: colorScales,
			weight: 5,
		})
		return polyLine
	}

	/**
	 * 预报台风风路径
	 *
	 * @protected
	 * @return {*}  {L.Polyline}
	 * @memberof TyCMAPathLine
	 */
	protected initLineForecastLayer(): L.Polyline {
		const latLngs: L.LatLng[] = []

		const forecastTyIndex: number = this.tyPathList.findIndex((temp) => {
			return temp.isForecast
		})
		if (forecastTyIndex > 0) {
			const lastRealTy = this.tyPathList[forecastTyIndex - 1]
			latLngs.push(new L.LatLng(lastRealTy.lat, lastRealTy.lon))
			this.tyPathList.forEach((temp) => {
				if (temp.isForecast) {
					latLngs.push(new L.LatLng(temp.lat, temp.lon))
				}
			})
		}

		return new L.Polyline(latLngs, { color: '#2980b9', dashArray: '5,10' })
	}
}

export { TyphoonCircleStatus, TyCMAPathLine }
