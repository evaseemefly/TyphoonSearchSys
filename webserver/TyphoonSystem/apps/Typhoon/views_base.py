from rest_framework.decorators import APIView
import abc
from datetime import datetime

class BaseView(APIView):
    def getTyphoonList(self,*args,**kwargs):
        '''
            获取台风路径集合（由子类实现）
        :param args:
        :param kwargs:
        :return:
        '''
        pass

class BaseDetailListView(abc.ABC):
    '''
        抽象子类，部分方法由父类实现
    '''

    @abc.abstractmethod
    def getlist(self,startdate:datetime,*args,**kwargs):
        '''
            根据传入的startdate获取符合条件的观测数据
        :return:
        '''
