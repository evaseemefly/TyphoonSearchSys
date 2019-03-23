from rest_framework import serializers
from .models import *

class PointSerializer(serializers.Serializer):
    '''
        点（经纬度）
    '''
    lat=serializers.FloatField()
    lon=serializers.FloatField()

class GeoTyphoonRealDataSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=10)
    date = serializers.DateTimeField()
    bp = serializers.FloatField()
    wsm = serializers.FloatField()
    level=serializers.IntegerField()
    # TODO [*] 此处序列化会有问题 类型为PointField，可以通过serializers.DictField()的方式序列化，其他符合geojson格式的对象如何序列化？
    latlon = serializers.DictField()

    # latlon = serializers.
