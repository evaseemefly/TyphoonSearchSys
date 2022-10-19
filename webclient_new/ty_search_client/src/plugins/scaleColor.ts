/*
    TODO:[-] 21-03-12 
*/
// import { BIconChevronCompactUp } from 'bootstrap-vue'
import chroma from 'chroma-js'
class ScaleColor {
	min: number
	max: number
	scale: chroma.Scale
	constructor(min: number, max: number) {
		this.min = min
		this.max = max
	}
	setScale(scaleName: string | string[] = 'Viridis'): void {
		this.scale = chroma.scale(scaleName)
	}
	getColor(val: number): string {
		if (this.scale === undefined) {
			this.setScale()
		}
		const scale = this.scale
		if (val === 0 || Number.isNaN(val)) return '#7f8c8d'

		// scale to 0 - 1 used by chroma
		const scaledPixelValue = (val - this.min) / (this.max - this.min)

		const color = scale(scaledPixelValue).hex()

		return color
	}
}

/**
 * 台风集合路径配色
 *
 * @class TyGroupPathScaleColor
 * @extends {ScaleColor}
 */
class TyGroupPathScaleColor extends ScaleColor {
	setScale(scaleName: string | string[] = 'Viridis') {
		// this.scale = chroma.scale([
		//     '#00429d',
		//     '#4771b2',
		//     '#73a2c6',
		//     '#a5d5d8',
		//     '#ffffe0',
		//     '#ffbcaf',
		//     '#f4777f',
		//     '#cf3759',
		//     '#93003a'
		// ])
		// this.scale = chroma.scale([
		//     '#007991',
		//     '#1d899a',
		//     '#2e99a2',
		//     '#3ca9ab',
		//     '#49bab3',
		//     '#55cbbc',
		//     '#61dcc5',
		//     '#6dedcd',
		//     '#78ffd6'
		// ])
		this.scale = chroma.scale([
			'#06beb6',
			'#19bcb7',
			'#24bbb8',
			'#2db9b9',
			'#34b8bb',
			'#3ab6bc',
			'#3fb4bd',
			'#44b3be',
			'#48b1bf',
		])
		// this.scale = chroma.scale('Viridis')
		// this.scale = chroma.scale([
		//     '#569ddf',
		//     '#48a5e7',
		//     '#3badef',
		//     '#2db5f7',
		//     '#20bdff',
		//     '#41cdf2',
		//     '#63dee5',
		//     '#84eed8',
		//     '#a5fecb'
		// ])
	}
}

/**
 * 根据台风等级获取对应的台风路径填色颜色
 *
 * @param {string} tyType
 * @return {*}
 */
const getTyPathLineColor = (tyType: string) => {
	let colorStr = ''
	switch (true) {
		// 热带风暴
		case tyType === 'TS':
			colorStr = '#38ada9'
			break
		// 强热带风暴
		case tyType === 'STS':
			colorStr = '#60a3bc'
			break
		// 台风
		case tyType === 'TY':
			colorStr = '#f6b93b'
			break
		// 强台风
		case tyType === 'STY':
			colorStr = '#e55039'
			break
		// 超强台风
		case tyType === 'SuperTY':
			colorStr = '#b71540'
			break
		default:
			colorStr = '#38ada9'
			break
	}
	return colorStr
}

export { ScaleColor, TyGroupPathScaleColor, getTyPathLineColor }
