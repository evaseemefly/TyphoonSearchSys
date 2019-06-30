import { IMenu, IOption } from "@/interface/menu/menu";
import { MenuType } from "@/common/enum/menu.ts";
import { TyphoonLevel } from "@/common/enum/typhoon.ts";
/**
 * 海洋站详细值对应的菜单
 *
 * @class StationDetailMenu
 * @implements {IMenu}
 */
class StationDetailMenu_Mid_Model implements IMenu {
  public name: string;
  public type: MenuType;
  public url: string;
  constructor(name: string, type: MenuType, url: string) {
    this.name = name;
    this.type = type;
    this.url = url;
  }
}
/**
 * 台风下拉框中间对象
 *
 * @class TyphoonLevelOptionMidModel
 * @implements {IMenu}
 */
class TyphoonLevelOptionMidModel implements IOption {
  public name: string;
  public type: TyphoonLevel;
  public key: number;
  constructor(name: string, type: TyphoonLevel, key: number) {
    this.name = name;
    this.type = type;
    this.key = key;
  }
}

export { StationDetailMenu_Mid_Model, TyphoonLevelOptionMidModel };
