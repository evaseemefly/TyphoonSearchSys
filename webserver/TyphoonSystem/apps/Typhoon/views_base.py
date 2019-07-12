from rest_framework.decorators import APIView
import abc
from datetime import datetime
from .models import *


class BaseView(APIView):
    def getTyphoonList(self, *args, **kwargs):
        '''
            获取台风路径集合（由子类实现）
        :param args:
        :param kwargs:
        :return:
        '''
        pass

    def getTyphoonChNameDict(self, *args, **kwargs) -> []:
        '''
            根据nums或者查询全部的台风名称字典
        :param args:
        :param kwargs:
        :return:
        '''
        nums = kwargs.get('nums')
        if len(nums) == 1 and nums[0] == '':
            list_dict = TyphoonNumChDictData.objects()
        else:
            # num_list = nums.split(',')
            list_dict = TyphoonNumChDictData.objects(num__in=nums)
        return list_dict


class BaseDetailListView(abc.ABC):

    @abc.abstractmethod
    def load(self, code: str, stationname: str):
        ''' 根据台风code以及海洋站name加载的连续测值'''
