import moment from 'moment'
import { DEFAULT_DATE } from '@/const/default'
import { TyphoonLevelEnum } from '@/enum/typhoon'
/**
 * 将时间转换为指定的格式(str)
 *
 * @param {Date} now
 * @returns {string}
 */
const fortmatData2YMDHM = (now: Date): string => {
	return moment(now).format('YYYY-MM-DD HH:mm')
}
const fortmatData2MDHM = (now: Date): string => {
	return moment(now).format('MM-DD HH:mm')
}
const formatData2YMDH = (now: Date): string => {
	return moment(now).format('YYYY-MM-DD HH')
}
const formatDate2YMD = (now: Date): string => {
	return moment(now).format('YYYY-MM-DD')
}

const formatDate2MD = (now: Date): string => {
	return moment(now).format('MM-DD')
}

const formatDate2HM = (now: Date): string => {
	return moment(now).format('HH:mm')
}
const fortmatDate = (now: Date, formatStr: string) => {
	if (now === DEFAULT_DATE) {
		return '-'
	}
	return moment(now).format(formatStr)
}

const formatOnlyFirstCol = (val: { name: string; key: number }): string => {
	return val.key === 0 ? val.name : '-'
}

/**
 * @description val左侧填充' ' 至 length=len
 * @author evaseemefly
 * @date 2022/09/16
 * @param {string} val
 * @param {number} len
 * @returns {*}  {string}
 */
const formatPadLeftStr = (val: string, len: number): string => {
	return val.padStart(len)
}

/**
 * @description val 右侧填充 ' ' 至 Length = len
 * @author evaseemefly
 * @date 2022/09/16
 * @param {string} val
 * @param {number} len
 * @returns {*}  {string}
 */
const formatPadRightstr = (val: string, len: number): string => {
	return val.padEnd(len)
}

/**
 * @description 台风级别 enum => str
 * @author evaseemefly
 * @date 2022/09/28
 * @param {TyphoonLevelEnum} val
 * @returns {*}  {string}
 */
const formatTyLevel2Str = (val: string): string => {
	let tyName = ''
	switch (val) {
		// case TyphoonLevelEnum.TS:
		// 	tyName = '热带风暴'
		// 	break
		// case TyphoonLevelEnum.STS:
		// 	tyName = '强热带风暴'
		// 	break
		// case TyphoonLevelEnum.TY:
		// 	tyName = '台风'
		// 	break
		// case TyphoonLevelEnum.STY:
		// 	tyName = '强台风'
		// 	break
		// case TyphoonLevelEnum.SUPERTY:
		// 	tyName = '超强台风'
		// 	break
		case 'TS':
			tyName = '热带风暴'
			break
		case 'STS':
			tyName = '强热带风暴'
			break
		case 'TY':
			tyName = '台风'
			break
		case 'STY':
			tyName = '强台风'
			break
		case 'SuperTY':
			tyName = '超强台风'
			break

		default:
			tyName = '其他'
			break
	}
	return tyName
}

/**
 * @description 根据台风级别获取对应的 class
 * @author evaseemefly
 * @date 2022/09/28
 * @param {TyphoonLevelEnum} val
 * @returns {*}  {string}
 */
const formatTyLevel2Cls = (val: string): string => {
	let tyName = ''
	switch (val) {
		// case TyphoonLevelEnum.TS:
		// 	tyName = 'green'
		// 	break
		// case TyphoonLevelEnum.STS:
		// 	tyName = 'blue'
		// 	break
		// case TyphoonLevelEnum.TY:
		// 	tyName = 'yellow'
		// 	break
		// case TyphoonLevelEnum.STY:
		// 	tyName = 'orange'
		// 	break
		// case TyphoonLevelEnum.SUPERTY:
		// 	tyName = 'red'
		// 	break
		case 'TS':
			tyName = 'green'
			break
		case 'STS':
			tyName = 'blue'
			break
		case 'TY':
			tyName = 'yellow'
			break
		case 'STY':
			tyName = 'orange'
			break
		case 'SuperTY':
			tyName = 'red'
			break
		default:
			tyName = 'other'
			break
	}
	return tyName
}

// const getAlertDis(item:{stationName: string;
//   stationCode: string;
//   id: number;
//   surgeList: { forecastDt: Date; surge: number }[];
//   blue: number;
//   yellow: number;
//   orgin: number;
//   red: number;}):number{
//     return
//   }

export {
	fortmatData2YMDHM,
	formatOnlyFirstCol,
	formatPadLeftStr,
	formatPadRightstr,
	formatDate2YMD,
	formatDate2MD,
	formatDate2HM,
	formatTyLevel2Str,
	formatTyLevel2Cls,
	fortmatData2MDHM,
}
