from django.db import models
# from djangotoolbox.fields import ListField,EmbeddedModelField
# from django_mongodb_engine.contrib import MongoDBManager
# from mongoengine import Document, EmbeddedDocument, fields
# 使用djongo
# from djongo import models

# 引入mongoengine
from mongoengine import *
# Create your models here.
from TyphoonSystem import settings


# class TyphoonBaseInfo(models.Model):
#     '''
#         台风基础信息
#     '''
#
#     id=models.AutoField(primary_key=True)
#
# 实现方式1：使用mongoengine
class Point(EmbeddedDocument):
    '''
        点（经纬度）
    '''
    lat = FloatField()
    lon = FloatField()


# class GeoTyphoonRealData(Document):
#     '''
#         支持geojson的存储至mongodb的model
#     '''
#     code = StringField(max_length=10)
#     date = DateTimeField()
#     bp = FloatField()
#     wsm = FloatField()
#     # 注意此处与django中的类型不同，django的类型为IntegerField，mongoengine为IntField！
#     level = IntField()
#     # latlon=models.ForeignKey(Point,on_delete=models.CASCADE)
#     latlon = PointField()
#     meta = {'collection': 'geotyphoonrealdata'}
#     # object=MongoDBManager()
# TODO [-] 19-04-05 加入了num（台风编号——数字）
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


class Extremum(EmbeddedDocument):
    '''
        极值
    '''
    occurredTime = DateTimeField(required=False, default=None)
    val = IntField(required=False, default=None)

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
    realdata_arr = ListField(IntField(default=None), default=None)
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
    #     targetdate=DateTimeField()
    # TODO:[-] 注意此处的类型不再是date而是datetime！！注意
    targetdate = DateTimeField(default=None)
    forecastdata = EmbeddedDocumentField(ForecastData)
    realdata = EmbeddedDocumentField(RealData)
    # heigh_heigh_tide = EmbeddedDocumentField(Extremum)
    # heigh_low_tide = EmbeddedDocumentField(Extremum)
    # low_heigh_tide = EmbeddedDocumentField(Extremum)
    # low_low_tide = EmbeddedDocumentField(Extremum)


class StationTideData(Document):
    '''
        测站潮位数据
    '''
    # 台风编号
    typhoonnum = StringField()
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
    meta = {'collection': settings.MONGO_STATIONTIDEDATA_DOCUMENT_NAME}

    def __str__(self):
        return f'code:{self.code}|startdate:{self.startdate}|stationname:{self.stationname}|point:{self.point}|lev:{self.lev}|jw:{self.jw}|harmonicconstant:{self.harmonicconstant}'
# 实现方式2：使用djongo
# class Point(models.Model):
#     '''
#         点（经纬度）
#     '''
#     lat=models.FloatField()
#     lon=models.FloatField()
#     class Meta:
#         abstract=True
#
# class GeoTyphoonRealData(models.Model):
#     '''
#         支持geojson的存储至mongodb的model
#     '''
#
#     code=models.CharField(max_length=10)
#     date=models.DateTimeField()
#     level=models.IntegerField()
#     bp=models.FloatField()
#     wsm=models.FloatField()
#     # latlon=models.ForeignKey(Point,on_delete=models.CASCADE)
#     latlon=models.EmbeddedModelField(model_container=Point,)
#     # object=MongoDBManager()

class DisasterWordInfo(Document):
    '''
        灾情word描述信息
    '''
    # 台风code
    code=StringField(max_length=20)
    # word内容
    wordDocument=StringField()

    meta={
        'collection':'disasterword'
    }

class TyphoonNumChDictData(Document):
    '''
        台风名称对照表
    '''
    # 台风英文名称
    code = StringField(max_length=10)
    # 台风编号
    num = StringField()
    # 台风对应中文名字
    chname = StringField(max_length=50)
    meta = {'collection': 'typhoonnumchdict'}

class StationNameDict(Document):
    '''
        测站名称对照表
    '''
    name = StringField()
    chname = StringField()

    meta = {'collection': 'stationnamedict'}