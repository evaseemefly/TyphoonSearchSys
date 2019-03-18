from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import APIView

from TyphoonSystem import settings
import json

from .models import Point,GeoTyphoonRealData
from .serializers import *
# Create your views here.

class PointInfoView(APIView):
    '''

    '''
    def get(self,request):
        bbxlist=Point.objects.all()
        # Point.objects.
        # json_data=BBXInfoSerializer(bbxlist,many=True)
        # return Response(serialize('json',bbxlist))
        return Response("")
        # pass

class TyphoonRealDataView(APIView):
    def get(self,request):
        code=request.GET.get("code",settings.default_typhoon_code)
        # 根据台风的code获取该台风的气象数据
        # code="MERBOK"
        # realtime_list=GeoTyphoonRealData.objects.all()
        realtime_list=GeoTyphoonRealData.objects.filter(code=code)
        json_data = GeoTyphoonRealDataSerializer(realtime_list, many=True).data
        # json_data=json.dump(realtime_list.data)
        return Response(json_data)

class FilterByMonth(APIView):
    '''
        根据起始月份进行查询（或改成起止日期）
    '''
    def get(self,request):

        pass

class FilterByYear(APIView):
    '''
        根据年份进行查询
    '''
    def get(self,request):
        pass

class FilterByRange(APIView):
    '''
        根据
    '''
    def get(self,request):
        pass
