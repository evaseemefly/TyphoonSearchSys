// 引入了各种可能得状态
export const ACTIVATION_BEGIN = 'ACTIVATION_BEGIN'
export const ACTIVATION_CLEAR = 'ACTIVATION_CLEAR'
export const ACTIVATION_FAILURE = 'ACTIVATION_FAILURE'
export const ACTIVATION_SUCCESS = 'ACTIVATION_SUCCESS'
export const LOGIN_BEGIN = 'LOGIN_BEGIN'
export const LOGIN_CLEAR = 'LOGIN_CLEAR'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT = 'LOGOUT'
export const PASSWORD_EMAIL_BEGIN = 'PASSWORD_EMAIL_BEGIN'
export const PASSWORD_EMAIL_CLEAR = 'PASSWORD_EMAIL_CLEAR'
export const PASSWORD_EMAIL_FAILURE = 'PASSWORD_EMAIL_FAILURE'
export const PASSWORD_EMAIL_SUCCESS = 'PASSWORD_EMAIL_SUCCESS'
export const PASSWORD_RESET_BEGIN = 'PASSWORD_RESET_BEGIN'
export const PASSWORD_RESET_CLEAR = 'PASSWORD_RESET_CLEAR'
export const PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE'
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS'
export const REGISTRATION_BEGIN = 'REGISTRATION_BEGIN'
export const REGISTRATION_CLEAR = 'REGISTRATION_CLEAR'
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE'
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS'
// export const SET_TOKEN = 'SET_TOKEN'
// TODO:[-] 20-02-07 jwt返回的token的key为 'token'
export const SET_TOKEN = 'token'
// 移除jwt的token,在localStorage中保存的token
export const REMOVE_TOKEN = 'REMOVE_TOKEN'
// + 21-08-18 color scal的key
export const SET_SCALE_KEY = 'SET_SCALE_KEY'
export const GET_SCALE_KEY = 'GET_SCALE_KEY'
// +21-08-20 color scale 的 range
export const SET_SCALE_RANGE = 'SET_SCALE_RANGE'
export const GET_SCALE_RANGE = 'GET_SCALE_RANGE'
// + 22-06-16 color bar 的描述信息(提示信息)

/** @type {*} color bar 的描述信息(提示信息)*/
export const SET_SCALE_DESC = 'SET_SCALE_DESC'
/** @type {*} color bar 的描述信息(提示信息)*/
export const GET_SCALE_DESC = 'GET_SCALE_DESC'

/** 设置 潮位等值线 色标对应的值 range */
export const SET_ISOSURGE_COLOR_SCALE_VAL_RANGE = 'SET_ISOSURGE_COLOR_SCALE_RANGE'
/** 获取 潮位等值线 色标对应的值 range */

export const GET_ISOSURGE_COLOR_SCALE_VAL_RANGE = 'GET_ISOSURGE_COLOR_SCALE_VAL_RANGE'

/** 设置 潮位等值线 色标颜色str list */
export const SET_ISOSURGE_COLOR_SCALE_STR_LIST = 'SET_ISOSURGE_COLOR_SCALE_STR_LIST'
/** 获取 潮位等值线 色标颜色str list */

export const GET_ISOSURGE_COLOR_SCALE_STR_LIST = 'GET_ISOSURGE_COLOR_SCALE_STR_LIST'

// 产品的种类(主要是oil还是rescue)
export const SET_PRODUCT_TYPE = 'SET_PRODUCT_TYPE'
export const GET_PRODUCT_TYPE = 'GET_PRODUCT_TYPE'

// case 相关
export const SET_CASE_CODE = 'SET_CASE_CODE'
export const GET_CASE_CODE = 'GET_CASE_CODE'

// ----------------
// map 相关
export const SET_MAP_NOW = 'SET_MAP_NOW'
export const GET_MAP_NOW = 'GET_MAP_NOW'
// 设置当前 map 中的 显示的 layers
export const SET_MAP_LAYERS = 'SET_MAY_LAYERS'
export const GET_MAP_LAYERS = 'GET_MAP_LAYERS'
export const INIT_MAP_LAYERS = 'INIT_MAP_LAYERS'
// + 22-01-05 是否需要 重置 layers
export const SET_IS_INIT_LAYERS = 'SET_IS_INIT_LAYERS'
export const GET_IS_INIT_LAYERS = 'GET_IS_INIT_LAYERS'

// + 21-08-23 切换地图底图
export const SET_BASE_MAP_KEY = 'SET_BASE_MAP_KEY'
export const GET_BASE_MAP_KEY = 'GET_BASE_MAP_KEY'

// + 22-06-08 切换栅格图层
/** 设置栅格图层显示类型 */
export const SET_RASTER_LAYER_KEY = 'SET_RASTER_LAYER_KEY'
/** 获取栅格图层显示类型 */
export const GET_RASTER_LAYER_KEY = 'GET_RASTER_LAYER_KEY'

// map - 修改是否显示创建 oil case model
export const SET_CREATE_OIL_CASE_MODAL = 'SET_CREATE_OIL_CASE_MODAL'
export const GET_CREATE_OIL_CASE_MODAL = 'GET_CREATE_OIL_CASE_MODAL'

// map - 修改是否显示 创建 form (风暴潮)
export const SET_CREATE_FORM = 'SET_CREATE_FORM'
export const GET_CREATE_FORM = 'GET_CREATE_FORM'

// map - 设置是否进行地图圈选操作
/** 进行地图圈选 true:selected false:un selected */
export const SET_IS_SELECT_LOOP = 'SET_IS_SELECT_LOOP'
/** 进行地图圈选 true:selected false:un selected */
export const GET_IS_SELECT_LOOP = 'GET_IS_SELECT_LOOP'

/** 设置当前圈选的位置 */
export const SET_BOX_LOOP_LATLNG = 'SET_BOX_LOOP_LATLNG'
/** 获取当前圈选的位置 */
export const GET_BOX_LOOP_LATLNG = 'GET_BOX_LOOP_LATLNG'

/** + 22-10-18 设置当前圈选范围半径值 */
export const SET_BOX_LOOP_RADIUS = 'SET_BOX_LOOP_RADIUS'
/** + 22-10-18 获取当前圈选范围半径值 */
export const GET_BOX_LOOP_RADIUS = 'GET_BOX_LOOP_RADIUS'

// map - 选中的经纬度位置
export const SET_CURRENT_LATLNG = 'SET_CURRENT_LATLNG'
export const GET_CURRENT_LATLNG = 'GET_CURRENT_LATLNG'
// TODO:[-] 21-01-06 map - 初始的经纬度
export const SET_INITIAL_LATLNG = 'SET_INITIAL_LATLNG'
export const GET_INITIAL_LATLNG = 'GET_INITIAL_LATLNG'
// TODO:[-] 21-01-06 map - 选中的经纬度位置锁
// 只有 CURRENT_LATLNG_LOCK =false时，才可以移动点选的位置，否则不可移动
export const SET_CURRENT_LATLNG_LOCK = 'SET_CURRENT_LATLNG_LOCK'
export const GET_CURRENT_LATLNG_LOCK = 'GET_CURRENT_LATLNG_LOCK'

// TODO:[-] 21-01-27 map - 新加入的用来控制组件间触发异步时间造成的错位情况的 时间锁
export const SET_TIMER_LOCK = 'SET_TIMER_LOCK'
export const GET_TIMER_LOCK = 'GET_TIMER_LOCK'

// TODO:[-] 21-01-29 map - 新加入的用来控制是否继续播放的 auto-play
// autoPlay = true : on  -> 继续播放
//          = false: off -> 停止播放
export const SET_AUTO_PLAY = 'SET_AUTO_PLAY'
export const GET_AUTO_PLAY = 'GET_AUTO_PLAY'

/** + 22-10-30 设置开启圈选范围 */
export const SET_SELECTED_LOOP = 'SET_SELECTED_LOOP'
/** + 22-10-30 获取开启圈选范围 */
export const GET_SELECTED_LOOP = 'GET_SELECTED_LOOP'

// ----------------
// geo 相关
export const SET_GEO_COVERAGEID = 'SET_GEO_COVERAGEID'
export const GET_GEO_COVERAGEID = 'GET_GEO_COVERAGEID'
// geo -> coverage_type
export const SET_GEO_COVERAGETYPE = 'SET_GEO_COVERAGETYPE'
export const GET_GEO_COVERAGETYPE = 'GET_GEO_COVERAGETYPE'

// + 21-07-24 typhoon 相关
export const SET_TYPHOON_CODE = 'SET_TYPHOON_CODE'
export const GET_TYPHOON_CODE = 'GET_TYPHOON_CODE'

export const SET_TYPHOON_ID = 'SET_TYPHOON_ID'
export const GET_TYPHOON_ID = 'GET_TYPHOON_ID'

// + 21-07-28 获取台风时间戳
export const SET_TYPHOON_TIMESTAMP = 'SET_TYPHOON_TIMESTAMP'
export const GET_TYPHOON_TIMESTAMP = 'GET_TYPHOON_TIMESTAMP'
// export { GET_MAP_LAYERS }

// + 22-04-07 当前台风路径
export const SET_TYPHOON_PATH_LIST = 'SET_TYPHOON_PATH_LIST'
export const GET_TYPHOON_PATH_LIST = 'GET_TYPHOON_PATH_LIST'

// 配置项
export const SET_TY_GROUP_PATH_LATERS_OPTS = 'SET_TY_GROUP_PATH_OPTS'
export const GET_TY_GROUP_PATH_LATERS_OPTS = 'GET_TY_GROUP_PATH_OPTS'

// common
export const SET_SHOW_OPTS_FORM = 'SET_SHOW_OPTS_FORM'
export const GET_SHOW_OPTS_FORM = 'GET_SHOW_OPTS_FORM'

/** 设置 显示台风搜索窗口 */
export const SET_SHOW_TY_SEARCH_FORM = 'SET_SHOW_TY_SEARCH_FORM'
/** 获取 显示台风搜索窗口 */
export const GET_SHOW_TY_SEARCH_FORM = 'GET_SHOW_TY_SEARCH_FORM'

/** 设置 显示海洋站过程极致窗口 */
export const SET_SHOW_STATION_EXTREMUM_FORM = 'SET_SHOW_STATION_EXTREMUM_FORM'
/** 获取 显示海洋站过程极致窗口 */
export const GET_SHOW_STATION_EXTREMUM_FORM = 'GET_SHOW_STATION_EXTREMUM_FORM'

/** 设置 显示海洋站风暴增水详情窗口 */
export const SET_SHOW_STATION_DETAIL_FORM = 'SET_SHOW_STATION_DETAIL_FORM'
/** 获取 显示海洋站风暴增水详情窗口 */
export const GET_SHOW_STATION_DETAIL_FORM = 'GET_SHOW_STATION_DETAIL_FORM'

// + 22-03-28 STATION
export const SET_SHOW_STATION_ICON = 'SET_SHOW_STATION_ICON'
export const GET_SHOW_STATION_ICON = 'GET_SHOW_STATION_ICON'

/** 设置当前选定的海洋站 code */
export const SET_STATION_CODE = 'SET_STATION_CODE'
/** 获取当前选定的海洋站 code */
export const GET_STATION_CODE = 'GET_STATION_CODE'

// + 22-04-18 TYPHOON 显示台风图例
export const SET_SHOW_TYPHOON_LEGEND_ICON = 'SET_SHOW_TYPHOON_LEGEND_ICON'
export const GET_SHOW_TYPHOON_LEGEND_ICON = 'GET_SHOW_TYPHOON_LEGEND_ICON'

/** 设置是否显示 raster图层的图例 */
export const SET_IS_SHOW_RASTER_LEGEND = 'SET_IS_SHOW_RASTER_LEGEND'
/** 获取是否显示 raster图层的图例 */
export const GET_IS_SHOW_RASTER_LEGEND = 'GET_IS_SHOW_RASTER_LEGEND'

// ---- typhoon ----
/** 设置当前选中的台风 */
export const SET_CURRENT_TY = 'SET_CURRENT_TY'
/** 获取当前选中的台风 */
export const GET_CURRENT_TY = 'GET_CURRENT_TY'

/** 设置当前台风选定预报时间 */
export const SET_CURRENT_TY_FORECAST_DT = 'SET_CURRENT_TY_FORECAST_DT'
/** 获取当前台风选定预报时间 */
export const GET_CURRENT_TY_FORECAST_DT = 'GET_CURRENT_TY_FORECAST_DT'

/** 设置当前时间间隔 */
export const SET_DATE_STEP = 'SET_DATE_STEP'
/** 获取当前时间间隔 */
export const GET_DATE_STEP = 'GET_DATE_STEP'

// -----
// 各类非单一属性的复杂 complex opts
/** 设置 { currentTyNum; currentTyName; currentStationName } 用来监听当前海洋站及相关属性的变化 */
export const SET_COMPLEX_OPTS_CURRENT_STATION = 'SET_COMPLEX_OPTS_CURRENT_STATION'
/** 获取 { currentTyNum; currentTyName; currentStationName } 用来监听当前海洋站及相关属性的变化 */
export const GET_COMPLEX_OPTS_CURRENT_STATION = 'GET_COMPLEX_OPTS_CURRENT_STATION'
