from mongoengine import *
import datetime
from conf import setting


class Extremum(EmbeddedDocument):
    '''
        极值
    '''
    occurredTime = DateTimeField(required=False,default=None)
    val = IntField(required=False,default=None)

    # def __init__(self,date:datetime,val:str):
    #     # self.occurredTime=date
    #     # self.val=val
    #     self._toModel(date,val)
    #
    # def _toModel(self,date:datetime,val:str):
    #     '''
    #         加入一个数据验证
    #     :param date:
    #     :param val:
    #     :return:
    #     '''
    #     occurredTime= None if (date is '--' or date is None) else date
    #     val=None if (val is '--' or val is None) else val

class ForecastData(EmbeddedDocument):
    # 极大值的24小时观测数组
    forecast_arr = ListField(IntField(default=None))
    heigh_heigh_tide = EmbeddedDocumentField(Extremum)
    heigh_low_tide = EmbeddedDocumentField(Extremum)
    low_heigh_tide = EmbeddedDocumentField(Extremum)
    low_low_tide = EmbeddedDocumentField(Extremum)

class RealData(EmbeddedDocument):
    # 极大值的24小时观测数组
    realdata_arr = ListField(IntField(default=None),default=None)
    heigh_heigh_tide = EmbeddedDocumentField(Extremum)
    heigh_low_tide = EmbeddedDocumentField(Extremum)
    low_heigh_tide = EmbeddedDocumentField(Extremum)
    low_low_tide = EmbeddedDocumentField(Extremum)

class TideData(EmbeddedDocument):
    '''
        测站数据
    '''
    # 极大值的24小时观测数组
    # forecast_arr = ListField(IntField())
    # # 极小值得24小时观测数组
    # realdata_arr = ListField(IntField())
    # 目标日期（年-月-日）
    # 注意此处的目标时间为 datetime（若为date，设置了的时区会没有）
    targetdate=DateTimeField(default=None)
    # targetdate = DateField(default=None)
    forecastdata=EmbeddedDocumentField(ForecastData)
    realdata=EmbeddedDocumentField(RealData)
    # heigh_heigh_tide = EmbeddedDocumentField(Extremum)
    # heigh_low_tide = EmbeddedDocumentField(Extremum)
    # low_heigh_tide = EmbeddedDocumentField(Extremum)
    # low_low_tide = EmbeddedDocumentField(Extremum)


class StationTideData(Document):
    '''
        测站潮位数据
    '''
    # 台风编号
    typhoonnum=StringField()
    # 测站代码
    code = StringField(max_length=10)
    #     起始时间
    startdate = DateTimeField()
    #     测站名称
    stationname = StringField(max_length=10)
    #     gesjon数据
    point = PointField()
    #     平均海平面
    lev = IntField()
    #     警戒潮位
    jw = IntField()
    #     潮汐调和常数
    harmonicconstant = StringField()
    #     潮位数据
    realtidedata = ListField(EmbeddedDocumentField(TideData))
    # tideDataMin = EmbeddedDocumentField(TideData)
    meta={'collection': setting.MONGO_STATIONTIDEDATA_DOCUMENT_NAME}


class GeoTyphoonRealData(Document):
    '''
        支持geojson的存储至mongodb的model
    '''
    code = StringField(max_length=10)
    num = StringField()
    date = DateTimeField()
    bp = FloatField()
    wsm = FloatField()
    # 注意此处与django中的类型不同，django的类型为IntegerField，mongoengine为IntField！
    level = IntField()
    # latlon=models.ForeignKey(Point,on_delete=models.CASCADE)
    latlon = PointField()
    meta = {'collection': 'geotyphoonrealdata'}

    def __str__(self):
        return f'code:{self.code}|num:{self.num}|date:{self.date}|bp:{self.bp}|wsm:{self.wsm}|level:{self.level}|latlon:{self.latlon}'
