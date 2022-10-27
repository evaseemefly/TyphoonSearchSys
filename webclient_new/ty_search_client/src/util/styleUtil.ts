/**
 * + 22-10-06 与css相关的工具库
 */

/**
 * @description 对于传入的 div id 将其置顶
 * @author evaseemefly
 * @date 2022/10/06
 * @param {string} id
 */
const stickyTopic = (id: string, zIndex = 9999): void => {
	const element = document.getElementById(id)
	if (element !== undefined) {
		element.style.zIndex = zIndex.toString()
	}
}

/**
 * @description 对于传入 div id 将其 zindex 降级
 * @author evaseemefly
 * @date 2022/10/06
 * @param {string} id
 * @param {number} [step=1]
 * @param {number} [zIndexDefault=9999]
 */
const reduceTopic = (id: string, step = 1, zIndexDefault = 9999): void => {
	const element = document.getElementById(id)
	if (element !== undefined) {
		let currentZIndex = parseInt(element.style.zIndex)
		if (currentZIndex >= zIndexDefault) {
			currentZIndex = 900
		}
		element.style.zIndex = currentZIndex.toString()
	}
}

export { stickyTopic, reduceTopic }
