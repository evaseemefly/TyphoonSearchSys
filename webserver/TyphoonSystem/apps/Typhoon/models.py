from django.db import models
# from djangotoolbox.fields import ListField,EmbeddedModelField
# from django_mongodb_engine.contrib import MongoDBManager
# from mongoengine import Document, EmbeddedDocument, fields
# 使用djongo
from djongo import models

# 引入mongoengine
from mongoengine import *
# Create your models here.

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
    lat=FloatField()
    lon=FloatField()

class GeoTyphoonRealData(Document):
    '''
        支持geojson的存储至mongodb的model
    '''
    code=StringField(max_length=10)
    date=DateTimeField()
    level=IntField()
    bp=FloatField()
    wsm=FloatField()
    latlon=EmbeddedDocumentField(Point)
    meta={
        'collection':'Typhoon_geotyphoonrealdata'
    }
    # object=MongoDBManager()

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