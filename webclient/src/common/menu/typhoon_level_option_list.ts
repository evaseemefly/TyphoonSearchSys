import { TyphoonLevelOptionMidModel } from "@/middle_model/menu.ts";
import { TyphoonLevel } from "@/common/enum/typhoon.ts";

// 台风的类型下拉框列表
const OptionList = [
  new TyphoonLevelOptionMidModel("未选择", null, 0),
  new TyphoonLevelOptionMidModel("热带低压", TyphoonLevel.td, 1),
  new TyphoonLevelOptionMidModel("热带风暴", TyphoonLevel.ts, 2),
  new TyphoonLevelOptionMidModel("强热带风暴", TyphoonLevel.sts, 3),
  new TyphoonLevelOptionMidModel("台风", TyphoonLevel.ty, 4),
  new TyphoonLevelOptionMidModel("强大风", TyphoonLevel.td, 5),
  new TyphoonLevelOptionMidModel("超强台风", TyphoonLevel.superty, 6)
];
export { OptionList };
