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
<<<<<<< HEAD
    url(r'^filter/complex/$',FilterByComplexCondition.as_view()),
    url(r'^filter/daterange/$',FilterByDateRange.as_view())
    #path("getAllData",views.getAllData),
    #path("getAreaTyphoonList", views.getAreaTyphoonList),
=======
    # 根据code以及date查询 测站的潮位数据
    url(r'data/stationtide/$',StationTideDataListView.as_view())
>>>>>>> 95b778bb18b6f7510ee3cad169ca9e6bd1d8a00e
]
