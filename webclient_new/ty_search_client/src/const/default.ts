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

/**
 * 默认台风编号
 */
const DEFAULT_TY_CODE = 'DEFAULT'

/** 默认未选择的台风名称(ch) */
const DEFAULT_TY_NAME_CH = '未选择'

/** 默认未选择的台风名称(en) */
const DEFAULT_TY_NAME = 'un-select'

const DEFAULT_TY_NUM = '0000'

const DEFAULT_DATE = new Date(1970, 1, 1)

/** 默认海洋站 code */
const DEFAULT_STATION_CODE = 'DEFAULT_CODE'
/** 默认海洋站 name */
const DEFAULT_STATION_NAME = 'DEFAULT_NAME'

/** 默认时间间隔(对应时间组件——由当前台风的时间间隔决定) */
const DEFAULT_DATE_STEP = 1

/** 圆的半径的单位系数 @type {*} */
const DEFAULT_ALERT_TIDE = -999999
/** 默认基面差值 @type {*} */
const DEFAULT_SURGE_DIFF = -999999

export {
	DEFAULT_BOX_LOOP_RADIUS,
	DEFAULT_BOX_LOOP_RADIUS_UNIT,
	DEFAULT_BOX_LOOP_LATLNG,
	DEFAULT_LAYER_ID,
	DEFAULT_DATE,
	DEFAULT_TY_CODE,
	DEFAULT_TY_NAME_CH,
	DEFAULT_TY_NAME,
	DEFAULT_TY_NUM,
	DEFAULT_DATE_STEP,
	DEFAULT_STATION_CODE,
	DEFAULT_STATION_NAME,
	DEFAULT_SURGE_DIFF,
	DEFAULT_ALERT_TIDE,
}
