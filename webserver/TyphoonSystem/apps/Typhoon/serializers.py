from rest_framework import serializers
from .models import *


class PointSerializer(serializers.Serializer):
    '''
        点（经纬度）
    '''
    lat = serializers.FloatField()
    lon = serializers.FloatField()


class GeoTyphoonRealDataSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=10)
    date = serializers.DateTimeField()
    num = serializers.CharField()
    bp = serializers.FloatField()
    wsm = serializers.FloatField()
    level = serializers.IntegerField()
    # TODO [-] 此处序列化会有问题 类型为PointField，可以通过serializers.DictField()的方式序列化，其他符合geojson格式的对象如何序列化？
    latlon = serializers.DictField()


class TyphoonModelSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=10)
    year = serializers.IntegerField()
    num = serializers.CharField(required=False)


class TyphoonAndTotalModelSerializer(serializers.Serializer):
    # TODO [-] 注意对于嵌套的对象数组，不要使用serializers.list
    list = TyphoonModelSerializer(many=True)
    total = serializers.IntegerField()


class DisasterWordModelSerializer(serializers.Serializer):
    '''
        灾情word的序列化对象
    '''
    code = serializers.CharField()
    wordDocument = serializers.CharField()


class StationTideDataModelSerializer(serializers.Serializer):
    '''
        测站潮位数据
    '''
    # 测站代码
    code = serializers.CharField()
    #     起始时间
    startdate = serializers.DateTimeField()
    #     测站名称
    stationname = serializers.CharField()
    #     gesjon数据
    point = serializers.DictField()
    #     平均海平面
    lev = serializers.IntegerField()
    #     警戒潮位
    jw = serializers.IntegerField()
    #     潮汐调和常数
    harmonicconstant = serializers.CharField()


class TideRealMidModelSerializer(serializers.Serializer):
    '''
        暂时不再使用，由 TideAllMidModelSerializer 替代
    '''
    val = serializers.IntegerField()
    occurred = serializers.DateTimeField()


class TideAllMidModelSerializer(serializers.Serializer):
    val_forecast = serializers.IntegerField()
    val_real = serializers.IntegerField()
    occurred = serializers.DateTimeField()


# class TideRealMidModelSerializer(serializers.Serializer):
#     val = serializers.IntegerField()
#     occurred = serializers.DateTimeField()

class StationTideMidModelSerializer(serializers.Serializer):
    station = StationTideDataModelSerializer()
    tide_arr = TideRealMidModelSerializer(many=True)


class StationTideMaxMidModelSerializer(serializers.Serializer):
    station = StationTideDataModelSerializer()
    tide = TideRealMidModelSerializer()


class StationTideIncludeForecastMidModelSerializer(serializers.Serializer):
    '''
        StationTideIncludeForecastMidModel
        暂时不使用，由 StationTideIncludeAllMidModelSerializer 替代
    '''
    station = StationTideDataModelSerializer()
    forecast = TideRealMidModelSerializer()


class StationTideIncludeAllMidModelSerializer(serializers.Serializer):
    '''
        StationTideIncludeForecastMidModel
    '''
    station = StationTideDataModelSerializer()
    forecast = TideAllMidModelSerializer()
