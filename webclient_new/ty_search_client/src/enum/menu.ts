/**
 * 菜单种类——加载测站的观测值的种类
 *
 * @enum {number}
 */
enum MenuType {
	// 实测
	real = 0,
	// 预报
	forecast = 1,
	// 实测加预报
	all = 2,
}

/**
 * @description 台风散点(或热图)按钮类型
 * @author evaseemefly
 * @date 2022/11/14
 * @enum {number}
 */
enum TyScatterMenuType {
	/** 散点 */
	SCATTER,
	/** 热图 */
	HEATMAP,
	UN_SELECT,
}
export { MenuType, TyScatterMenuType }
