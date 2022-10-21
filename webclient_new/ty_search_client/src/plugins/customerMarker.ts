/**
 * + 22-10-10 自定义marker
 */
import { fortmatData2MDHM } from '@/util/filter'

/**
 * @description 自定义marker接口
 * @author evaseemefly
 * @date 2022/10/10
 * @interface ICustomerMarker
 */
interface ICustomerMarker {
	/**
	 * @description 生成自定义的 marker icon div
	 * @author evaseemefly
	 * @date 2022/10/10
	 * @returns {*}  {string}
	 * @memberof ICustomerMarker
	 */
	toHtml(): string
}

/**
 * @description 台风mini marker 主要显示:
 *              当前位置的台风时间
 *              当前位置的台风气压
 *
 * @author evaseemefly
 * @date 2022/10/10
 * @class TyMiniMarker
 * @implements {ICustomerMarker}
 */
class TyMiniMarker implements ICustomerMarker {
	lat: number
	lng: number
	dt: Date
	bp: number
	constructor(lat: number, lng: number, dt: Date, bp: number) {
		this.lat = lat
		this.lng = lng
		this.dt = dt
		this.bp = bp
	}
	toHtml(): string {
		const divHtml = `<div class="my_leaflet-ty-mini-marker" ><div class="my-col dt">${fortmatData2MDHM(
			this.dt
		)}</div>|<div class="my-col bp">bp:${this.bp}</div></div>`
		return divHtml
	}
}

export { ICustomerMarker, TyMiniMarker }
