from mongoengine import *
import os
import pandas as pd
from pandas import Series, DataFrame
import datetime

from .model import *

class StationTideRealData:

    # 读取的数据
    _data = None
    # _checkpoint_arr=[]

    def __init__(self, dirPath, filename, * args, **kwargs):

        self.dirPath = dirPath
        self.filename = filename

        # return super().__init__(*args, **kwargs)
        pass

    @property
    def fullname(self):
        '''
            返回全文件名称
        '''
        return os.path.join(self.dirPath, self.filename)

    def open(self, fullname):
        '''
            根据全路径读取数据文件
        '''
        with open(fullname, 'rb') as f:
            self._data = pd.read_table(f, sep='\n', encoding='utf-8',
                                  header=None, infer_datetime_format=False)


    def getCheckPointList(self):
        '''
            获取标志位的列表
        :return:返回标志位数组
        '''
        checkpoint_arr=[]
        for index in range(len(self._data)):
            #     temp= data.iloc[index][0]
            temp = self._data.iloc[index][0].split()[0]
        #     print(temp)
            if temp == '+':
                checkpoint_arr.append(index)

        return checkpoint_arr

    def convert2StationBaseModel(self,stationname:str,ser: Series = None, **kwargs):
        '''
            根据传入的series，根据指定位置进行截取
        '''
        # 获取年份
        year = int(kwargs.get('year'))
        latlon = [float(f"{ser[9][:-2]}.{ser[9][-2:]}"), float(f"{ser[7][:-2]}.{ser[7][-2:]}")]
        code = ser[2]
        # 起始时间
        startdate = datetime.date(year, int(ser[3]), int(ser[4]))
        stationname = ser[5]
        if stationname == 'SHACHENG':
            print(kwargs.get('index'))
        # 平均海平面
        lev = int(ser[11])
        # 警戒潮位
        jw = int(ser[13])
        # 潮汐调和常数
        harmonicconstant = ser[14]
        point = [latlon[1], latlon[0]]
        stationtidedata = StationTideData(code=code,
                                          startdate=startdate,
                                          stationname=stationname,
                                          lev=lev,
                                          jw=jw,
                                          harmonicconstant=harmonicconstant,
                                          point=point)
        return stationtidedata

    def convert2RealData1(index: int, dt: DataFrame = None, **kwargs):
        # 极大值序列
        max_ser = Series(dt.iloc[index][0].split())
        # 极小值序列
        min_ser = Series(dt.iloc[index + 1][0].split())
        # 从极大致序列与极小值序列中提取时间（月-日）
        month = max_ser[0]
        day = min_ser[0]
        year = int(kwargs.get('year'))
        target_date = datetime.date(year, month, day)
        # 获取极大值数组
        max_arr = max_ser[1:25]
        # 获取极小值数组
        min_arr = min_ser[1:25]
        max_1 = max_ser[25, 27]
        max_2 = max_ser
        pass

    def splitData(self,df:DataFrame):
        '''
            根据df按行进行拆分
        :param df:
        :return:
        '''


        pass

    def convert2RealData(self,ser:Series,**kwargs):
        '''
            将当前行，转成实时model
            将经过处理后的数组返回
        :param ser:
        :return:
        '''
        temp=ser[0]
        realdata_arr=[]
        # 24小时的实时数据的步长
        step_24h=4
        # 24小时的实时数据的列起始位置
        index_realdata=5
        # 找到 0-23 时刻的实时数据
        for i, val in enumerate(range(index_realdata, len(temp), step_24h)):
            #     print(i)
            if i < 24:
                print(f'num:{i+1}')
                print(f'start:{val}|end:{val+step_24h}')
                #     if val!=0:
                #         print(val)
                print(temp[val:val + step_24h])
                realdata_arr.append(int(temp[val:val + 4]))

        step = 4
        # 极值的列起始位置
        index_max = 102
        # 极值的步长
        step_max = 9

        year = 1958
        month = 9
        day = 4
        for i, val in enumerate(range(index_max, len(temp), step_max)):
            #     print(i)
            if i < 24:
                print(f'num:{i+1}')
                print(f'start:{val}|end:{val+step_max}')

                #     if val!=0:
                #         print(val)
                print(f'val:{temp[val:val+step]}|val2:{temp[val+step:val+step*2]}')
                print(f'hour:{int(temp[val:val+step][:2])}|min:{int(temp[val:val+step][2:])}')
                # 时间
                temp_datetime = datetime.datetime(year, month, day, int(temp[val:val + step][:2]),
                                                  int(temp[val:val + step][2:]))
                realdata_arr.append(temp_datetime)
                # 潮位
                realdata_arr.append(int(temp[val + step:val + step * 2]))
                print('----')
        return realdata_arr


