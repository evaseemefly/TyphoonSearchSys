class Menu_Mid_Model {
  public name: string
  public url: string
  constructor(name: string, url: string) {
    this.name = name
    this.url = url
  }
}

class DataList_Mid_Model {
  public name: string
  public id: number
  public code: string
  constructor(name: string, id: number, code: string) {
    this.name = name
    this.id = id
    this.code = code
  }
}
export { Menu_Mid_Model, DataList_Mid_Model }
