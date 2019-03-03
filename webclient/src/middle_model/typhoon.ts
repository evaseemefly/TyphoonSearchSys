// 台风 middel model
class TyphoonData_Mid_Model {
  public meteorology_realdata: MeteorologyRealData_Mid_Model; //气象数据
  public tide_reldata: TideRealData_Mid_Model; //测站数据
  constructor(
    mete: MeteorologyRealData_Mid_Model,
    tide: TideRealData_Mid_Model
  ) {
    this.meteorology_realdata = mete;
    this.tide_reldata = tide;
  }
}
// 气象数据
// 主要包含气压、最大风速（台风相关数据）
// 不包含风向数据
class MeteorologyRealData_Mid_Model {
  public code: string; //台风代码（编号）
  public latlon: number[]; //台风经纬度信息
  public date: Date = new Date(); //当前时间
  public bp: number; //气压
  public wsm: number; //最大风速
  constructor(
    code: string,
    date: Date,
    latlon: number[],
    bp: number,
    wsm: number
  ) {
    this.code = code;
    this.date = date;
    this.latlon = latlon;
    this.bp = bp;
    this.wsm = wsm;
  }

  toHtml(): string {
    var htmlStr = `
    <div class="card mb-4 col-md-4 box-shadow">
				<div class="card-header">台风数据</div>
				<div class="card-body">
					<div class="row">
						<div class="col-md-4">时间</div>
						<div class="col-md-8">2019-02-23</div>
					</div>
					<div class="row">
						<div class="col-md-4">中心位置</div>
						<div class="col-md-8">18.2,112.0</div>
					</div>
					<div class="row row_footer">
						<div class="typhoon_footer">
							<div class="columnar">
								<div class="subitem_top">5.6</div>
								<div class="subitem_foot">最大风速</div>
							</div>
							<div class="columnar">
								<div class="subitem_top">1006.2</div>
								<div class="subitem_foot">气压</div>
							</div>
						</div>
					</div>
				</div>
			</div>
    `;
    return htmlStr;
  }
}
//测站数据 middel model
//水文数据：主要包含 1-潮位 2-波浪（波向、有效波高） 3-风（风速、风向）
class TideRealData_Mid_Model {
  public name: string;
  public code: string;
  public latlon: number[];
  public date: Date = new Date();
  public bx: number; //波向
  public ybg: number; //有效波高
  public tide: number; //潮位
  public ws: number; //风速
  public wd: number; //风向

  //
  constructor(
    name: string,
    code: string,
    latlon: number[],
    date: Date,
    bx: number,
    ybg: number,
    tide: number,
    ws: number,
    wd: number
  ) {
    this.name = name;
    this.code = code;
    this.latlon = latlon;
    this.date = date;
    this.bx = bx;
    this.ybg = ybg;
    this.tide = tide;
    this.ws = ws;
    this.wd = wd;
  }
}

export {
  TyphoonData_Mid_Model,
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model
};
