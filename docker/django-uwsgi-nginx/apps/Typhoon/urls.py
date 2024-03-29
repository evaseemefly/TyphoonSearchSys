from django.conf.urls import url, include
from django.urls import path
from .views import *

from . import views

app_name = '[gis]'
urlpatterns = [
    # 获取指定日期的预报数据
    url(r'^point/$', PointInfoView.as_view(), name="gis-get-point"),
    url(r'^data/typhoonrealdata/$', TyphoonRealDataView.as_view(), name="gis-get-point"),
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
    url(r'filter/GetDetail/$', GetDetail.as_view())
    # path("getAllData",views.getAllData),
    # path("getAreaTyphoonList", views.getAreaTyphoonList),
]
