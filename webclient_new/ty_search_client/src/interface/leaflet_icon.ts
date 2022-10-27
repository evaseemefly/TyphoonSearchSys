/**
 * 实现方法 toHtml 类的接口
 *
 * @export
 * @interface IToHtml
 */
export interface IToHtml {
	toHtml(): string
	getClassName(): string
	getStationCode(): string
}
