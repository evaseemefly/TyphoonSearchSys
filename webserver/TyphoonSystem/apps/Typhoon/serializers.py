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
    latlon = PointSerializer()
