from mongoengine import *

class Extremum(EmbeddedDocument):
    '''
        极值
    '''
    occurredTime = DateTimeField()
    val = IntField()


class TideData(EmbeddedDocument):
    '''
        测站数据
    '''
    # 极大值的24小时观测数组
    forecast_arr = ListField(IntField())
    # 极小值得24小时观测数组
    realdata_arr = ListField(IntField())
    # 目标日期（年-月-日）
    #     targetdate=DateTimeField()
    targetdate = DateField()
    heigh_heigh_tide = EmbeddedDocumentField(Extremum)
    heigh_low_tide = EmbeddedDocumentField(Extremum)
    low_heigh_tide = EmbeddedDocumentField(Extremum)
    low_low_tide = EmbeddedDocumentField(Extremum)


class StationTideData(Document):
    '''
        测站潮位数据
    '''
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