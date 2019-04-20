from rest_framework.decorators import APIView
import abc

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

    @abc.abstractmethod
    def load(self,code:str,stationname:str):
        ''' 根据台风code以及海洋站name加载的连续测值'''