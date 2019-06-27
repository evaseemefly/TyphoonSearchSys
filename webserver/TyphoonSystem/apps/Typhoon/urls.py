from django.conf.urls import url, include
from django.urls import path
from .views import *

from . import views

app_name = '[gis]'
urlpatterns = [
    # 获取指定日期的预报数据
    url(r'^point/$', PointInfoView.as_view(), name="gis-get-point"),
    url(r'^data/typhoonrealdata/$',
        TyphoonRealDataView.as_view(), name="gis-get-point"),
    url(r'^filter/month/$', FilterByMonth.as_view()),
    url(r'^filter/year/$', FilterByYear.as_view()),
    url(r'^filter/range/$', FilterByRange.as_view()),
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
    url(r'data/GetAllObsStationCode/',GetAllObsStationCode.as_view()),
    url(r'data/GetStationObserveData/',GetStationObserveData.as_view()),
    url(r'data/GetRealDataMws/',GetRealDataMws.as_view()),
    url(r'data/GetRealDataMbp/',GetRealDataMbp.as_view()),
    # 根据 台风（code）以及 测站名称（station name） 查询风暴增水极值及对应时间
    url(r'^data/stationstatistics/$',StationStatisticsDataView.as_view())
    # path("getAllData",views.getAllData),
    # path("getAreaTyphoonList", views.getAreaTyphoonList),
]
