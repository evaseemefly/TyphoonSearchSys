from datetime import datetime,timedelta
import calendar
import datetime as superdatetime
import dateutil

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import APIView
from django.http import HttpRequest,HttpResponse,JsonResponse
from django.utils.decorators import method_decorator
from mongoengine import *

from TyphoonSystem import settings
from .views_base import BaseView
import json

# 引入mongoengine
# import mongoengineFilterByMonth

# 引入自己的组件
from .models import *
from .serializers import *
from .middle_models import *
from common import dateCommon
from .view_decorator import *



# Create your views here.

class PointInfoView(APIView):
    '''

    '''

    def get(self, request):
        bbxlist = Point.objects.all()
        # Point.objects.
        # json_data=BBXInfoSerializer(bbxlist,many=True)
        # return Response(serialize('json',bbxlist))
        return Response("")
        # pass


class TyphoonRealDataView(APIView):
    def get(self, request):
        code = request.GET.get("code", settings.default_typhoon_code)
        # 根据台风的code获取该台风的气象数据
        # code="MERBOK"
        # 1：使用djongo的实现
        # realtime_list=GeoTyphoonRealData.objects.filter(code=code)

        # 2：使用mongoengine的实现
        realtime_list = GeoTyphoonRealData.objects(code=code)
        json_data = GeoTyphoonRealDataSerializer(realtime_list, many=True).data

        return Response(json_data)


class StationTideDataListView(APIView):
    code = ''
    '''
        根据code以及date获取测站的数据
    '''
    @method_decorator(convert_num2code)
    def get(self, request):
        '''

        :param request:
        :return:
        '''

        '''
            大致步骤：
                1-获取传入date以及code
                2-根据code以及date获取geostationtidedata中的一个 StationTideData（model）
                3-从realdata中获取过程中的极值出现时间以及值
        '''
        # 1- 获取date以及code
        code = request.GET.get("code", settings.DEFAULT_TYPHOON_CODE_BYSTATION)
        self.code = code
        date_str = request.GET.get("date", settings.DEFAULT_TYPHOON_DATE)
        targetdate = dateutil.parser.parse(date_str)
        # targetdate = datetime.datetime.strptime(date_str, '%Y-%m-%d %H:%M')
        print(targetdate)
        # 2- 获取geostationtidedate-> realtidedata
        filter_list = StationTideData.objects(code=code, startdate=targetdate)

        # 2.1找到每一个测站的极值及出现时间
        list_data = []
        for temp in filter_list:
            max_data = self.dataListMax(temp, targetdate)
            list_data.append(StationTideMaxMidModel(temp, max_data))
            # list_data.append(StationTideMidModel(temp,self.getTargetDateRealData(temp,targetdate,days=0)))
            # list_tide.extend()
        json_data = StationTideMaxMidModelSerializer(list_data, many=True).data
        return Response(json_data)

    #  [-] 获取传入的实时数据的返回极值时刻(暂时不实现)
    def dataListMax(self, data: StationTideData, date: datetime.date) -> TideRealMidModel:
        '''
            找到传入的站点的极值（极大值）
        :param data:
        :param date:
        :return: 极大值（TideRealMidModel）
        '''
        # 找到极值
        list = self.getTargetDateRealData(data, date)
        max_data = max(list, key=lambda x: x.val)
        return max_data

    #  [-] 19-04-02 未完成
    def getTargetDateRealData(self, data: StationTideData, date: datetime.date, **kwargs) -> []:
        '''
            根据时间获取该时刻的观测值list
        :param date:
        :return:
        '''
        days = 0
        list_tidedata = []
        if 'days' in kwargs:
            days = int(kwargs.get('days'))
        # index_days = 0
        for temp_realtidedata in data.realtidedata:

            # print(temp_realtidedata.targetdate)
            # print(temp_realtidedata)
            for index, temp_realdata in enumerate(temp_realtidedata.realdata.realdata_arr):
                # print(index)
                # print(temp_realdata)
                temp_datetime = datetime.datetime(temp_realtidedata.targetdate.year, temp_realtidedata.targetdate.month,
                                                  temp_realtidedata.targetdate.day, 0, 0) + datetime.timedelta(
                    hours=index)
                list_tidedata.append(TideRealMidModel(temp_realdata, temp_datetime))

        return list_tidedata


class FilterByMonth(BaseView):
    '''
        根据起始月份进行查询（或改成起止日期）
    '''

    def get(self, request):
        code = request.GET.get("code", settings.default_typhoon_code)
        month = int(request.GET.get("month", "1"))
        list = self.getTyphoonList(code=code, month=month)
        json_data = GeoTyphoonRealDataSerializer(list, many=True).data
        return Response(json_data)
        # pass

    def getTyphoonList(self, *args, **kwargs):
        '''
            根据code以及month查询台风路径信息
        :param args:
        :param kwargs:
        :return:
        '''
        code = kwargs.get('code', "")
        month = kwargs.get('month', datetime.now().month)
        # TODO [*]此处存在的问题不能使用django的xxx__month的方式直接按照月份去过滤
        # return GeoTyphoonRealData.objects.filter(code=code,date__month=6)
        return GeoTyphoonRealData.objects.filter(code=code, date__lte=datetime.now())


class FilterByYear(BaseView):
    '''
        根据年份进行查询
    '''

    def get(self, request):
        # TODO [-]优先完成此部分
        code = request.GET.get('code')
        year = request.GET.get('year', datetime.now().year)
        list = self.getTyphoonList(year=year, code=code)
        json_data = GeoTyphoonRealDataSerializer(list, many=True).data
        return Response(json_data)

    def getTyphoonList(self, *args, **kwargs):
        '''
            根据code以及month查询台风路径信息
        :param args:
        :param kwargs:
        :return:
        '''
        code = kwargs.get('code', "")
        year = kwargs.get('year')
        # 获取起止日期
        start, end = dateCommon.getYearDateRange(year)
        # TODO [-]此处改为使用mongoengine的方式进行查询
        return GeoTyphoonRealData.objects(date__lte=end) if code == "" else GeoTyphoonRealData.objects(code=code,
                                                                                                       date__lte=end)
        # return GeoTyphoonRealData.objects.filter(code=code,date__lte=end,date__gte=start)
        # return GeoTyphoonRealData.objects(code=code, date__lte=end)
        # return GeoTyphoonRealData.objects.filter(code=code, date__gte=start)


class FilterByRange(BaseView):
    '''
        根据经纬度[lat,lon]以及range 返回在指定范围内的台风编号
    '''

    def get(self, request):
        # TODO [-]优先完成此部分 对于第一种传输组的方式
        # latlon=request.GET.get('latlon')
        # TODO 注意python3开始，map返回的是一个迭代器，不是list，需要手动转一下
        # latlons=list(map(lambda x:float(x),latlon.split(',')))
        # TODO [-] 使用此种方式接收

        latlons = request.GET.getlist('latlon[]')
        # 处理后的latlong=[lat,lon]
        latlons = list(map(lambda x: float(x), latlons))

        range = int(request.GET.get('range'))


        # 获取去重后的code list
        codes = self.getTyphoonList(latlon=latlons, range=range)
        # TODO [*] 19-04-01根据code list，获取该code对应的code以及startdate
        # list_data = [GeoTyphoonRealData.objects(code=code)[:1].code
        # for code in codes]

        # list_data = []
        # for code in codes:
        #     list_data.append(TyphoonModel(GeoTyphoonRealData.objects(code=code)[0].code,GeoTyphoonRealData.objects(code=code)[0].date))

        #
        # 使用列表推导
        list_data = [
            TyphoonModel(GeoTyphoonRealData.objects(code=code)[0].code, GeoTyphoonRealData.objects(code=code)[0].date)
            for code in codes]
        json_data = TyphoonModelSerializer(list_data, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)

    def getTyphoonList(self, *args, **kwargs):
        '''
            根据code以及month查询台风路径信息
        :param args:
        :param kwargs:
        :return:
        '''
        latlon = kwargs.get('latlon')
        range = kwargs.get('range')

        return GeoTyphoonRealData.objects(latlon__near=latlon[::-1],latlon__max_distance=range).distinct('code')


class FilterByComplexCondition(BaseView):
    '''
    复杂条件查询 风速，级别，气压
    测试url:
    http://127.0.0.1:8000/gis/filter/complex/?bp=1006
    http://127.0.0.1:8000/gis/filter/complex/?bp=1006&wsm=13&level=1
    '''
    def get(self,request):
        level = request.GET.get('level')
        wsm = request.GET.get('wsm')
        bp = request.GET.get('bp')
        startMonth = request.GET.get('startMonth')
        endMonth = request.GET.get('endMonth')
        query = GeoTyphoonRealData.objects()

        if level is not None and level != '':
            query = query.filter(level=level)
        if wsm is not None and wsm != '':
            query = query.filter(wsm=wsm)
        if bp is not None and bp != '':
            query = query.filter(bp=bp)
        if startMonth is not None and startMonth != '':
            start_date = startMonth + '-01 00:00:00'
            stime = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
            query = query.filter(date__gte=stime)
        if endMonth is not None and endMonth != '':
            end_date = datetime.datetime.strptime(endMonth, '%Y-%m')
            end_date = add_months(end_date, 1)
            etime = end_date + timedelta(seconds=-1)
            query = query.filter(date__lte=etime)


        json_data = GeoTyphoonRealDataSerializer(query, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)



class FilterByDateRange(BaseView):
    '''
    根据传过来的月份区间查找台风数据 类似2019-03 2019-03
    测试url:
    http://127.0.0.1:8000/gis/filter/daterange/?startdate=2017-11&enddate=2017-12
    '''
    def get(self, request):
        start_date = request.GET.get("startdate")
        end_date = request.GET.get("enddate")
        query = GeoTyphoonRealData.objects()
        if start_date is not None:
            start_date=start_date+'-01 00:00:00'
            stime = datetime.strptime(start_date,"%Y-%m-%d %H:%M:%S")
            query = query.filter(date__gte=stime)
        if end_date is not None:
            end_date = datetime.strptime(end_date,'%Y-%m')
            end_date=add_months(end_date,1)
            etime=end_date+timedelta(seconds=-1)
            query = query.filter(date__lte=etime)
        json_data = GeoTyphoonRealDataSerializer(query, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)


def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year,month)[1])
    return superdatetime.date(year, month, day)