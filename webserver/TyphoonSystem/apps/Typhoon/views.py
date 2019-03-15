from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import APIView
from .models import Point
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