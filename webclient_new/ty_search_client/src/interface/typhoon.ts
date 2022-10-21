/** 台风路径接口 */
export interface ITyPath {
	forecastDt: Date
	lat: number
	lon: number
	bp: number
	isForecast: boolean
	tyType: string
}
