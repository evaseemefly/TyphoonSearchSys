/**
 * @description 海洋站info
 * + 22-10-23 新加入了 surge 字段
 * @author evaseemefly
 * @date 2022/07/27
 * @export {
 *  id: number
	code: string
	name: string
	lat: number
	lon: number
	is_in_common_use: boolean
}
 * @interface IStationInfo
 */
export interface IStationInfo {
	id: number
	code: string
	name: string
	lat: number
	lon: number
	/** 增水(unit:cm) */
	surge: number
}

/**
 * @description
 * @author evaseemefly
 * @date 2022/07/27
 * @export
 * @interface IStationIcon
 */
export interface IStationIcon {
	/** 脉冲点 layer id */
	cirlePulsingId: number
	/** title与详情div layer id */
	divIconId: number
	/** 海洋站编号 */
	code: string
	/** 海洋站名称 */
	name: string
}
