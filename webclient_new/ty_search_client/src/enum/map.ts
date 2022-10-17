enum ConstLayerTypeEnum {
	UN_LAYER = -1,
}

export enum StationIconLayerEnum {}

enum BaseLayerTypeEnum {
	// 更新至 tb:dict_base -> pid=700
	// 台风-集合预报路径图层
	GROUP_PATH_LAYER = 701,
	// 潮位站-实时数据图层
	/**
	 *静态潮位站位置示意icon
	 */
	STATION_ICON_STATIC_LAYER = 702, // 静态潮位站位置示意icon

	/**
	 * 潮位站逐时示意icon
	 */
	STATION_ICON_FIELD_LAYER = 703, // 潮位站逐时示意icon

	/**
	 *潮位站极值示意icon
	 */
	STATION_ICON_MAX_LAYER = 704, // 潮位站极值示意icon
	STATION_ICON_LAYER = 705,
	// 栅格-逐时增水图层
	RASTER_HOURLY_SURGE_LAYER = 1104,
	// + 21-08-01 最大增水图层
	RASTER_MAX_SURGE_LAYER = 1102,
	RASTER_PRO_SURGE_LAYER = 1105,

	// RASTER_PRO_SURGE_LAYER_GT05 = 1301, // 风暴增水概率
	// RASTER_PRO_SURGE_LAYER_GT10 = 1302, //  增水大于0.5m的概率 nc
	// RASTER_PRO_SURGE_LAYER_GT15 = 1303,
	// RASTER_PRO_SURGE_LAYER_GT20 = 1304,
	// RASTER_PRO_SURGE_LAYER_GT25 = 1305,
	// RASTER_PRO_SURGE_LAYER_GT30 = 1306
}

export enum SurgeProLayerEnum {
	// UN_LAYER = -1,
	RASTER_PRO_SURGE_LAYER_GT05 = 1301, // 风暴增水概率
	RASTER_PRO_SURGE_LAYER_GT10 = 1302, //  增水大于0.5m的概率 nc
	RASTER_PRO_SURGE_LAYER_GT15 = 1303,
	RASTER_PRO_SURGE_LAYER_GT20 = 1304,
	RASTER_PRO_SURGE_LAYER_GT25 = 1305,
	RASTER_PRO_SURGE_LAYER_GT30 = 1306,
}

/**
 *+ 21-08-23 切换底图的key
 *
 * @export
 * @enum {number}
 */
export enum MapLayerEnum {
	SATELITE_MAP = 4001, // 卫星卫片
	SIMPLE_MAP = 4002, // 简单底图
}

/**
 * + 22-06-08 栅格图层切换 key : 等值线|栅格图层
 *
 * @export
 * @enum {number}
 */
export enum RasterLayerEnum {
	/**
	 * 栅格图层
	 */
	RASTER_LAYER = 4003,

	/**
	 * 等值线图层
	 */
	ISOSURFACE_LAYER = 4004,
}
export const LayerTypeEnum = {
	...SurgeProLayerEnum,
	...BaseLayerTypeEnum,
	...StationIconLayerEnum,
	...ConstLayerTypeEnum,
}
export type LayerTypeEnum =
	| BaseLayerTypeEnum
	| SurgeProLayerEnum
	| ConstLayerTypeEnum
	| StationIconLayerEnum
// export { LayerTypeEnum&SurgeProLayerEnum }
// export default { ...SurgeProLayerEnum, ...LayerTypeEnum }
// export { LayerTypeEnum }
// export { LayerTypeEnum }
