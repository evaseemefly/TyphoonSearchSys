/**
 * @description http response 接口类
 * @author evaseemefly
 * @date 2022/10/22
 * @export
 * @interface IHttpRequest
 * @template T
 */
export interface IHttpResponse<T> {
	status: number
	data: T
}
