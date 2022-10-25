/**
 * @description 根据台风查询该时刻的全部站点
 * @author evaseemefly
 * @date 2022/10/21
 * @export
 * @interface ISearchTyStationParams
 */
export interface ISearchTyStationParams {
	/**
	 * 台风的编号(str)
	 */
	// code: string
	num: string
	name: string
	date: Date
}
