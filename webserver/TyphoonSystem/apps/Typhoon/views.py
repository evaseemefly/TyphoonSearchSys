from datetime import datetime, timedelta, date
import calendar
import datetime as superdatetime
import dateutil
import abc
import os
import logging

from typing import List, Set, Dict

from django.shortcuts import render
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import APIView
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from mongoengine import *

from TyphoonSystem import settings
from .views_base import BaseView, BaseDetailListView
import json
from TyphoonSystem.settings import TZ_UTC_0, TZ_UTC_8

# 引入mongoengine
# import mongoengineFilterByMonth
from mongoengine.queryset.visitor import Q

# 引入自己的组件
from .models import *
from .serializers import *
from .middle_models import *
from common import dateCommon
from .view_decorator import *
from common.dateCommon import sortTyphoonNum
from util.my_enum import FilterTypeEnum


# Create your views here.

# class PointInfoView(APIView):
#     '''
#
#     '''
#
#     def get(self, request):
#         bbxlist = Point.objects.all()
#         # Point.objects.
#         # json_data=BBXInfoSerializer(bbxlist,many=True)
#         # return Response(serialize('json',bbxlist))
#         return Response("")
#         # pass


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
        # todo:[*] 19-07-24 注意此处会省略时区
        targetdate = dateutil.parser.parse(date_str)
        # targetdate=targetdate.replace(tzinfo=utc)
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
        # TODO:[-] 19-06-30 注意此处的 val_forecast 与 val_real 实际值是颠倒的，注意
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
            # todo:[*] 19-07-24 注意此处的moment 是utc时间，注意！！
            date_moment = date(moment.year, moment.month, moment.day)
            hour_moment = moment.hour
            # todo:[-] 19-07-24 注意这么写的话需要进行一下时区的转化！！
            datetime_moment = datetime(moment.year, moment.month, moment.day, moment.hour, 0).replace(tzinfo=TZ_UTC_0)
            # todo:[*] 19-07-26 此处需要重新梳理一遍关于时区的问题
            '''
                s1：现传入的moment是一个utc的datetime（前台传递过来的是utc时间，后端不再做时区的修改）
                1： 对于测站数据的查询需要根据一个datetime去获取realtidedata数组中的每一个targetdate
                2： 而其中的forecastdata->forecast_arr 是根据北京时间来保存的（我日你妈！）
                ---
                1： 创建两个datetime变量，一个用来存储utc时间，一个用来存储beijing时间
                2： utc时间用来找到targetdate
                3： beijing时间用来获取每个小时的测值
            '''
            # utc时间与对应的北京时间
            moment_utc = moment
            moment_bj = moment + timedelta(hours=8)
            # 获取当前传入的时间的当日起始时间,注意也是utc时间
            # datetime_utc_start=(datetime(year=moment_bj.year,month=moment_bj.month,day=moment_bj.day)+timedelta(hours=-8)).date()+timedelta(hours=16)
            datetime_utc_start = datetime(year=moment_bj.year, month=moment_bj.month, day=moment_bj.day) + timedelta(
                hours=-8)
            # todo:[*] 19-07-29 由于修改了 realtidedate中的targetdate（由date修改为datetime），此处暂时直接判断传入的moment即可
            temp_realtidedata = [temp for temp in realdate.realtidedata if temp.targetdate == datetime_utc_start]
            # temp_forecasttidedata=[temp for temp in realdate.forecastdata if temp.targetdate==date_moment]
            if len(temp_realtidedata) > 0:
                # TODO 19-04-11 此处修改
                return StationTideAllDataMidModel(
                    temp_realtidedata[0].realdata.realdata_arr[moment_bj.hour],
                    temp_realtidedata[0].forecastdata.forecast_arr[moment_bj.hour],
                    moment_utc
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


class TyphoonNameDictView(BaseView):
    '''
        台风名称字典 视图
    '''

    def get(self, request):
        nums = request.GET.get('nums', '')
        # TODO:[*] 19-07-12 放在父类中
        num_list = nums.split(',')
        # list_dict: [] = []
        # if len(num_list)==1 and num_list[0]=='':
        #     list_dict = TyphoonNumChDictData.objects()
        # else:
        #     list_dict = TyphoonNumChDictData.objects(num__in=num_list)
        # list_dict = list_dict.distinct('num')
        list_dict = self.getTyphoonChNameDict(nums=num_list)
        json_data = TyphoonNumChDictSerializer(list_dict, many=True).data

        return Response(json_data)


class StationNameDictView(BaseView):
    '''
        todo:[*] 19-08-07 测站名称的字典视图
    '''

    def get(self, request):
        # 看前台是否传入了names，若未传入则代表获取全部的，大概率是这样

        names = request.GET.get('names', '')
        dict_names = StationNameDict.objects()
        json_data = StationNameChDictSerializer(dict_names, many=True).data
        return Response(json_data)
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
                        # TODO [*] 19-06-30 注意此处的时间之前是在判断之中
                        temp_datetime = datetime.datetime.combine(realtide_temp.targetdate, datetime.time(index, 0))
                        # TODO [-] 19-04-25 temp[0] 为real temp[1] 为forecast
                        # 需要判断是否没有-9999若存在-9999，则直接返回-9999
                        if temp[0] == -9999 or temp[1] == -9999:
                            temp_tide = StationTideRealMidModel(-9999, temp_datetime)
                        else:
                            # temp_datetime = datetime.datetime.combine(realtide_temp.targetdate, datetime.time(index, 0))
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
                        # TODO [*] 19-06-30
                        # temp_datetime = datetime.datetime.combine(realtide_temp.targetdate,
                        #                                           datetime.time(index, 0))
                        # TODO [*] 19-07-29 此处为targetdate与当前的计数器相加
                        temp_datetime = realtide_temp.targetdate + timedelta(hours=index)
                        # todo[*] 19-07-26 此处需要注意一下时区的问题
                        # temp_datetime=temp_datetime.replace(tzinfo=)
                        temp_tide = StationTideAllDataMidModel(temp[0], temp[1], temp_datetime)

                        # TODO [-] 19-04-25 temp[0] 为real temp[1] 为forecast
                        # 需要判断是否没有-9999若存在-9999，则直接返回-9999
                        # if temp[0] == -9999 or temp[1] == -9999:
                        #     temp_tide = StationTideRealMidModel(-9999, temp_datetime)
                        # else:
                        #     # real-forecast 为实际的潮差
                        #     # TODO:[-] 19-05-28 注意此处之前录入的有问题，此处实际为forecast-real(forecast与real的录入录反了)
                        #     # temp_tide = StationTideRealMidModel(temp[0] - temp[1], temp_datetime)
                        #     temp_tide = StationTideAllDataMidModel(temp[0], temp[1], temp_datetime)
                        data_list.append(temp_tide)
        return data_list


class StationDetailListView(APIView):
    '''
        根据传入的 台风 code 以及 海洋站 name
        返回该过程中的该测站的连续观测值
    '''

    def get(self, request):
        code = request.GET.get('code', None)
        name = request.GET.get('name', None)
        num = request.GET.get('num', None)
        type = int(request.GET.get('type', '0'))
        switch = {
            0: StationDetailMinList,
            2: StationDetailAllList
        }
        try:
            data_json = switch[type]().toSerialize(code, name, num, type)
            # data_json = self.toSerialize(code, name, num, type)
            # data_list = self.load(code, name, num)
            # data_json = TideRealMidModelSerializer(data_list, many=True)
            return Response(data_json.data)
        except Exception as e:
            logging.error(e)
            return Response('', status=500)

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


class FilterByRange(BaseView):
    '''
        根据经纬度[lat,lon]以及range 返回在指定范围内的台风编号
    '''

    def get(self, request: Request) -> Response:
        """
            get 请求处理
        @param request:
        @return:
        """
        data = self.filter(request)
        json_data = TyphoonAndTotalModelSerializer(data).data
        # json_data = TyphoonModelSerializer(list_data, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)

    def filter(self, request: Request) -> TyphoonAndTotalModel:
        """
            根据请求中的 latlong[] 与 range 进行过滤，过滤经过此圆形区域的全部台风路径
        @param request:
        @return:
        """
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

        # TODO:[-] 22-10-19 由于台风数据不会太多，所以加入了判断，若传入的 index 与 size 是 -1 即不需要进行分页查询
        index = int(request.GET.get('index', '-1'))
        size = int(request.GET.get('size', '-1'))
        start_index = (index * size)
        finish_index = (index * size + size)
        # 获取去重后的code list
        nums: List[str] = self.getTyphoonList(latlon=latlons, range=range)

        if index != -1 and size != -1:
            start_index = (index * size)
            finish_index = (index * size + size)
            # TODO:[*] 19-07-13 对nums加入排序升序排序
            codes = nums[start_index:finish_index]
        else:
            codes = nums
        ty_total = self.get_ty_total(nums)
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
        return ty_total

    def get_ty_total(self, ty_nums: List[str]) -> TyphoonAndTotalModel:
        """
            - 22-11-17 根据 ty_nums 获取 台风统计 model
        @param ty_nums:
        @return:
        """
        tup_python_name = ('nameless', '(nameless)')
        list_data = []
        total = len(ty_nums)
        for num in ty_nums:
            obj = GeoTyphoonRealData.objects(num=num)[0]
            if obj.code not in tup_python_name:
                list_data.append(TyphoonModel(obj.code, obj.date, obj.num))
        # TODO:[*] 19-07-12 加入中文typhoonName
        list_typhoonNum: List[str] = [temp.num for temp in list_data]

        # 以下部分封装至 BaseView 中的 addChnameVariable 方法中
        # list_namesDict = self.getTyphoonChNameDict(nums=list_typhoonNum)
        # dict_names = {}
        # # ((lambda x: dict_names[x.num]=x.chname)(temp) for temp in list_namesDict)
        # for temp in list_namesDict:
        #     dict_names[temp.num] = temp.chname
        # list_dataFinal = []
        # if len(list_namesDict) > 0:
        #     # lis for temp in list_data
        #     [
        #         list_dataFinal.append(TyphoonModel(temp.code, temp.date, temp.num, dict_names.get(temp.num)))
        #      for
        #      temp in
        #      list_data]
        # else:
        #     list_dataFinal = list_data

        list_dataFinal = self.addChnameVariable(list_data, nums=list_typhoonNum)
        # TODO:[*] 19-05-13 返回的加入total
        data = TyphoonAndTotalModel(list_dataFinal, total)
        return data

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

    def get_ty_real_path(self, ty_nums: List[str]) -> List[TyphoonGeoListMidModel]:
        # 根据 台风编号获取每个编号对应的台风路径,参考 按年份获取
        tup_python_name = ('nameless', '(nameless)')
        list_ty_geo_path: List[TyphoonGeoListMidModel] = []
        for temp_ty_num in ty_nums:
            if temp_ty_num not in tup_python_name:
                temp_ty_path_list = GeoTyphoonRealData.objects(num=temp_ty_num)
                temp_ty_geo_path: TyphoonGeoListMidModel = TyphoonGeoListMidModel(num=temp_ty_num,
                                                                                  list_ty_geo=temp_ty_path_list)
                list_ty_geo_path.append(temp_ty_geo_path)
        return list_ty_geo_path


class FilterByMonth(FilterByRange):
    '''
        根据起始月份进行查询（或改成起止日期）
    '''

    def get(self, request):
        code = request.GET.get("code", settings.default_typhoon_code)
        month = int(request.GET.get("month", "1"))
        list_ty_nums: List[str] = self.get_ty_nums(code=code, month=month)
        # 根据 台风编号获取每个编号对应的台风路径,参考 按年份获取
        list_ty_geo_path: List[TyphoonGeoListMidModel] = self.get_ty_real_path(list_ty_nums)
        json_data = GeoTyphoonGroupListDataSerializer(list_ty_geo_path, many=True).data
        return Response(json_data)

    def get_ty_nums(self, *args, **kwargs) -> List[str]:
        """
            根据code以及month查询台风路径信息
        @param args:
        @param kwargs:
        @return: 台风编号集合
        """
        month = kwargs.get('month', datetime.now().month)
        # TODO [*]此处存在的问题不能使用django的xxx__month的方式直接按照月份去过滤
        # return GeoTyphoonRealData.objects.filter(code=code,date__month=6)
        """
            原生查询语句如下:

            db.geotyphoonrealdata.aggregate(
               [
                 {
                   $project:
                     {
                       month: { $month: "$date" },
                       num:"$num"
                     }
                 },
                 {
                   $match:{
                     month:2
                   }
                 },
                 {
                    $group:{
                        _id:"$num"
                    }
                 }
               ]
            )

        """

        # pipeline = [
        #     {"$sort": {"name": -1}},
        #     {"$project": {"_id": 0, "name": {"$toUpper": "$name"}}}
        # ]

        find_qry = [
            {"$project": {"month": {"$month": "$date"}, "num": "$num"}},
            {"$match": {"month": month}},
            {"$group": {"_id": "$num"}}
        ]

        # {
        #     "$match":
        #         {
        #             "month": month
        #         }
        # },
        # {
        #     "$group": {
        #         "_id": "$num"
        #     }
        # }

        # ERROR1: TypeError: filter must be an instance of dict, bson.son.SON, or other type that inherits from collections.Mapping
        # collection = GeoTyphoonRealData._get_collection()
        # query = collection.find(pipeline)
        # ERROR2: Unable to get repr for <class 'mongoengine.queryset.queryset.QuerySet'>
        # ERROR3: pymongo.errors.OperationFailure: Each element of the 'pipeline' array must be an object
        # TODO:[-] 22-11-16 注意此处 aggregate(*x) 需要加入 * 否则会提示 Each element of the 'pipeline' array must be an object 错误
        query = GeoTyphoonRealData.objects().aggregate(*find_qry)
        # [..{_id:xx}]
        list_query_dist: List[dict] = list(query)
        # 获取该年份的台风编号
        list_nums: List[str] = [temp.get('_id') for temp in list_query_dist]
        return list_nums


class FilterByYear(FilterByRange):
    '''
        根据年份进行查询
    '''

    def get(self, request):
        """
             {
                "num": "1711",
                "list_ty_geo": [
                    {
                        "code": "NALGAE",
                        "date": "2017-08-01T00:00:00Z",
                        "num": "1711",
                        "bp": 1004.0,
                        "wsm": 13.0,
                        "level": 1,
                        "latlon": {
                            "type": "Point",
                            "coordinates": [
                                162.4,
                                26.5
                            ]
                        }
                    },
             }
        @param request:
        @return:
        """
        # TODO [-]优先完成此部分
        code = request.GET.get('code')
        year = request.GET.get('year', datetime.now().year)
        list = self.getTyphoonList(year=year, code=code)
        codes: List[str] = [temp.num for temp in list]
        dist_codes: Set[str] = set(codes)
        list_code: List[str] = [code for code in dist_codes]
        # 去掉 nameless
        list_ty_geo_path: List[TyphoonGeoListMidModel] = self.get_ty_real_path(list_code)
        json_data = GeoTyphoonGroupListDataSerializer(list_ty_geo_path, many=True).data
        return Response(json_data)

    def getTyphoonList(self, *args, **kwargs) -> List[GeoTyphoonRealData]:
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
        # return GeoTyphoonRealData.objects(date__lte=end, date__gte=start) if code == "" else GeoTyphoonRealData.objects(
        #     code=code, date__gte=start,
        #     date__lte=end)
        return GeoTyphoonRealData.objects.filter(date__lte=end, date__gte=start)
        # return GeoTyphoonRealData.objects(code=code, date__lte=end)
        # return GeoTyphoonRealData.objects.filter(code=code, date__gte=start)


class FilterByComplex(FilterByRange):
    def get_tynums_bynum(self, ty_num) -> List[str]:
        """
            + 22-12-26 根据传入的 ty_num 获取对应的台风编号
        @param ty_num:
        @return:
        """
        list_geo_ty: List[GeoTyphoonRealData] = GeoTyphoonRealData.objects.filter(num=ty_num)
        ty_nums: List[str] = [temp.num for temp in list_geo_ty]
        dict_nums: Set[str] = set(ty_nums)
        dist_ty_nums: List[str] = [code for code in dict_nums]
        return dist_ty_nums


class FilterByParamsView(FilterByMonth, FilterByYear, FilterByComplex):
    """
        复杂查询过滤视图
    """

    def get(self, request: Request) -> Response:
        """
            必要条件: filter_type 条件过滤类型
            可选条件: month       指定月份(全部)
        @param request:
        @return:
        """
        filter_type_str: str = request.GET.get('filter_type', None)
        filter_type_int: int = int(filter_type_str) if filter_type_str is not None else FilterTypeEnum.UNLL.value
        filter_type: FilterTypeEnum = FilterTypeEnum(filter_type_int)
        ty_total: TyphoonAndTotalModel = None
        # ty_nums_list: List[str] = []
        # 根据过滤类型获取该过滤类型的匹配台风编号
        if filter_type is FilterTypeEnum.UNIQUE_MONTH:
            month_str: str = request.GET.get('month', '1')
            month: int = int(month_str)
            ty_nums_list: List[str] = self.get_ty_nums(month=month)
            ty_total: TyphoonAndTotalModel = self.get_ty_total(ty_nums_list)
        elif filter_type is FilterTypeEnum.UNIQUE_YEAR:
            year_str: str = request.GET.get('year', '2017')
            year: int = int(year_str)
            ty_path_list: List[GeoTyphoonRealData] = self.getTyphoonList(year=year)
            ty_nums_list: List[str] = [temp.num for temp in ty_path_list]
            dist_ty_nums: Set[str] = set(ty_nums_list)
            ty_nums_list: List[str] = [code for code in dist_ty_nums]
            ty_total: TyphoonAndTotalModel = self.get_ty_total(ty_nums_list)
        elif filter_type is FilterTypeEnum.UNIQUE_TYNUM:
            ty_num: str = request.GET.get('ty_num', '2017')
            ty_nums_list = self.get_tynums_bynum(ty_num)
            ty_total: TyphoonAndTotalModel = self.get_ty_total(ty_nums_list)
        json_data = TyphoonAndTotalModelSerializer(ty_total).data
        # json_data = TyphoonModelSerializer(list_data, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)

    def filter_unique_month(self, month: str) -> List[str]:
        nums: List[str] = self.get_ty_nums(month=int(month))
        return nums


class FilterByDistanceFullGeoInfo(FilterByRange):
    """
        + 22-11-11
        根据指定区域过滤对应台风并一次性返回全部路径信息
    """

    def get(self, request: Request) -> Response:
        # step1: 获取过滤后的全部台风
        data: TyphoonAndTotalModel = self.filter(request)
        # step2: 遍历所有匹配的台风获取全部的台风路径信息
        list_ty_geo_path: List[TyphoonGeoListMidModel] = []
        for temp_ty in data.list:
            temp_ty_path_list = GeoTyphoonRealData.objects(num=temp_ty.num)
            temp_ty_geo_path: TyphoonGeoListMidModel = TyphoonGeoListMidModel(num=temp_ty.num,
                                                                              list_ty_geo=temp_ty_path_list)
            list_ty_geo_path.append(temp_ty_geo_path)
        json_data = GeoTyphoonGroupListDataSerializer(list_ty_geo_path, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)


class FilterByUniqueParamsFullGeoInfo(FilterByParamsView, FilterByComplex):
    def get(self, request: Request) -> Response:
        # step1: 获取过滤后的全部台风
        filter_type_str: str = request.GET.get('filter_type', None)
        filter_type_int: int = int(filter_type_str) if filter_type_str is not None else FilterTypeEnum.UNLL.value
        filter_type: FilterTypeEnum = FilterTypeEnum(filter_type_int)
        ty_total: TyphoonAndTotalModel = None
        ty_nums_list: List[str] = []

        # 根据过滤类型获取该过滤类型的匹配台风编号
        if filter_type is FilterTypeEnum.UNIQUE_MONTH:
            month_str: str = request.GET.get('month', '1')
            month: int = int(month_str)
            ty_nums_list: List[str] = self.get_ty_nums(month=month)
            ty_total: TyphoonAndTotalModel = self.get_ty_total(ty_nums_list)
        elif filter_type is FilterTypeEnum.UNIQUE_YEAR:
            year_str: str = request.GET.get('year', '2017')
            year: int = int(year_str)
            ty_path_list: List[GeoTyphoonRealData] = self.getTyphoonList(year=year)
            ty_nums_list: List[str] = [temp.num for temp in ty_path_list]
            dist_ty_nums: Set[str] = set(ty_nums_list)
            ty_nums_list: List[str] = [code for code in dist_ty_nums]
        elif filter_type is FilterTypeEnum.UNIQUE_TYNUM:
            # + 22-12-26 按照台风编号进行唯一查询
            ty_num: str = request.GET.get('ty_num')
            ty_nums_list = self.get_tynums_bynum(ty_num)
        # step2: 遍历所有匹配的台风获取全部的台风路径信息
        list_ty_geo_path: List[TyphoonGeoListMidModel] = []
        # 加入需要忽略的 num:0000
        igore_num: str = '0000'
        for temp_ty in ty_nums_list:
            if temp_ty != igore_num:
                temp_ty_path_list = GeoTyphoonRealData.objects(num=temp_ty)
                temp_ty_geo_path: TyphoonGeoListMidModel = TyphoonGeoListMidModel(num=temp_ty,
                                                                                  list_ty_geo=temp_ty_path_list)
                list_ty_geo_path.append(temp_ty_geo_path)
        json_data = GeoTyphoonGroupListDataSerializer(list_ty_geo_path, many=True).data
        return Response(json_data, status=status.HTTP_200_OK)


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
            end_date = datetime.strptime(endMonth, '%Y-%m')
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
        # 注意此处若传入的 level 为0，说明为未选中台风等级，忽略此条件
        level = request.GET.get('level')
        # level=int(level)
        wsm = request.GET.get('wsm')
        bp = request.GET.get('bp')
        num = request.GET.get('num')
        startMonth = request.GET.get('startMonth')
        endMonth = request.GET.get('endMonth')
        fromP = request.GET.get('from')
        toP = request.GET.get('to')

        # TODO:[*] 19-07-13 需要对复杂条件查询加入台风的中文名称chname

        query = GeoTyphoonRealData.objects()

        if level is not None and level != '' and level != '0':
            query = query.filter(level=int(level))
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
        # TODO:[-] 19-07-11 加入排序
        query = query.order_by('date')
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
        #  19-07-13 暂时去掉根据num去重，此时的query就不再是一个num的 list，而是一个GeoTyphoonRealData的list，
        # 注意此处的num确实是会有重复的，必须要去重
        query = query.distinct('num')
        total = len(query)
        # TODO:[*] 19-07-13 加入一个排序，使用升序排列
        # query = sorted(query, key=lambda x: int(x), reverse=False)
        query = sortTyphoonNum(query, False, 49)
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
            TyphoonModel(GeoTyphoonRealData.objects(num=num)[0].code,
                         GeoTyphoonRealData.objects(num=num)[0].date,
                         GeoTyphoonRealData.objects(num=num)[0].num)
            for num in query]
        typhoon_nums = [temp.num for temp in list_data]
        list_dataFinal = self.addChnameVariable(list_data, nums=typhoon_nums)
        json_data = TyphoonAndTotalModelSerializer(TyphoonAndTotalModel(list_dataFinal, total)).data
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
    '''
        获取灾情描述word信息
    '''

    def get(self, request):
        code = request.GET.get('code', None)
        # code = '5622'
        query = DisasterWordInfo.objects(code=code)
        json_data = DisasterWordModelSerializer(query, many=True).data
        return Response(json_data)
        # pass


class StationStatisticsDataView(APIView):
    '''
        获取测站的极值数据
    '''

    def get(self, request):
        num = request.GET.get("num", None)
        stationname = request.GET.get('name', None)
        # 根据stationname 与 typhoon num 找到 风暴增水的最大值
        # forecast-realtide 差值的最大值
        result = {}
        try:
            max_val, realdata_val, tide_val, max_date = self.getDeviationVals(num, stationname)
            result = {
                'max_val': max_val,
                'max_date': max_date
            }
        except Exception as e:
            logging.error(e)

        return Response(result)
        # pass

    def getDeviationVals(self, num: str, stationname: str):
        '''
            获取差值的数组—— 找到增水极值
        :return: [最大值,实况潮位，天文潮，最大值出现的时间]
        '''
        real_arr = []
        forecast_arr = []
        deviation_arr = []
        query = StationTideData.objects(typhoonnum=num, stationname=stationname).first()
        # 分别取出real_arr与forecast
        # for temp in query.realtidedata
        for temp in query.realtidedata:
            # AttributeError: 'ForecastData'
            # object
            # has
            # no
            # attribute
            # 'realdata_arr'
            # TODO:[*] 19-07-30 注意数据库中存取的数据real与forecast是相反的！！
            # forecast_arr_temp = [forecast_temp for forecast_temp in temp.forecastdata.forecast_arr]
            # real_arr_temp = [real_temp for real_temp in temp.realdata.realdata_arr]
            # 此处需要颠倒一下，上面是之前的未颠倒的，暂时保留
            real_arr_temp = [forecast_temp for forecast_temp in temp.forecastdata.forecast_arr]
            forecast_arr_temp = [real_temp for real_temp in temp.realdata.realdata_arr]
            real_arr = real_arr + real_arr_temp
            forecast_arr = forecast_arr + forecast_arr_temp
            # real_arr = [realdata_temp for realdata in temp.realdata_arr for realdata_temp in realdata]
        # err：ValueError: not enough values to unpack (expected 3, got 2)
        # TODO :[*] 19-06-30 注意数据库中的 预报值 与 实测值 是相反的
        deviation_arr = [(i, x - y) for i, (x, y) in enumerate(zip(real_arr, forecast_arr))]
        # 找到极值及其所在位置
        max_deviation = max(deviation_arr, key=lambda x: x[1])
        index = max_deviation[0]
        # TODO:[*] 19-07-30 此处需要转为utc时间 replace(tzinfo=TZ_UTC_0)
        max_targetdate = query.startdate + timedelta(hours=index)
        max_targetdate = max_targetdate.replace(tzinfo=TZ_UTC_0)
        max_val = max_deviation[1]
        # + 22-12-05 实况增水值
        realdata_val = real_arr[index]
        tide_val = forecast_arr[index]
        return max_val, realdata_val, tide_val, max_targetdate

    def getRealSurgeMaxVals(self, num: str, stationname: str):
        """
                获取实况极大值
        @param num:
        @param stationname:
        @return: [最大值,实况潮位，天文潮，最大值出现的时间]
        """
        real_arr = []
        forecast_arr = []
        deviation_arr = []
        query = StationTideData.objects(typhoonnum=num, stationname=stationname).first()
        # 分别取出real_arr与forecast
        # for temp in query.realtidedata
        for temp in query.realtidedata:
            # AttributeError: 'ForecastData'
            # object
            # has
            # no
            # attribute
            # 'realdata_arr'
            # TODO:[*] 19-07-30 注意数据库中存取的数据real与forecast是相反的！！
            # forecast_arr_temp = [forecast_temp for forecast_temp in temp.forecastdata.forecast_arr]
            # real_arr_temp = [real_temp for real_temp in temp.realdata.realdata_arr]
            # 此处需要颠倒一下，上面是之前的未颠倒的，暂时保留
            real_arr_temp = [forecast_temp for forecast_temp in temp.forecastdata.forecast_arr]
            forecast_arr_temp = [real_temp for real_temp in temp.realdata.realdata_arr]
            real_arr = real_arr + real_arr_temp
            forecast_arr = forecast_arr + forecast_arr_temp
            # real_arr = [realdata_temp for realdata in temp.realdata_arr for realdata_temp in realdata]
        # err：ValueError: not enough values to unpack (expected 3, got 2)
        # TODO :[*] 19-06-30 注意数据库中的 预报值 与 实测值 是相反的
        deviation_arr = [(i, x) for i, (x, y) in enumerate(zip(real_arr, forecast_arr))]
        # 找到极值及其所在位置
        max_deviation = max(deviation_arr, key=lambda x: x[1])
        index = max_deviation[0]
        # TODO:[*] 19-07-30 此处需要转为utc时间 replace(tzinfo=TZ_UTC_0)
        max_targetdate = query.startdate + timedelta(hours=index)
        max_targetdate = max_targetdate.replace(tzinfo=TZ_UTC_0)
        max_val = max_deviation[1]
        # + 22-12-05 实况增水值
        realdata_val = real_arr[index]
        tide_val = forecast_arr[index]
        return max_val, realdata_val, tide_val, max_targetdate


class AllStationExtremumDataView(StationStatisticsDataView):
    '''
        + 22-10-28 根据台风编号获取该过程的全部站点的极值情况
    '''

    def get(self, request: HttpRequest) -> HttpResponse:
        ty_num: str = request.GET.get('num', None)
        # TODO:[-] 22-11-08 由于之前录入数据部分存在 geostationtidedata.code 为对应站点id而非 code，修改为获取 stationname
        codes: List[str] = self.get_dist_station_names(ty_num)
        list_extremum: List[dict] = []
        for temp_code in codes:
            try:
                max_val, realdata_val, tide_val, max_dt = self.getDeviationVals(ty_num, temp_code)
                temp_extremum: dict = {
                    'station_code': temp_code,
                    'max_val': max_val,
                    'realdata_val': realdata_val,
                    'tide_val': tide_val,
                    'max_date': max_dt
                }
                list_extremum.append(temp_extremum)
            except Exception as ex:
                print(f'{ty_num},{temp_code}出现错误:{ex.args}')
        return Response(list_extremum)

    def get_dist_station_codes(self, num: str) -> List[str]:
        codes = StationTideData.objects(typhoonnum=num).distinct('code')
        return codes

    def get_dist_station_names(self, num: str) -> List[str]:
        """
            + 22-11-08 获取不同的海洋站 names
            发现的bug，部分站点录入时出现错误，
            eg: 0421 code 均为站点id，而非 name，此处修改为获取 stationnname
        """
        names = StationTideData.objects(typhoonnum=num).distinct('stationname')
        return names


class AllStationRealDataExtremumDataView(AllStationExtremumDataView):
    """
        + 22-12-6 根据台风编号获取该过程影响站点的实况极值集合
    """

    def get(self, request: HttpRequest) -> HttpResponse:
        """

        @param request:
        @return: {
                    'station_code': 海洋站英文名称,
                    'max_val': 实况极值,
                    'realdata_val': 实况极值,
                    'tide_val': 实况极值时刻的天文潮值,
                    'max_date': 实况极值出现的时间
                }
        """
        ty_num: str = request.GET.get('num', None)
        # TODO:[-] 22-11-08 由于之前录入数据部分存在 geostationtidedata.code 为对应站点id而非 code，修改为获取 stationname
        codes: List[str] = self.get_dist_station_names(ty_num)
        list_extremum: List[dict] = []
        for temp_code in codes:
            try:
                max_val, realdata_val, tide_val, max_dt = self.get_realdata_deviation_vals(ty_num, temp_code)
                temp_extremum: dict = {
                    'station_code': temp_code,
                    'max_val': max_val,
                    'realdata_val': realdata_val,
                    'tide_val': tide_val,
                    'max_date': max_dt
                }
                list_extremum.append(temp_extremum)
            except Exception as ex:
                print(f'{ty_num},{temp_code}出现错误:{ex.args}')
        return Response(list_extremum)

    def get_realdata_deviation_vals(self, num: str, stationname: str):
        '''
            获取差值的数组—— 找到增水极值
        :return: [最大值,实况潮位，天文潮，最大值出现的时间]
        '''
        real_arr = []
        forecast_arr = []
        deviation_arr = []
        query = StationTideData.objects(typhoonnum=num, stationname=stationname).first()
        # 分别取出real_arr与forecast
        # for temp in query.realtidedata
        for temp in query.realtidedata:
            # TODO:[*] 19-07-30 注意数据库中存取的数据real与forecast是相反的！！
            # 此处需要颠倒一下，上面是之前的未颠倒的，暂时保留
            real_arr_temp = [forecast_temp for forecast_temp in temp.forecastdata.forecast_arr]
            forecast_arr_temp = [real_temp for real_temp in temp.realdata.realdata_arr]
            real_arr = real_arr + real_arr_temp
            forecast_arr = forecast_arr + forecast_arr_temp
            # real_arr = [realdata_temp for realdata in temp.realdata_arr for realdata_temp in realdata]
        # err：ValueError: not enough values to unpack (expected 3, got 2)
        # TODO :[*] 19-06-30 注意数据库中的 预报值 与 实测值 是相反的
        deviation_arr = [(i, x) for i, (x, y) in enumerate(zip(real_arr, forecast_arr))]
        # 找到极值及其所在位置
        max_deviation = max(deviation_arr, key=lambda x: x[1])
        index = max_deviation[0]
        # TODO:[*] 19-07-30 此处需要转为utc时间 replace(tzinfo=TZ_UTC_0)
        max_targetdate = query.startdate + timedelta(hours=index)
        max_targetdate = max_targetdate.replace(tzinfo=TZ_UTC_0)
        max_val = max_deviation[1]
        # + 22-12-05 实况增水值
        realdata_val = real_arr[index]
        tide_val = forecast_arr[index]
        return max_val, realdata_val, tide_val, max_targetdate


# 获取所有台风年份
class GetAllTyphoonYear(APIView):
    def get(self, request):
        query = GeoTyphoonRealData.objects()
        query = query.aggregate(
            {"$group": {"_id": "null", "years": {"$addToSet": {"$dateToString": {"format": "%Y", "date": "$date"}}}}})
        lst = list(query)
        return Response(lst)


class CheckStationCount4Typhoon(APIView):
    '''
        根据传入的 typhon 判断是否有对应的 测站列表
    '''

    def get(self, request):
        num = request.GET.get('num', None)
        query = StationTideData.objects(typhoonnum=num)
        count = len(query)
        result = {
            'count': count
        }
        return Response(result)
        # pass

        # count=query


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
            # 此处暂时改为stationname
            result = query.distinct('stationname')
            # result = query.distinct('code')
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


class StationAlertView(APIView):
    def get(self, request: Request) -> Response:
        """

        @param request:
        @return:
        """
        codes: List[str] = request.GET.getlist('codes[]', [])
        list_alert_dict = self.get_station_alerttide(codes)
        return Response(list_alert_dict, status=status.HTTP_200_OK)

    def get_station_alerttide(self, names: List[str]) -> List[Dict]:
        """
            根据 codes 获取对应的四色警戒潮位
        @param codes: 海洋站编号数组
        @return:  匹配的海洋站警戒潮位字典数组集合
        """
        # list_alert: List[List[Dict[str, str]]] = []
        list_alert: List[Dict] = []
        # list_dict_name_code: List[Dict[str, str]] = self.get_stationname_code_dict(names)
        dict_name_code: Dict[str, str] = self.get_stationname_code_dict(names)
        for temp_name in names:
            temp_code: str = dict_name_code.get(temp_name)
            # 此处查询完会有 2|4 个结果
            query = StationAlertDoc.objects.filter(code=temp_code)
            temp_station_alerts: List[Dict[str, str]] = [
                {'code': temp_code, 'alert': temp_alert.alert, 'tide': temp_alert.tide} for
                temp_alert in query]
            temp_station: {} = {'code': temp_code, 'name_en': temp_name, 'alerts': temp_station_alerts}
            list_alert.append(temp_station)
        return list_alert

    def get_stationname_code_dict(self, names: List[str]) -> Dict[str, str]:
        """
            根据传入的海洋站 name_en 获取 name_en:code 字典
        @param names:
        @return:
        """
        list_dict: List[Dict[str, str]] = []
        dict_name_code: Dict[str, str] = {}
        for temp_name_en in names:
            temp_station: StationBaseInfoDoc = StationBaseInfoDoc.objects().filter(name_en=temp_name_en).first()
            # temp_dict: Dict[str, str] = {temp_station.name_en: temp_station.code}
            # list_dict.append(temp_dict)
            if temp_station is not None:
                try:
                    dict_name_code[temp_station.name_en] = temp_station.code
                except Exception as ex:
                    print(ex.args)

        return dict_name_code


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


class GetDisasterPicPath(APIView):
    '''
    根据灾情参数读取所有文件，并生成url路径，贡轮播使用
    '''

    def get(self, request):
        base_path = settings.DISASTER_PIC_PATH
        num = request.GET.get("num")
        year = request.GET.get("year")
        img_dir_path = os.path.join(base_path, year, num);
        if not os.path.exists(img_dir_path):
            return Response([])
        img_name_list = os.listdir(img_dir_path)
        reslist = []
        # 暂时先写死img路径
        get_pic_url = 'data/DisplayDisasterPic/' + year + '/' + num + '/'
        print(get_pic_url)
        for name in img_name_list:
            reslist.append(get_pic_url + name);
        return Response(reslist);


def DisplayDisasterPic(request, num, year, filename):
    '''
    根据路径读取单张图片并返回
    '''
    base_path = settings.DISASTER_PIC_PATH
    file_path = os.path.join(base_path, year, num, filename)
    image_data = open(file_path, "rb").read()
    _, imgtype = os.path.splitext(file_path)
    content_type = "image/" + imgtype.lstrip('.')
    return HttpResponse(image_data, content_type=content_type)


class ReadmeView(APIView):
    '''
        获取灾情描述word信息
    '''

    def get(self, request):
        readme = 'v2.0:19-08-09'
        return Response(readme)
