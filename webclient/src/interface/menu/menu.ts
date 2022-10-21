import { MenuType } from "@/common/enum/menu.ts";
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
  name: string;
  /**
   * 菜单的种类
   *
   * @type {MenuType}
   * @memberof IMenu
   */

  type: MenuType;
  /**
   * 对应的url（暂时不用）
   *
   * @type {string}
   * @memberof IMenu
   */
  url: string;
}
/**
 *下拉框接口
 *
 * @interface IOption
 */
interface IOption {
  /**
   * 下拉菜单显示的名字
   *
   * @type {string}
   * @memberof IOption
   */
  name: string;
  /**
   * 菜单的种类
   *
   * @type {any}
   * @memberof IOption
   */

  type: any;
  /**
   * 选中菜单的数字（key）
   *
   * @type {number}
   * @memberof IOption
   */
  key: number;
}

export { IMenu, IOption };
