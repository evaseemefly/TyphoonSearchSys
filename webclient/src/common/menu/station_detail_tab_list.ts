import { StationDetailMenu_Mid_Model } from "@/middle_model/menu.ts"
import { MenuType } from "@/common/enum/menu.ts"

// 海洋站 modal 上面显示的tab 
const menulist = [
    new StationDetailMenu_Mid_Model("实测",MenuType.real,""),
    new StationDetailMenu_Mid_Model("预报",MenuType.forecast,"")
]
export{menulist}