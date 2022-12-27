/**
 * @description + 22-11-18 过滤枚举
 * @author evaseemefly
 * @date 2022/11/18
 * @enum {number}
 */
enum FilterTypeEnum {
	/** 默认未选择 */
	NULL,
	/** 按照年份进行过滤 */
	FILTER_BY_UNIQUE_YEAR = 1002,
	/** 按照月份进行过滤 */
	FILTER_BY_UNIQUE_MONTH = 1001,
	/** 按照台风编号进行过滤 */
	FILTER_BY_UNIQUE_TYNUM = 1003,
}

/**
 * @description 为了加载散点|热图 而使用的台风过滤类型
 * @author evaseemefly
 * @date 2022/11/29
 * @enum {number}
 */
enum FilterType4ScattersEnum {
	/** 默认未选择 */
	NULL,
	/** 按照范围查询(半径) */
	FILTER_BY_RADIUS,
	/** 按照唯一性条件查询 */
	FILTER_BY_UNIQUE_QUERY,
}

export { FilterTypeEnum, FilterType4ScattersEnum }
