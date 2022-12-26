/* eslint-disable */

// 本插件来自 http://eJuke.github.io/Leaflet.Canvas-Markers

/*
RBush是用于点和矩形的2D 空间索引的高性能JavaScript库。
它基于具有批量插入支持的优化R树数据结构。
空间索引是用于点和矩形的特殊数据结构，它使您可以高效地执行查询，例如“边界框内的所有项目”（例如，比遍历所有项目快数百倍）。
它最常用于地图和数据可视化中。
 git地址:https://github.com/mourner/rbush
 TODO:[*] 22-05-30 测试 该 layer 无法 添加 divIcon 之前可以添加 icon 
          本 canvas layer 只支持 img 类型的marker ,
          参考:https://kael.top/2019/11/18/leaflet-canvas-marker/
*/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Rbush = require('rbush')
// 尝试引入 leaflet
import * as L from 'leaflet'
/* global L */

const CanvasMarkerLayer = (L.Layer ? L.Layer : L.Class).extend({
	// Add event listeners to initialized section.
	initialize: function (options) {
		// @ts-ignore
		L.setOptions(this, options)
		this._onClickListeners = []
		this._onHoverListeners = []
	},

	setOptions: function (options) {
		// @ts-ignore
		L.setOptions(this, options)
		return this.redraw()
	},

	redraw: function () {
		this._redraw(true)
	},

	// Multiple layers at a time for rBush performance
	addMarkers: function (markers) {
		const self = this
		const tmpMark = []
		const tmpLatLng = []

		markers.forEach(function (marker) {
			if (!(marker.options.pane === 'markerPane' && marker.options.icon)) {
				console.error("Layer isn't a marker")
				return
			}

			const latlng = marker.getLatLng()
			// TypeError: Cannot read property 'getBounds' of undefined
			const isDisplaying = self._map.getBounds().contains(latlng)
			if (isDisplaying === true) {
				// console.log('测试使用')
			}
			const s = self._addMarker(marker, latlng, isDisplaying)

			// Only add to Point Lookup if we are on map
			if (isDisplaying === true) {
				tmpMark.push(s[0])
			}

			tmpLatLng.push(s[1])
		})
		// TODO:[*] 20-11-08 + 执行以下 this._context.restore 方法
		// 去掉，无用
		// if (this._context) {
		//     this._context.restore()
		// }
		// TODO:[-] 21-03-26 注意 self._markser 有可能是未定义
		if ('_markers' in self) {
			self._markers.load(tmpMark)
			self._latlngMarkers.load(tmpLatLng)
		}
	},

	// Adds single layer at a time. Less efficient for rBush
	addMarker: function (marker) {
		const self = this
		const latlng = marker.getLatLng()
		const isDisplaying = self._map.getBounds().contains(latlng)
		const dat = self._addMarker(marker, latlng, isDisplaying)

		// Only add to Point Lookup if we are on map
		if (isDisplaying === true) self._markers.insert(dat[0])

		self._latlngMarkers.insert(dat[1])
	},

	addLayer: function (layer) {
		if (layer.options.pane === 'markerPane' && layer.options.icon) this.addMarker(layer)
		else console.error("Layer isn't a marker")
	},

	addLayers: function (layers) {
		this.addMarkers(layers)
	},

	removeLayer: function (layer) {
		this.removeMarker(layer, true)
	},

	removeMarker: function (marker, redraw) {
		const self = this

		// If we are removed point
		if (marker['minX']) marker = marker.data

		const latlng = marker.getLatLng()
		const isDisplaying = self._map.getBounds().contains(latlng)

		const markerData = {
			minX: latlng.lng,
			minY: latlng.lat,
			maxX: latlng.lng,
			maxY: latlng.lat,
			data: marker,
		}

		self._latlngMarkers.remove(markerData, function (a, b) {
			return a.data._leaflet_id === b.data._leaflet_id
		})

		self._latlngMarkers.total--
		self._latlngMarkers.dirty++

		if (isDisplaying === true && redraw === true) {
			self._redraw(true)
		}
	},

	onAdd: function (map) {
		this._map = map

		if (!this._canvas) this._initCanvas()

		if (this.options.pane) this.getPane().appendChild(this._canvas)
		else map._panes.overlayPane.appendChild(this._canvas)

		map.on('moveend', this._reset, this)
		map.on('resize', this._reset, this)

		map.on('click', this._executeListeners, this)
		map.on('mousemove', this._executeListeners, this)
	},

	onRemove: function (map) {
		if (this.options.pane) this.getPane().removeChild(this._canvas)
		else map.getPanes().overlayPane.removeChild(this._canvas)

		map.off('click', this._executeListeners, this)
		map.off('mousemove', this._executeListeners, this)

		map.off('moveend', this._reset, this)
		map.off('resize', this._reset, this)
	},

	addTo: function (map) {
		map.addLayer(this)
		return this
	},

	clearLayers: function () {
		this._latlngMarkers = null
		this._markers = null
		this._redraw(true)
	},

	_addMarker: function (marker, latlng, isDisplaying) {
		const self = this
		// Needed for pop-up & tooltip to work.
		marker._map = self._map

		// _markers contains Points of markers currently displaying on map
		// 相当于创建了一个 矩形
		// TODO:[*] 20-11-08 Rbush 是干什么用的
		if (!self._markers) self._markers = new Rbush()

		// _latlngMarkers contains Lat\Long coordinates of all markers in layer.
		if (!self._latlngMarkers) {
			self._latlngMarkers = new Rbush()
			self._latlngMarkers.dirty = 0
			self._latlngMarkers.total = 0
		}

		L.Util.stamp(marker)

		// Point {x: 429, y: 743.013669264406}
		const pointPos = self._map.latLngToContainerPoint(latlng)
		// [20, 18]
		const iconSize = marker.options.icon.options.iconSize

		const adjX = iconSize[0] / 2
		const adjY = iconSize[1] / 2
		const ret = [
			{
				minX: pointPos.x - adjX,
				minY: pointPos.y - adjY,
				maxX: pointPos.x + adjX,
				maxY: pointPos.y + adjY,
				data: marker,
			},
			{
				minX: latlng.lng,
				minY: latlng.lat,
				maxX: latlng.lng,
				maxY: latlng.lat,
				data: marker,
			},
		]

		self._latlngMarkers.dirty++
		self._latlngMarkers.total++

		// Only draw if we are on map
		if (isDisplaying === true) self._drawMarker(marker, pointPos)

		return ret
	},

	_drawMarker: function (marker, pointPos) {
		const self = this

		if (!this._imageLookup) this._imageLookup = {}
		if (!pointPos) {
			pointPos = self._map.latLngToContainerPoint(marker.getLatLng())
		}

		// 注意此处支持用户自定义 一个绘制的 func 在 this.options.userDrawFunc 中定义
		if (this.options.userDrawFunc && typeof this.options.userDrawFunc === 'function') {
			const size = marker.options.icon.options.iconSize
			this.options.userDrawFunc(this, marker, pointPos, size)
		} else {
			self._drawIcon(marker, pointPos)
		}
	},

	// 绘制 icon 的方法
	_drawIcon: function (marker, pointPos) {
		const self = this
		const iconUrl = marker.options.icon.options.iconUrl

		if (marker.canvas_img) {
			self._drawImage(marker, pointPos)
		} else {
			if (self._imageLookup[iconUrl]) {
				// TODO: 此处无法处理传入的类型为: L.divIcon
				marker.canvas_img = self._imageLookup[iconUrl][0]

				if (self._imageLookup[iconUrl][1] === false) {
					self._imageLookup[iconUrl][2].push([marker, pointPos])
				} else {
					self._drawImage(marker, pointPos)
				}
			} else {
				// TODO: 此处创建了一个 Image 标签对象
				// 需要在其中定义style的话可以在此处进行
				// 创建了一个 HTMLImageElement 对象
				const i = new window.Image()
				// "/static/windbaricon/level5.png"
				i.src = iconUrl
				marker.canvas_img = i

				// Image,isLoaded,marker\pointPos ref
				self._imageLookup[iconUrl] = [i, false, [[marker, pointPos]]]

				self._imageLookup[iconUrl][1] = true
				self._imageLookup[iconUrl][2].forEach(function (e) {
					self._drawImage(e[0], e[1])
				})
			}
		}
	},

	// 绘制具体的图形
	_drawImage: function (marker, pointPos) {
		const self = this
		const options = marker.options.icon.options
		// TODO: 20-09-17 新的修改
		// 注意实践后的流程是:
		/*
            1- context.save()
            2- 获取 marker.options['rotationAngle']
            3- 对角度进行转换 -> rotaAngle
            4- 平移 x,y - 图标的半径x,y/2
            5- 对于 context 进行旋转(rotaAngle)
            6- 上下文对象 .drwaImage 绘图
        */
		// const angle = marker.options.rotationAngle
		const angle = marker.options['rotationAngle']
		// 注意此处加入了一个判断，因为对该库进行了改造
		if (angle != null) {
			this._context.save()
			const rotaAngle = angle * (Math.PI / 180)
			this._context.translate(
				pointPos.x - options.iconAnchor[0] / 2,
				pointPos.y - options.iconAnchor[1] / 2
			)
			this._context.rotate(rotaAngle)
			this._context.drawImage(
				marker.canvas_img,
				// 注意此处不需要修改该 img 的距离 定点的位置，而是直接移动
				-options.iconSize[0] / 2,
				-options.iconSize[1] / 2,
				options.iconSize[0],
				options.iconSize[1]
			)
			this._context.restore()
		} else {
			console.error('marker.otpions -> not contain "rotationAngle"!')
		}
		// TODO:[x] 20-11-08 此处在跳出 方法时执行以下 this._context.restore 方法
		// 经测试无效，去掉
		// this._context.restore()
	},

	// 根据传入的 canvas 上下文对象将 canvas -> png 并返回
	_convertCanvasToImage: function (tempCtx) {
		const image = new Image()
		// 出现错误: Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
		// 参考:https://www.jianshu.com/p/6fe06667b748
		image.src = tempCtx.canvas.toDataURL('image/png')
		return image
	},

	_reset: function () {
		const topLeft = this._map.containerPointToLayerPoint([0, 0])
		L.DomUtil.setPosition(this._canvas, topLeft)

		const size = this._map.getSize()

		this._canvas.width = size.x
		this._canvas.height = size.y

		this._redraw()
	},

	_redraw: function (clear) {
		const self = this

		if (clear) this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)
		if (!this._map || !this._latlngMarkers) return

		let tmp = []

		// If we are 10% individual inserts\removals, reconstruct lookup for efficiency
		if (self._latlngMarkers.dirty / self._latlngMarkers.total >= 0.1) {
			self._latlngMarkers.all().forEach(function (e) {
				tmp.push(e)
			})

			self._latlngMarkers.clear()
			self._latlngMarkers.load(tmp)
			self._latlngMarkers.dirty = 0
			tmp = []
		}

		const mapBounds = self._map.getBounds()

		// Only re-draw what we are showing on the map.

		const mapBoxCoords = {
			minX: mapBounds.getWest(),
			minY: mapBounds.getSouth(),
			maxX: mapBounds.getEast(),
			maxY: mapBounds.getNorth(),
		}

		self._latlngMarkers.search(mapBoxCoords).forEach(function (e) {
			// Readjust Point Map
			const pointPos = self._map.latLngToContainerPoint(e.data.getLatLng())

			const iconSize = e.data.options.icon.options.iconSize
			const adjX = iconSize[0] / 2
			const adjY = iconSize[1] / 2

			const newCoords = {
				minX: pointPos.x - adjX,
				minY: pointPos.y - adjY,
				maxX: pointPos.x + adjX,
				maxY: pointPos.y + adjY,
				data: e.data,
			}

			tmp.push(newCoords)

			// Redraw points
			self._drawMarker(e.data, pointPos)
		})

		// Clear rBush & Bulk Load for performance
		this._markers.clear()
		this._markers.load(tmp)
	},

	// 初始化 canvas 画布，主要是创建一个 2d 的 canvas 上下文对象(CanvasRenderingContext2D)
	_initCanvas: function () {
		this._canvas = L.DomUtil.create('canvas', 'leaflet-canvas-icon-layer leaflet-layer')
		const originProp = L.DomUtil.testProp([
			'transformOrigin',
			'WebkitTransformOrigin',
			'msTransformOrigin',
		])
		// @ts-ignore
		this._canvas.style[originProp] = '50% 50%'
		// TODO[-] 20-11-09 参考 this._reset 中设置 距离 原点(左上原点) 的位移量
		const topLeft = this._map.containerPointToLayerPoint([0, 0])
		L.DomUtil.setPosition(this._canvas, topLeft)
		// ----
		const size = this._map.getSize()
		this._canvas.width = size.x
		this._canvas.height = size.y

		this._context = this._canvas.getContext('2d')

		const animated = this._map.options.zoomAnimation && L.Browser.any3d
		L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'))
	},

	addOnClickListener: function (listener) {
		this._onClickListeners.push(listener)
	},

	addOnHoverListener: function (listener) {
		this._onHoverListeners.push(listener)
	},

	_executeListeners: function (event) {
		if (!this._markers) return

		const me = this
		const x = event.containerPoint.x
		const y = event.containerPoint.y

		if (me._openToolTip) {
			me._openToolTip.closeTooltip()
			delete me._openToolTip
		}

		const ret = this._markers.search({ minX: x, minY: y, maxX: x, maxY: y })

		if (ret && ret.length > 0) {
			me._map._container.style.cursor = 'pointer'

			if (event.type === 'click') {
				const hasPopup = ret[0].data.getPopup()
				if (hasPopup) ret[0].data.openPopup()

				me._onClickListeners.forEach(function (listener) {
					listener(event, ret)
				})
			}

			if (event.type === 'mousemove') {
				const hasTooltip = ret[0].data.getTooltip()
				if (hasTooltip) {
					me._openToolTip = ret[0].data
					ret[0].data.openTooltip()
				}

				me._onHoverListeners.forEach(function (listener) {
					listener(event, ret)
				})
			}
		} else {
			me._map._container.style.cursor = ''
		}
	},
})

// @ts-ignore
L.canvasMarkerLayer = function (options) {
	// @ts-ignore
	return new CanvasMarkerLayer(options)
}

// 20-09-21 可以使用es6的方式将自定义的 CanvasMarkerLayer 导出，也可以使用上面的的方式进行实例化，主要需要考虑一下如何获取 options
export { CanvasMarkerLayer }
