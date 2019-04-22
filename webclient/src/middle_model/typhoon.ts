import { IStation, IEchartsScatterData, IStationObservationTide } from '@/interface/map/map.ts';
// 台风 middel model
import { TyphoonCircleStatus } from '@/common/Status.ts'
import fecha from 'fecha'

class TyphoonData_Mid_Model {
  public meteorology_realdata: MeteorologyRealData_Mid_Model //气象数据
  public tide_reldata: TideRealData_Mid_Model //测站数据
  constructor(
    mete: MeteorologyRealData_Mid_Model,
    tide: TideRealData_Mid_Model
  ) {
    this.meteorology_realdata = mete
    this.tide_reldata = tide
  }
}
// 气象数据
// 主要包含气压、最大风速（台风相关数据）
// 不包含风向数据
class MeteorologyRealData_Mid_Model {
  public code: string //台风代码（编号）
  public latlon: number[] //台风经纬度信息
  public date: Date = new Date() //当前时间
  public bp: number //气压
  public wsm: number //最大风速
  public typhoonCircleStatus: TyphoonCircleStatus
  constructor(
    code: string,
    date: Date,
    latlon: number[],
    bp: number,
    wsm: number
  ) {
    this.code = code
    this.date = date
    this.latlon = latlon
    this.bp = bp
    this.wsm = wsm
    this.typhoonCircleStatus = new TyphoonCircleStatus(wsm, bp)
  }

  toHtml(): string {
    var myself = this
    var htmlStr = `
    <div class="typhoon_data_div card mb-4 col-md-4 box-shadow">
				<div class="card-header">台风数据</div>
				<div class="card-body">
					<div class="row typhoon_data_div">
						<div class="col-md-4">时间</div>
						<div class="col-md-8">${fecha.format(
      new Date(myself.date),
      'YYYY-MM-DD HH:mm'
    )}</div>
					</div>
					<div class="row">
						<div class="col-md-4">中心位置</div>
						<div class="col-md-8">${this.latlon}</div>
					</div>
					<div class="row row_footer">
						<div class="typhoon_footer">
							<div class="columnar">
								<div class="subitem_top">${this.wsm}</div>
								<div class="subitem_foot">最大风速</div>
							</div>
							<div class="columnar">
								<div class="subitem_top">${this.bp}</div>
								<div class="subitem_foot">气压</div>
							</div>
						</div>
					</div>
				</div>
			</div>
    `
    return htmlStr
  }

  // 获取台风divicon的颜色
  getColor(): string {
    return this.typhoonCircleStatus.getColor()
  }

  // 获取divicon的宽度（weight）
  getWeight(): number {
    return this.typhoonCircleStatus.getWeight()
  }
}
//测站数据 middel model
//水文数据：主要包含 1-潮位 2-波浪（波向、有效波高） 3-风（风速、风向）
class TideRealData_Mid_Model {
  public name: string
  public station_code: string //站代码
  public code: string //台风code
  public latlon: number[]
  public date: Date = new Date()
  public bx: number //波向
  public ybg: number //有效波高
  public tide: number //潮位
  public ws: number //风速
  public wd: number //风向

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
    wd: number,
    station_code: string
  ) {
    this.name = name
    this.code = code
    this.latlon = latlon
    this.date = date
    this.bx = bx
    this.ybg = ybg
    this.tide = tide
    this.ws = ws
    this.wd = wd
    this.station_code = station_code
  }
  toHtml(): string {
    var htmlStr = `
    <div id="station_form" class="fade_enter">
					<table class="table table-bordered" border="1">
						<tr>
							<td class="station_name" rowspan="2">海洋站A</td>
							<td class="surge" >5.2</td>
							<td class="surge" >120</td>
						</tr>
						<tr>
							<td class="tide" >2.9</td>
							<td class="tide">94</td>
						</tr>
					</table>
				</div>
    `
    return htmlStr
  }
}

class StationData_Mid_Model implements IStation {
  public code: string
  public startdate: Date
  public stationname: string
  public jw: number
  public lev: number
  public point: any
  public tide: number         // 实测潮位
  public tide_forecast: number // 预报潮位
  public get latlon() {
    return [this.point.coordinates[1], this.point.coordinates[0]]
  }

  //
  constructor(
    code: string,
    startdate: Date,
    stationname: string,
    jw: number,
    lev: number,
    point: any,
    tide: number,
    tide_forecast: number
  ) {
    this.stationname = stationname
    this.code = code
    this.point = point
    this.startdate = startdate
    this.jw = jw
    this.lev = lev
    this.tide = tide
    this.tide_forecast = tide_forecast
  }
}
/**
 * echarts 散点图测站model
 *  0-精度
    1-纬度
    2-潮位值
 * @class EchartsScatterStationData_Mid_Model
 * @implements {IEchartsScatterData}
 */
class EchartsScatterStationData_Mid_Model implements IEchartsScatterData {
  public name: String
  public value: Array<number>
  constructor(
    name: string,
    value: Array<number>) {
    this.name = name
    this.value = value
  }
}

/**
 * 测站的潮位观测值
 *
 * @class StationObservationTide
 * @implements {IStationObservationTide}
 */
class StationObservationTide_Mid_Model implements IStationObservationTide {
  public val: number
  public occurred: Date
  constructor(
    val: number,
    occurred: Date
  ) {
    this.val = val
    this.occurred = occurred
  }
}


export {
  TyphoonData_Mid_Model,
  MeteorologyRealData_Mid_Model,
  TideRealData_Mid_Model,
  StationData_Mid_Model,
  EchartsScatterStationData_Mid_Model,
  StationObservationTide_Mid_Model
}
