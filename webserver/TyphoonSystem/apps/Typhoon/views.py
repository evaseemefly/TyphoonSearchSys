from datetime import datetime, timedelta, date
import calendar
import datetime as superdatetime
import dateutil
import abc

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import APIView
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from mongoengine import *

from TyphoonSystem import settings
from .views_base import BaseView, BaseDetailListView
import json

# 引入mongoengine
# import mongoengineFilterByMonth
from mongoengine.queryset.visitor import Q

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
        num = request.GET.get("num", settings.default_typhoon_code)
        # 根据台风的code获取该台风的气象数据
        # code="MERBOK"
        # 1：使用djongo的实现
        # realtime_list=GeoTyphoonRealData.objects.filter(code=code)

        # 2：使用mongoengine的实现
        realtime_list = GeoTyphoonRealData.objects(num=num)
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
        # print(targetdate)
        # print(code)
        # 2- 获取geostationtidedate-> realtidedata
        # filter_list = StationTideData.objects(code=code, startdate=targetdate)
        filter_list = self.getStationTargetRealData(targetdate, code)

        # TODO 暂时不再使用（19-04-10） 2.1找到每一个测站的极值及出现时间
        # list_data = []
        # for temp in filter_list:
        #     max_data = self.dataListMax(temp, targetdate)
        #     list_data.append(StationTideMaxMidModel(temp, max_data))
        #     # list_data.append(StationTideMidModel(temp,self.getTargetDateRealData(temp,targetdate,days=0)))
        #     # list_tide.extend()
        # json_data = StationTideMaxMidModelSerializer(list_data, many=True).data

        # json_data=StationTideIncludeForecastMidModelSerializer(filter_list,many=True).data
        json_data = StationTideIncludeAllMidModelSerializer(filter_list, many=True).data
        return Response(json_data)

    def getStationTargetRealData(self, targetdatetime: datetime, code: str) -> []:
        '''
            根据时间获取该时间该台风的测站数据
        :param date:
        :return:
        '''
        # 找到当天的数据
        targetdate = date(targetdatetime.year, targetdatetime.month, targetdatetime.day)
        list = StationTideData.objects(typhoonnum=code)

        # 从返回的测站数据中找到对应的时刻
        def getTargetMoment(moment: datetime, realdate: StationTideData) -> StationTideAllDataMidModel:
            '''
                根据指定时刻，从当前的测站数据中找到对应时刻的观测值
            :param moment:
            :param realdate:
            :return:
            '''

            '''
                思路：
                    
            '''
            date_moment = date(moment.year, moment.month, moment.day)
            hour_moment = moment.hour
            datetime_moment = datetime(moment.year, moment.month, moment.day, moment.hour, 0)
            temp_realtidedata = [temp for temp in realdate.realtidedata if temp.targetdate == date_moment]
            # temp_forecasttidedata=[temp for temp in realdate.forecastdata if temp.targetdate==date_moment]
            if len(temp_realtidedata) > 0:
                # TODO 19-04-11 此处修改
                return StationTideAllDataMidModel(
                    temp_realtidedata[0].forecastdata.forecast_arr[hour_moment],
                    temp_realtidedata[0].realdata.realdata_arr[hour_moment],
                    datetime_moment
                )
                # return StationTideForecastMidModel(temp_realtidedata[0].forecastdata.forecast_arr[hour_moment],datetime_moment)
                # return temp_realtidedata[0].forecastdata.forecast_arr[hour_moment]
            else:
                return None

        list_StationForecast = []
        if len(list) > 0:
            for temp in list:
                list_StationForecast.append(
                    StationTideIncludeForecastMidModel(temp, getTargetMoment(targetdatetime, temp)))
                # print(getTargetMoment(targetdatetime,temp))
                # print(temp)
        return list_StationForecast

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

    #  TODO [-] 19-04-02 未完成
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


class IStationDetail(abc.ABC):
    def toSerialize(self, code: str, stationname: str, num: str, type: str):
        data_list = self.load(code, stationname, num)
        switch = {
            0: TideRealMidModelSerializer,
            2: TideAllMidModelSerializer
        }
        return switch[type](data_list, many=True)
        # return TideRealMidModelSerializer(data_list, many=True)

    @abc.abstractmethod
    def load(self, code: str, stationname: str, num: str):
        pass


class StationDetailMinList(IStationDetail):
    def load(self, code: str, stationname: str, num: str):
        '''
            根据台风code以及海洋站station name加载连续的测值
        :param code:
        :param stationname:
        :return:
        '''

        '''
            根据code以及station 从 geostationtidedata中取出对应的全部数据
        '''
        data_list = []
        # [realtide_temp
        #  for realtide_temp in
        #  StationTideData.objects(code=code,stationname=stationname)[0].realtidedata]
        # import datetime
        for realtide_temp in StationTideData.objects(code=code, typhoonnum=num, stationname=stationname)[
            0].realtidedata:
            # for realtide_temp in StationTideData.objects(typhoonnum=num, stationname=stationname)[
            #     0].realtidedata:
            if hasattr(realtide_temp, 'realdata') and hasattr(realtide_temp, 'targetdate') and hasattr(realtide_temp,
                                                                                                       'forecastdata'):
                # 提取每一日的realdata
                # for realdata_temp in realtide_temp.realdata:
                if hasattr(realtide_temp.realdata, 'realdata_arr') and hasattr(realtide_temp.forecastdata,
                                                                               'forecast_arr'):
                    for index, temp in enumerate(
                            zip(realtide_temp.realdata.realdata_arr, realtide_temp.forecastdata.forecast_arr)):
                        # for index, temp in enumerate(realtide_temp.realdata.realdata_arr) :
                        # temp_datetime = realtide_temp.targetdate + datetime.timedelta(hours=index)
                        # TODO date-> datetime 方式1：
                        # temp_datetime=datetime(temp.targetdate.year,temp.targetdate.month,temp.targetdate.day,index,0)
                        # TODO date-> datetime 方式2：
                        import datetime
                        # TODO [-] 19-04-25 temp[0] 为real temp[1] 为forecast
                        # 需要判断是否没有-9999若存在-9999，则直接返回-9999
                        if temp[0] == -9999 or temp[1] == -9999:
                            temp_tide = StationTideRealMidModel(-9999, temp_datetime)
                        else:
                            temp_datetime = datetime.datetime.combine(realtide_temp.targetdate, datetime.time(index, 0))
                            # real-forecast 为实际的潮差
                            # TODO:[-] 19-05-28 注意此处之前录入的有问题，此处实际为forecast-real(forecast与real的录入录反了)
                            # temp_tide = StationTideRealMidModel(temp[0] - temp[1], temp_datetime)
                            temp_tide = StationTideRealMidModel(temp[1] - temp[0], temp_datetime)
                        data_list.append(temp_tide)
                        # print(str(temp_tide))
            # print(realtide_temp)
        return data_list
        pass


class StationDetailAllList(IStationDetail):
    def load(self, code: str, stationname: str, num: str):
        '''
            根据台风code以及海洋站station name加载连续的测值
        :param code:
        :param stationname:
        :return:
        '''

        '''
            根据code以及station 从 geostationtidedata中取出对应的全部数据
        '''
        data_list = []
        # [realtide_temp
        #  for realtide_temp in
        #  StationTideData.objects(code=code,stationname=stationname)[0].realtidedata]
        # import datetime
        for realtide_temp in StationTideData.objects(typhoonnum=num, stationname=stationname)[
            0].realtidedata:
            # for realtide_temp in StationTideData.objects(typhoonnum=num, stationname=stationname)[
            #     0].realtidedata:
            if hasattr(realtide_temp, 'realdata') and hasattr(realtide_temp, 'targetdate') and hasattr(
                    realtide_temp,
                    'forecastdata'):
                # 提取每一日的realdata
                # for realdata_temp in realtide_temp.realdata:
                if hasattr(realtide_temp.realdata, 'realdata_arr') and hasattr(realtide_temp.forecastdata,
                                                                               'forecast_arr'):
                    for index, temp in enumerate(
                            zip(realtide_temp.realdata.realdata_arr, realtide_temp.forecastdata.forecast_arr)):
                        # for index, temp in enumerate(realtide_temp.realdata.realdata_arr) :
                        # temp_datetime = realtide_temp.targetdate + datetime.timedelta(hours=index)
                        # TODO date-> datetime 方式1：
                        # temp_datetime=datetime(temp.targetdate.year,temp.targetdate.month,temp.targetdate.day,index,0)
                        # TODO date-> datetime 方式2：
                        import datetime
                        # TODO [-] 19-04-25 temp[0] 为real temp[1] 为forecast
                        # 需要判断是否没有-9999若存在-9999，则直接返回-9999
                        if temp[0] == -9999 or temp[1] == -9999:
                            temp_tide = StationTideRealMidModel(-9999, temp_datetime)
                        else:
                            temp_datetime = datetime.datetime.combine(realtide_temp.targetdate,
                                                                      datetime.time(index, 0))
                            # real-forecast 为实际的潮差
                            # TODO:[-] 19-05-28 注意此处之前录入的有问题，此处实际为forecast-real(forecast与real的录入录反了)
                            # temp_tide = StationTideRealMidModel(temp[0] - temp[1], temp_datetime)
                            temp_tide = StationTideAllDataMidModel(temp[0], temp[1], temp_datetime)
                        data_list.append(temp_tide)
        return data_list


class StationDetailListView(APIView):
    '''
        根据传入的 台风 code 以及 海洋站 name
        返回该过程中的该测站的连续观测值
    '''

    def get(self, request):
        code = request.GET.get('code')
        name = request.GET.get('name')
        num = request.GET.get('num')
        type = int(request.GET.get('type', '0'))
        switch = {
            0: StationDetailMinList,
            2: StationDetailAllList
        }
        data_json = switch[type]().toSerialize(code, name, num, type)
        # data_json = self.toSerialize(code, name, num, type)
        # data_list = self.load(code, name, num)
        # data_json = TideRealMidModelSerializer(data_list, many=True)
        return Response(data_json.data)
        # pass

    # def get(self, request):
    #     code = request.GET.get('code')
    #     name = request.GET.get('name')
    #     num = request.GET.get('num')
    #     data_list = self.load(code, name, num)
    #     data_json = TideRealMidModelSerializer(data_list, many=True)
    #     return Response(data_json.data)
    #     # pass
    #
    # def load(self, code: str, stationname: str, num: str):
    #     '''
    #         根据台风code以及海洋站station name加载连续的测值
    #     :param code:
    #     :param stationname:
    #     :return:
    #     '''
    #
    #     '''
    #         根据code以及station 从 geostationtidedata中取出对应的全部数据
    #     '''
    #     data_list = []
    #     # [realtide_temp
    #     #  for realtide_temp in
    #     #  StationTideData.objects(code=code,stationname=stationname)[0].realtidedata]
    #     # import datetime
    #     for realtide_temp in StationTideData.objects(code=code, typhoonnum=num, stationname=stationname)[
    #         0].realtidedata:
    #         # for realtide_temp in StationTideData.objects(typhoonnum=num, stationname=stationname)[
    #         #     0].realtidedata:
    #         if hasattr(realtide_temp, 'realdata') and hasattr(realtide_temp, 'targetdate') and hasattr(realtide_temp,
    #                                                                                                    'forecastdata'):
    #             # 提取每一日的realdata
    #             # for realdata_temp in realtide_temp.realdata:
    #             if hasattr(realtide_temp.realdata, 'realdata_arr') and hasattr(realtide_temp.forecastdata,
    #                                                                            'forecast_arr'):
    #                 for index, temp in enumerate(
    #                         zip(realtide_temp.realdata.realdata_arr, realtide_temp.forecastdata.forecast_arr)):
    #                     # for index, temp in enumerate(realtide_temp.realdata.realdata_arr) :
    #                     # temp_datetime = realtide_temp.targetdate + datetime.timedelta(hours=index)
    #                     # TODO date-> datetime 方式1：
    #                     # temp_datetime=datetime(temp.targetdate.year,temp.targetdate.month,temp.targetdate.day,index,0)
    #                     # TODO date-> datetime 方式2：
    #                     import datetime
    #                     # TODO [-] 19-04-25 temp[0] 为real temp[1] 为forecast
    #                     # 需要判断是否没有-9999若存在-9999，则直接返回-9999
    #                     if temp[0] == -9999 or temp[1] == -9999:
    #                         temp_tide = StationTideRealMidModel(-9999, temp_datetime)
    #                     else:
    #                         temp_datetime = datetime.datetime.combine(realtide_temp.targetdate, datetime.time(index, 0))
    #                         # real-forecast 为实际的潮差
    #                         # TODO:[-] 19-05-28 注意此处之前录入的有问题，此处实际为forecast-real(forecast与real的录入录反了)
    #                         # temp_tide = StationTideRealMidModel(temp[0] - temp[1], temp_datetime)
    #                         temp_tide = StationTideRealMidModel(temp[1] - temp[0], temp_datetime)
    #                     data_list.append(temp_tide)
    #                     # print(str(temp_tide))
    #         # print(realtide_temp)
    #     return data_list
    #     pass
    #


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

        # 获取index与count
        index = int(request.GET.get('index'))
        size = int(request.GET.get('size'))
        start_index = (index * size)
        finish_index = (index * size + size)
        # 获取去重后的code list
        nums = self.getTyphoonList(latlon=latlons, range=range)
        total = len(nums)
        codes = nums[start_index:finish_index]
        # TODO [*] 19-04-01根据code list，获取该code对应的code以及startdate
        # list_data = [GeoTyphoonRealData.objects(code=code)[:1].code
        # for code in codes]

        # list_data = []
        # for code in codes:
        #     list_data.append(TyphoonModel(GeoTyphoonRealData.objects(code=code)[0].code,GeoTyphoonRealData.objects(code=code)[0].date))

        #
        # 使用列表推导
        # list_data = [
        #     TyphoonModel(GeoTyphoonRealData.objects(num=num)[0].code, GeoTyphoonRealData.objects(num=num)[0].date,GeoTyphoonRealData.objects(num=num)[0].num)
        #     for num in nums]
        tup_python_name = ('nameless', '(nameless)')
        list_data = []
        for num in codes:
            obj = GeoTyphoonRealData.objects(num=num)[0]
            if obj.code not in tup_python_name:
                list_data.append(TyphoonModel(obj.code, obj.date, obj.num))
        # TODO:[*] 19-05-13 返回的加入total
        data = TyphoonAndTotalModel(list_data, total)
        json_data = TyphoonAndTotalModelSerializer(data).data
        # json_data = TyphoonModelSerializer(list_data, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)

    def sort(self, list_num) -> []:
        list_num = sorted(list_num)
        # 找到头两位是小于当前时间的的年份
        index_year = int(str(datetime.now().year)[2:])
        list_newcentury = []
        list_old = []
        list_newcentury = [temp for temp in list_num if (int(temp[:2]) < index_year and int(temp[:2]) > 00)]
        # list_newcentury=
        list_old = list_num[len(list_newcentury) + 2:]
        list_final = list_old + list_newcentury
        return list_final
        # pass

    def getTyphoonList(self, *args, **kwargs):
        '''
            根据code以及month查询台风路径信息
        :param args:
        :param kwargs:
        :return:
        '''
        latlon = kwargs.get('latlon')
        range = kwargs.get('range')
        # 注意此处去重是要根据 num 进行去重
        return self.sort(
            GeoTyphoonRealData.objects(latlon__near=latlon[::-1], latlon__max_distance=range).distinct('num'))


class FilterByComplexCondition(BaseView):
    '''
    复杂条件查询 风速，级别，气压
    测试url:
    http://127.0.0.1:8000/gis/filter/complex/?bp=1006
    http://127.0.0.1:8000/gis/filter/complex/?bp=1006&wsm=13&level=1
    '''

    def get(self, request):
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


class GetTyphoonCodeByComplexCondition(BaseView):
    '''
    复杂条件查询 风速，级别，气压
    http://127.0.0.1:8000/gis/filter/complex/?bp=1006&wsm=13&level=1
    '''

    def get(self, request):
        level = request.GET.get('level')
        wsm = request.GET.get('wsm')
        bp = request.GET.get('bp')
        num = request.GET.get('num')
        startMonth = request.GET.get('startMonth')
        endMonth = request.GET.get('endMonth')
        fromP = request.GET.get('from')
        toP = request.GET.get('to')

        query = GeoTyphoonRealData.objects()

        if level is not None and level != '':
            query = query.filter(level=level)
        if wsm is not None and wsm != '':
            query = query.filter(wsm=wsm)
        if num is not None and num != '':
            query = query.filter(num=num)
        if bp is not None and bp != '':
            query = query.filter(bp=bp)
        if startMonth is not None and startMonth != '':
            start_date = startMonth + '-01 00:00:00'
            stime = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
            query = query.filter(date__gte=stime)
        if endMonth is not None and endMonth != '':
            end_date = datetime.strptime(endMonth, '%Y-%m')
            end_date = add_months(end_date, 1)
            etime = end_date + timedelta(seconds=-1)
            query = query.filter(date__lte=etime)

        try:
            fromP = int(fromP)
        except Exception as e:
            fromP = 0

        try:
            toP = int(toP)
        except:
            toP = 0

        query = query.filter(code__ne='(nameless)')
        # TODO:[-] 19-05-22 注意此处必须根据台风编号去重（num），因为code有可能有重复的！！！
        query = query.distinct('num')
        total = len(query)
        query = query[fromP:toP]
        # TODO [*] 19-05-05 由于前台需要的是code以及num，所以需要根据code获取到geoTyphoonRealData类型的列表，并序列化返回
        #  以下注释部分 -by zw
        # total = len(query)
        # query = query[fromP:toP]
        #
        # result = {'total':total,'data':query}
        # return Response(result)
        # 因为返回的都是code，此部分只是多了一个year，暂时可以去掉
        list_data = [
            TyphoonModel(GeoTyphoonRealData.objects(num=num)[0].code, GeoTyphoonRealData.objects(num=num)[0].date,
                         GeoTyphoonRealData.objects(num=num)[0].num)
            for num in query]

        json_data = TyphoonAndTotalModelSerializer(TyphoonAndTotalModel(list_data, total)).data
        # json_data = TyphoonModelSerializer(list_data, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)


class GetTimeByCode(BaseView):
    '''
        根据传入的code以及num获取指定的台风的时间列表并返回
    '''

    def get(self, request):
        code = request.GET.get('code')
        fromP = request.GET.get('from')
        toP = request.GET.get('to')
        num = request.GET.get('num')

        query = GeoTyphoonRealData.objects()
        query = query.filter(code=code, num=num)

        try:
            fromP = int(fromP)
        except Exception as e:
            fromP = 0

        try:
            toP = int(toP)
        except:
            toP = 0

        query = query.aggregate({"$project": {"dt": {"$dateToString": {"format": "%Y-%m-%d %H", "date": "$date"}}}},
                                {"$group": {"_id": "$dt"}}, {"$sort": {"_id": 1}})
        lst = list(query)
        total = len(lst)
        lst = lst[fromP:toP]
        print(code)
        result = {'total': total, 'data': lst}
        return Response(result)


class GetDetail(BaseView):
    '''
    '''

    def get(self, request):
        code = request.GET.get('code')
        dateH = request.GET.get('date')
        dts = datetime.strptime(dateH, '%Y-%m-%d %H')
        dte = dts + timedelta(hours=1, seconds=-1)
        dte = dte.isoformat() + ".000+00:00"
        dts = dts.isoformat() + ".000+00:00"
        query = GeoTyphoonRealData.objects()
        query = query.all().filter(Q(code=code) & Q(date__gte=dts) & Q(date__lte=dte))
        print(dts, dte)
        json_data = GeoTyphoonRealDataSerializer(query, many=True).data
        return Response(json_data)


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
            start_date = start_date + '-01 00:00:00'
            stime = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
            query = query.filter(date__gte=stime)
        if end_date is not None:
            end_date = datetime.strptime(end_date, '%Y-%m')
            end_date = add_months(end_date, 1)
            etime = end_date + timedelta(seconds=-1)
            query = query.filter(date__lte=etime)
        json_data = GeoTyphoonRealDataSerializer(query, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)


def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year, month)[1])
    return superdatetime.date(year, month, day)


class DisasterWordView(APIView):
    def get(self, request):
        code = '5622'
        query = DisasterWordInfo.objects(code=code)
        json_data = DisasterWordModelSerializer(query, many=True).data
        return Response(json_data)
        # pass


# 获取所有台风年份
class GetAllTyphoonYear(APIView):
    def get(self, request):
        query = GeoTyphoonRealData.objects()
        query = query.aggregate(
            {"$group": {"_id": "null", "years": {"$addToSet": {"$dateToString": {"format": "%Y", "date": "$date"}}}}})
        lst = list(query)
        return Response(lst)


# 获取所有台风编号
# 这个写死了需要修改
class GetAllTyphoonCode(APIView):
    def get(self, request):
        year = request.GET.get("year")
        try:
            start_date = datetime.strptime(year + "-01-01 00:00:00", "%Y-%m-%d %H:%M:%S").isoformat() + '.000+00:00'
            end_date = datetime.strptime(year + "-12-31 11:59:59", "%Y-%m-%d %H:%M:%S").isoformat() + '.000+00:00'
            query = GeoTyphoonRealData.objects().filter(date__gte=start_date).filter(date__lte=end_date).filter(
                num__ne="0000")
            query = query.values_list("code", "num")
            return Response(query)
        except Exception as e:
            return Response([])


# 时间筛选需要修改，不认小时分的
class GetAllObsStationCode(APIView):
    def get(self, request):
        year = request.GET.get("year")
        code = request.GET.get("code")
        try:
            start_date = datetime.strptime(year + "-01-01 00:00:00", "%Y-%m-%d %H:%M:%S").isoformat() + '.000+00:00'
            end_date = datetime.strptime(year + "-12-31 11:59:59", "%Y-%m-%d %H:%M:%S").isoformat() + '.000+00:00'
            query = StationTideData.objects()
            query = query.filter(typhoonnum=code)
            query = query.filter(startdate__gte=start_date)
            query = query.filter(startdate__lte=end_date)
            result = query.distinct('code')
            lst = list(result)
            return Response(lst)
        except Exception as e:
            return Response([])


# 时间筛选需要修改，不认小时分的
# 返回的是station的相关数据（包含警戒潮位与等信息）！！注意不包含台风最大气压以及最大风速的值
class GetStationObserveData(APIView):
    def get(self, request):
        year = request.GET.get("year")
        code = request.GET.get("code")
        typhoonnum = request.GET.get("typhoonnum")
        try:
            start_date = datetime.strptime(year + "-01-01 00:00:00", "%Y-%m-%d %H:%M:%S").isoformat() + '.000+00:00'
            end_date = datetime.strptime(year + "-12-31 11:59:59", "%Y-%m-%d %H:%M:%S").isoformat() + '.000+00:00'
            query = StationTideData.objects()
            query = query.filter(code=code)
            query = query.filter(startdate__gte=start_date)
            query = query.filter(startdate__lte=end_date)
            query = query.filter(typhoonnum=typhoonnum)
            jsonstr = StationTideDataFullModelSerializer(query, many=True).data
            return Response(jsonstr)
        except Exception as e:
            return Response([])


class GetRealDataMws(APIView):
    def get(self, request):
        num = request.GET.get("num")
        query = GeoTyphoonRealData.objects()
        query = query.filter(num=num)
        result = query.order_by('-wsm').limit(1).values_list("wsm", "date")
        dic = {"mws": result[0][0], "date": result[0][1]}
        print(dic)
        return Response(dic)


class GetRealDataMbp(APIView):
    def get(self, request):
        num = request.GET.get("num")
        query = GeoTyphoonRealData.objects()
        query = query.filter(num=num)
        # TODO:[x] 19-06-14 注意此处mongoengine中使用order_by 进行排序，而-bp 到标的是降序排列（即最大）
        # 此处修改为返回最小值，之前为最大值
        result = query.order_by('bp').limit(1).values_list("bp", "date")
        dic = {"mbp": result[0][0], "date": result[0][1]}
        print(dic)
        return Response(dic)
