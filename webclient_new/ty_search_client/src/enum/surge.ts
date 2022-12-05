import { getEnumVal } from './common'

/**
 * + 21-08-25
 * 4色警戒潮位
 * @export
 * @enum {number}
 */
export enum AlertTideEnum {
	GREEN = 5000,
	BLUE = 5001,
	YELLOW = 5002,
	ORANGE = 5003,
	RED = 5004,
}

export enum SurgeForecastAreaEnum {}

const getStatueVal = (x: AlertTideEnum, index: number): string => {
	return getEnumVal<AlertTideEnum>(x, index)
}

export { getStatueVal }
