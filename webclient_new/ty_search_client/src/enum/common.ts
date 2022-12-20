/**
 * + 21-08-26 icon 种类
 *
 * @export
 * @enum {number}
 */
export enum IconTypeEnum {
	/**
	 * 台风当前所在位置脉冲 icon
	 */
	TY_PULSING_ICON,

	/**
	 * 台风路径示意 icon
	 */
	TY_PATH_ICON,
}

const getEnumVal = <T>(tempEnum: T, index: number): string => {
	const areaStr = tempEnum[index]
	return areaStr
}

/**
 * @description 控制 隐藏|展开 的枚举
 * @author evaseemefly
 * @date 2022/11/06
 * @export
 * @enum {number}
 */
export enum IExpandEnum {
	/** 不展开 */
	UN_EXPANDED,
	/** 展开 */
	EXPANDED,
	/** 未选择 */
	UN_SELECTED,
}

export { getEnumVal }
