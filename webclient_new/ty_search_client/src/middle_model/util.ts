import * as L from 'leaflet'
import { TyCMAPathLine } from '@/middle_model/leaflet_plugin'
import { TyRealDataMongoMidModel } from '@/middle_model/typhoon'
// 接口类
import { ITyPath } from '@/interface/typhoon'

/**
 * 根据传入的台风中心气压获取台风对应的级别
 * @param bp
 * @returns
 */
const convertBp2TyLevel = (bp: number): string => {
	let tyLevel = 'DEFAULT'
	switch (true) {
		// 其他
		case bp >= 1000:
			tyLevel = 'DEFAULT'
			break
		// 热带风暴
		case bp >= 990:
			tyLevel = 'TS'
			break
		// 强热带风暴
		case bp >= 980:
			tyLevel = 'STS'
			break
		// 台风
		case bp >= 960:
			tyLevel = 'TY'
			break
		// 强台风
		case bp >= 940:
			tyLevel = 'STY'
			break
		// 超强台风
		case bp < 940:
			tyLevel = 'SuperTY'
			break
		default:
			tyLevel = 'DEFAULT'
			break
	}
	return tyLevel
}

/**
 * @description 将 mongo 中的台风路径 data -> tycma list
 * @author evaseemefly
 * @date 2022/10/19
 * @param {TyRealDataMongoMidModel[]} sourcelist
 * @param {L.Map} map
 * @returns {*}  {ITyPath[]}
 */
const convertTyRealDataMongo2TyCMAPathLine = (sourcelist: TyRealDataMongoMidModel[]): ITyPath[] => {
	const convertTyPathList: ITyPath[] = []
	sourcelist.forEach((temp) => {
		const tempTyPath: ITyPath = {
			forecastDt: temp.forecastDt,
			lat: temp.latlng.lat,
			lon: temp.latlng.lng,
			bp: temp.bp,
			isForecast: false,
			tyType: convertBp2TyLevel(temp.bp),
		}
		convertTyPathList.push(tempTyPath)
	})
	return convertTyPathList
}

export { convertTyRealDataMongo2TyCMAPathLine, convertBp2TyLevel }
