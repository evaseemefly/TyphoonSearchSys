from django.conf.urls import url, include
from django.urls import path
from .views import *

from . import views

app_name = '[gis]'
urlpatterns = [
    # 获取指定日期的预报数据data/stationtide
    # url(r'^point/$', PointInfoView.as_view(), name="gis-get-point"),
    url(r'^data/typhoonrealdata/$',
        TyphoonRealDataView.as_view(), name="gis-get-point"),
    url(r'^filter/month/$', FilterByMonth.as_view()),
    url(r'^filter/year/$', FilterByYear.as_view()),
    # 根据半径及中心点位置查询穿过该区域的所有路径
    url(r'^filter/range/$', FilterByRange.as_view()),
    # 根据指定区域过滤对应台风并一次性返回全部路径信息
    url(r'^filter/range/all/geo/$', FilterByDistanceFullGeoInfo.as_view()),
    url(r'^filter/unique/all/geo/$', FilterByUniqueParamsFullGeoInfo.as_view()),
    url(r'^filter/condition/$', FilterByParamsView.as_view()),  # + 22-11-17 新实现的条件查询
    url(r'^filter/complex/$', FilterByComplexCondition.as_view()),
    url(r'^filter/daterange/$', FilterByDateRange.as_view()),
    url(r'^data/stationtide/$', StationTideDataListView.as_view()),
    url(r'^data/detaillist/$', StationDetailListView.as_view()),
    url(r'^word/disaster/$', DisasterWordView.as_view()),
    # 对于台风的复杂查询
    url(r'^filter/typhoon/complex/$', GetTyphoonCodeByComplexCondition.as_view()),
    url(r'filter/GetTimeByCode/$', GetTimeByCode.as_view()),
    url(r'filter/GetDetail/$', GetDetail.as_view()),
    url(r'data/GetAllTyphoonCode/', GetAllTyphoonCode.as_view()),
    url(r'data/GetAllTyphoonYear/', GetAllTyphoonYear.as_view()),
    url(r'data/GetAllObsStationCode/', GetAllObsStationCode.as_view()),
    url(r'data/GetStationObserveData/', GetStationObserveData.as_view()),
    url(r'data/GetRealDataMws/', GetRealDataMws.as_view()),
    url(r'data/GetRealDataMbp/', GetRealDataMbp.as_view()),
    # 根据 台风（code）以及 测站名称（station name） 查询风暴增水极值及对应时间
    url(r'^data/stationstatistics/$', StationStatisticsDataView.as_view()),
    # 获取对应海洋站的警戒潮位字典数组集合

    url(r'^data/station/alert/list/$', StationAlertView.as_view()),
    url(r'^data/station/extremum/list/$', AllStationExtremumDataView.as_view()),
    url(r'^data/station/extremum/realdata/list/$', AllStationRealDataExtremumDataView.as_view()),
    # 根据传入的 typhon 判断是否有对应的 测站列表
    url(r'data/CheckStation4Typhoon/$', CheckStationCount4Typhoon.as_view()),
    url(r'data/GetDisasterPicPath/$', GetDisasterPicPath.as_view()),
    path("data/DisplayDisasterPic/<str:year>/<str:num>/<str:filename>",
         views.DisplayDisasterPic),
    url(r'^data/typhoonnamedict/$', TyphoonNameDictView.as_view()),
    url(r'^other/readme/$$', ReadmeView.as_view()),
    # todo:[*] 19-08-07 获取所有测站的中英文对照字典
    url(r'^dict/station_ch/$', StationNameDictView.as_view())
    # path("getAllData",views.getAllData),
    # path("getAreaTyphoonList", views.getAreaTyphoonList),
]
