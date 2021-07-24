from django.http import HttpRequest,HttpResponse,JsonResponse,Http404
from datetime import datetime,timedelta
from functools import wraps
from django.core.exceptions import ObjectDoesNotExist
from pytz import timezone
from django.utils import timezone
from django.utils.timezone import utc
from django.http import HttpResponseRedirect
# 为视图使用的自定义装饰器
import pytz

from .models import *

def convert_num2code(func):
    '''
        将前台传入的code转为num
    :param func:
    :return:
    '''
    @wraps(func)
    def returned_wrapper(request, *args, **kwargs):
        try:
            # code = request.GET.get('code', None)
            num=request.GET.get('num',None)
            # num=GeoTyphoonRealData.objects(code=code).first()
            # if num is not None:
            #     num=num.num
            request.GET=request.GET.copy()
            request.GET['code']=num
            return func(request, *args, **kwargs)
        except ObjectDoesNotExist:
            raise Http404()
    return returned_wrapper
