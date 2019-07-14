from rest_framework.decorators import APIView
import abc
from datetime import datetime
from .models import *
from .middle_models import *


class BaseView(APIView):
    def getTyphoonList(self, *args, **kwargs):
        '''
            获取台风路径集合（由子类实现）
        :param args:
        :param kwargs:
        :return:
        '''
        pass

    def getTyphoonChNameDict(self, *args, **kwargs) -> dict:
        '''
            根据nums或者查询全部的台风名称字典
        :param args:
        :param kwargs:
        :return:
        '''
        nums = kwargs.get('nums')
        dict_names = {}
        if len(nums) == 1 and nums[0] == '':
            list_dict = TyphoonNumChDictData.objects()
        else:
            # num_list = nums.split(',')
            list_dict = TyphoonNumChDictData.objects(num__in=nums)
        for temp in list_dict:
            dict_names[temp.num] = temp.chname
        return dict_names

    def addChnameVariable(self, list_data, **kwargs) -> []:
        '''
            将传入的台风数据列表添加chname字段
        :param list_data:
        :return:
        '''
        dict_names = self.getTyphoonChNameDict(**kwargs)
        list_dataFinal = []
        if len(dict_names) > 0:
            [list_dataFinal.append(TyphoonModel(temp.code, temp.date, temp.num, dict_names.get(temp.num)))
             for
             temp in
             list_data]
        else:
            list_dataFinal = list_data
        return list_dataFinal


class BaseDetailListView(abc.ABC):

    @abc.abstractmethod
    def load(self, code: str, stationname: str):
        ''' 根据台风code以及海洋站name加载的连续测值'''
