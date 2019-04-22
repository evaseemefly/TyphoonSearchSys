import { IMenu } from "@/interface/menu/menu"
import { MenuType } from "@/common/enum/menu.ts"
/**
 * 海洋站详细值对应的菜单
 *
 * @class StationDetailMenu
 * @implements {IMenu}
 */
class StationDetailMenu_Mid_Model implements IMenu {
    public name: string
    public type: MenuType
    public url: string
    constructor(name: string, type: MenuType, url: string) {
        this.name = name;
        this.type = type;
        this.url = url;
    }
}

export{
    StationDetailMenu_Mid_Model
}