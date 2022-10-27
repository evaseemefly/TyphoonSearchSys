import * as L from 'leaflet'
// map 相关
/** 圈选范围默认半径 */
const DEFAULT_BOX_LOOP_RADIUS = 100
/** 圈选范围默认的单位 DEFAULT_BOX_LOOP_RADIUS*unit */
const DEFAULT_BOX_LOOP_RADIUS_UNIT = 100
/** 圈选默认位置 */
const DEFAULT_BOX_LOOP_LATLNG = new L.LatLng(30, 150)

// 默认的 leaflet layer id
const DEFAULT_LAYER_ID = -1

const DEFAULT_DATE = new Date(1970, 1, 1)

export {
	DEFAULT_BOX_LOOP_RADIUS,
	DEFAULT_BOX_LOOP_RADIUS_UNIT,
	DEFAULT_BOX_LOOP_LATLNG,
	DEFAULT_LAYER_ID,
	DEFAULT_DATE,
}
