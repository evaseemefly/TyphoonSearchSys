from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import APIView

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
        realtime_list=GeoTyphoonRealData.objects.all()
        json_data = GeoTyphoonRealDataSerializer(realtime_list, many=True).data
        # json_data=json.dump(realtime_list.data)
        return Response(json_data)