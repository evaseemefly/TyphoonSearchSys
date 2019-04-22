
import { MenuType } from "@/common/enum/menu.ts"
/**
 *
 *
 * @interface IMenu
 */
interface IMenu {
    /**
     * 菜单的显示名字
     *
     * @type {string}
     * @memberof IMenu
     */
    name: string,
    /**
     * 菜单的种类
     *
     * @type {MenuType}
     * @memberof IMenu
     */

    type: MenuType,
    /**
     * 对应的url（暂时不用）
     *
     * @type {string}
     * @memberof IMenu
     */
    url: string
}
export {
    IMenu
}