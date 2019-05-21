class Menu_Mid_Model {
  public name: string
  public url: string
  constructor(name: string, url: string) {
    this.name = name
    this.url = url
  }
}

class DataList_Mid_Model {
  //台风model
  public name: string
  public num: string
  public id: number
  public code: string
  public year: number

  constructor(
    name: string,
    id: number,
    code: string,
    year: number,
    num: string
  ) {
    this.name = name
    this.id = id
    this.code = code
    this.year = year
    this.num = num
  }
}

// 保存选中台风时刻基础model(主要用来配合选择的台风model——新加入了一个指定的时刻)
class TyphoonRealBase_Mid_Model {
  public name: string
  public num: string
  public code: string
  public date: Date

  constructor(name: string, num: string, code: string, date: Date) {
    this.name = name
    this.num = num
    this.code = code
    this.date = date
  }
}

class DemoStationDto {
  public name: String
  public timeSeries: Date[]
  constructor(name: string, timeSeries: Date[]) {
    this.name = name
    this.timeSeries = timeSeries
  }
}
export {
  Menu_Mid_Model,
  DataList_Mid_Model,
  DemoStationDto,
  TyphoonRealBase_Mid_Model
}
