import { FilterTyMidModel } from '@/middle_model/typhoon'

/**
 * @description + 22-11-24 根据传入的 filterTyList 进行排序
 * @author evaseemefly
 * @date 2022/11/24
 * @param {FilterTyMidModel[]} query
 * @returns {*}  {FilterTyMidModel[]}
 */
const sortFilterTyList = (query: FilterTyMidModel[]): FilterTyMidModel[] => {
	/** 排序后的台风集合 */
	const sortedFilterTyList = []
	const yearDesc = true
	const codeDesc = false
	const yearList: number[] = []
	query.map((temp) => {
		yearList.push(temp.year)
	})

	const distYearSet = new Set(yearList)
	const distYearList = Array.from(distYearSet)
	const sortedYearList: number[] = distYearList.sort((a, b) => {
		if (yearDesc) {
			return b - a
		} else {
			return a - b
		}
	})
	console.log(sortedYearList)
	for (let index = 0; index < sortedYearList.length; index++) {
		const year = sortedYearList[index]
		const tempTylistByYear = query.filter((temp) => {
			return temp.year === year
		})
		// 对于同一年份的台风按照编号大小从小到大排序
		tempTylistByYear
			.sort((x, y) => {
				if (codeDesc) {
					return parseInt(y.tyNum) - parseInt(x.tyNum)
				} else {
					return parseInt(x.tyNum) - parseInt(y.tyNum)
				}
			})
			.map((tempsorted) => {
				sortedFilterTyList.push(tempsorted)
			})
	}

	return sortedFilterTyList
}

export { sortFilterTyList }
