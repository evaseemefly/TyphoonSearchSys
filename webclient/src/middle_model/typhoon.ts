// 台风 middel model
class TyphoonData_Mid_Model{
      public meteorology_realdata:MeteorologyRealData_Mid_Model     //气象数据
      public tide_reldata:TideRealData_Mid_Model                    //测站数据
      constructor(mete:MeteorologyRealData_Mid_Model,tide:TideRealData_Mid_Model){
          this.meteorology_realdata=mete
          this.tide_reldata=tide
      }
}
// 气象数据
// 主要包含气压、最大风速（台风相关数据）
// 不包含风向数据
class MeteorologyRealData_Mid_Model{
    public code:string          //台风代码（编号）
    public latlon:number[]      //台风经纬度信息
    public date:Date=new Date() //当前时间
    public bp:number            //气压
    public wsm:number           //最大风速
    constructor(code:string,date:Date,latlon:number[],bp:number,wsm:number){
        this.code=code
        this.date=date
        this.latlon=latlon
        this.bp=bp
        this.wsm=wsm
    }

}
//测站数据 middel model
//水文数据：主要包含 1-潮位 2-波浪（波向、有效波高） 3-风（风速、风向）
class TideRealData_Mid_Model{
    public name:string      
    public code:string
    public latlon:number[]
    public date:Date=new Date()
    public bx:number            //波向
    public ybg:number           //有效波高
    public tide:number          //潮位
    public ws:number            //风速
    public wd:number            //风向

    //
    constructor(name:string,code:string,latlon:number[],date:Date,bx:number,ybg:number,tide:number,ws:number,wd:number){
        
        this.name=name
        this.code=code
        this.latlon=latlon
        this.date=date
        this.bx=bx
        this.ybg=ybg
        this.tide=tide
        this.ws=ws
        this.wd=wd
    }
}

export{TyphoonData_Mid_Model,MeteorologyRealData_Mid_Model,TideRealData_Mid_Model}