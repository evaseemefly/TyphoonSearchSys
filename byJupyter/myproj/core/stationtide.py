import os, re
import pandas as pd
import numpy as np
from pandas import Series, DataFrame
import datetime
from mongoengine import *
import abc

from data.model import *
from data.middle_model import GeoTyphoonRealDataMidModel


class StationTideRealData:
    # 读取的数据
    _data = None

    # _checkpoint_arr=[]

    def __init__(self, dirPath, filename, *args, **kwargs):

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

    def open(self):
        '''
            根据全路径读取数据文件
        '''

        with open(self.fullname, 'rb') as f:
            self._data = pd.read_table(f, sep='\n', encoding='utf-8', header=None, infer_datetime_format=False)

    def getCheckPointList(self):
        '''
            获取标志位的列表
        :return:返回标志位数组
        '''
        checkpoint_arr = []
        for index in range(len(self._data)):
            #     temp= data.iloc[index][0]
            temp = self._data.iloc[index][0].split()[0]
            #     print(temp)
            if temp == '+':
                checkpoint_arr.append(index)

        return checkpoint_arr

    def convert2StationBaseModel(self, ser: Series = None, **kwargs) -> StationTideData:
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
        # if stationname == 'SHACHENG':
        #     print(kwargs.get('index'))
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

    def run(self):
        '''

        :return:
        '''
        self.open()
        connect('typhoon')
        df = self._data
        self.splitData(df, year='1956')

    def splitData(self, df: DataFrame, **kwargs):
        '''
            TODO [*] 根据df按行进行拆分
        :param df:
        :return:
        '''

        # 1 获取截取的数组
        checkpoint_arr = self.getCheckPointList()
        add_days = 0
        year = int(kwargs.get('year'))
        index_current = 0
        # 2 循环进行数据截取
        # [3,21,...]
        # '+'标志位的循环
        for index_checkpoint, val_checkpoint in enumerate(checkpoint_arr):
            index_current = val_checkpoint
            # S 基本信息所在的行
            baseinfo_ser = Series(self._data.iloc[val_checkpoint - 2][0].split())
            # 2.1 先读取基本信息
            base_model = self.convert2StationBaseModel(baseinfo_ser, year=year)
            print(baseinfo_ser)
            # 获取当前时间
            temp_date = base_model.startdate

            # 每次到标志位时，将循环时 +1 的days清零
            add_days = 0

            # 从当前 标志位+1处（2.1已经完成了读取站点基本信息的操作）开始到下一个标志位按行进行检索，并读取实时数据
            # 两个标志位之间的逐行循环
            # TODO [*] 此处修改为while，不使用range循环
            # for index, val in enumerate(range(1, checkpoint_arr[index_checkpoint + 1] - val_checkpoint)):
            if index_checkpoint + 1 < len(checkpoint_arr):
                # 是否未到下一个mark_point 并且日期计数 <4(0，1，2，3）——未读到第四天的数据（实际读取的次数——其中可能有max和min，需要跳过并不计数）
                while index_current < checkpoint_arr[index_checkpoint + 1] - 2 and add_days < setting.DAYS:
                    # 将日期计数器 +1
                    add_days = add_days + 1
                    # TODO 19-03-29 注意此处不需要转换为series了，因为无法切分（4位数的情况会与下一个位置的数字连在一起）
                    # temp_str=self._data.iloc[val_checkpoint+index+1][0]
                    index_current = index_current + 1
                    temp_str = self._data.iloc[index_current][0]
                    print(f'当前行数据{temp_str}')

                    # TODO 此处的series只是单纯为了判断是否为下一个时间标记位使用（对于其他无效果！）
                    temp_ser = Series(temp_str.split())

                    # while self.checkIsNextDateDataPoint(index_current) == False:
                    # realdata_ser=self._data.iloc(val_checkpoint)
                    # 判断是否为下一个时间节点标记位
                    # 注意 +1 操作放在此处
                    if self.checkIsNextDateDataPoint(index_current) == False:

                        realdata, index_current = self.convert2RealData4Day(temp_str,
                                                                            start_date=temp_date,
                                                                            adddays=0,
                                                                            index_current=index_current)

                        print(f'第1行:{realdata[0]}')
                        print(f'第2行:{realdata[1]}')
                        # 方式1：
                        # self.insert2model(realdata[0], base_model, type='forecast')
                        # TODO [*] 19-03-30 将返回的realdata写入model中
                        # 方式2
                        # 已对base_model中的tidedata进行了append操作
                        self.insert2model(realdata, base_model, targetdate=temp_date)
                        # 当前日期加1
                        temp_date = temp_date + datetime.timedelta(days=1)
                        print(temp_date)
                    # 注意此处不需要再 +1 了，在while 开始的地方已经 +1 了，不要再次 +1了
                    # index_current = index_current + 1
                    else:
                        add_days = add_days - 1
                        print(f'出现MAX或MIN')

                    print(f'当前位置{index_current-1}')
                    print(f'当前日期{temp_date},循环{add_days}')
                    print('-----------')
                # for index in range(3):
            else:
                # TODO
                # temp_str=self._data.iloc[val_checkpoint+index+1][0]
                index_current = index_current + 1
                temp_str = self._data.iloc[index_current][0]
                # 当前日期加1
                temp_date = temp_date + datetime.timedelta(days=1)
                print(temp_date)
                # 此处的series只是单纯为了判断是否为下一个时间标记位使用（对于其他无效果！）
                temp_ser = Series(temp_str.split())
                add_days = 0
                # while self.checkIsNextDateDataPoint(index_current) == False:
                # realdata_ser=self._data.iloc(val_checkpoint)
                # 判断是否为下一个时间节点标记位
                # 注意 +1 操作放在此处
                if self.checkIsNextDateDataPoint(index_current) == False:
                    realdata, index_current = self.convert2RealData4Day(temp_str,
                                                                        start_date=temp_date,
                                                                        adddays=0,
                                                                        index_current=index_current)
                    print(f'第1行:{realdata[0]}')

                    print(f'第2行:{realdata[1]}')
                    self.insert2model(realdata, base_model, targetdate=temp_date)
                # 注意此处不需要再 +1 了，在while 开始的地方已经 +1 了，不要再次 +1了
                # index_current = index_current + 1
                print(f'当前位置{index_current-1}')
                print('-----------')
            # TODO [*] 19-03-30调用写入mongo的操作
            try:
                base_model.save()
                print('保存成功！！')
            except Exception as e:
                print(str(e))

        pass

    def insert2model(self, arr_data: [], model: StationTideData, **kwargs):
        '''
            测试使用将arr写入model的方法
        :param arr_data:
        :param model:
        :return:
        '''

        # 方式1：
        # if 'type' in kwargs:
        #     # 找到type（real,forecast)
        #     type=kwargs.get('type')
        #     if type=='real':
        #         # 实测数据
        #         model.forecast_arr
        #
        #
        #         pass
        #     elif type=='forecast':
        #         # 预报天文潮
        #         model.realtidedata.append(TideData(forecast_arr=arr_data[:24]))
        #         pass
        # tide_data=None
        # 方式2：TODO [*] 直接将预报值与实际值都传入
        if 'targetdate' in kwargs:
            targetdate = kwargs.get('targetdate')
            extremum_realdata = arr_data[1][24:]
            extremum_forecast = arr_data[0][24:]
            real_data = RealData(realdata_arr=arr_data[1][:24],
                                 heigh_heigh_tide=Extremum(extremum_realdata[0], extremum_realdata[1]),
                                 heigh_low_tide=Extremum(extremum_realdata[2], extremum_realdata[3]),
                                 low_heigh_tide=Extremum(extremum_realdata[4], extremum_realdata[5]),
                                 low_low_tide=Extremum(extremum_realdata[6], extremum_realdata[7]))
            forecast_data = ForecastData(forecast_arr=arr_data[0][:24],
                                         heigh_heigh_tide=Extremum(extremum_forecast[0], extremum_forecast[1]),
                                         heigh_low_tide=Extremum(extremum_forecast[2], extremum_forecast[3]),
                                         low_heigh_tide=Extremum(extremum_forecast[4], extremum_forecast[5]),
                                         low_low_tide=Extremum(extremum_forecast[6], extremum_forecast[7]))
            tide_data = TideData(targetdate=targetdate,
                                 forecastdata=forecast_data,
                                 realdata=real_data
                                 )
            # 将tide_data写入model
            model.realtidedata.append(tide_data)
        pass

    # 判断是否为下一个时间时间的起始位置
    def checkIsNextDateDataPoint1(self, ser: Series) -> bool:
        '''
            判断是否为日期的标志点
            传入一行进来
        '''

        # 此处的ser已经是Series，不需要再切分了
        if len(ser) == 1:
            if ser[0] in ["MAX", "MIN"]:
                return True
        else:
            return False

    def checkIsNextDateDataPoint(self, index: int) -> bool:
        '''
            判断是否为日期的标志点
            传入一行进来
        '''

        # 此处的ser_temp是一个数组，判断长度是否为1，若为1，则取出唯一的值并判断是否是在指定的数组中的值
        ser_temp = self._data.iloc[index][0].split()
        if len(ser_temp) == 1:
            if ser_temp[0] in ["MAX", "MIN"]:
                return True
        else:
            return False

    def convert2RealData4Day(self, ser: str, **kwargs):
        '''
            将当前行，转成实时model
            将经过处理后的数组返回
        :param ser:
        :return:
        '''
        # S1 -获取起始时间
        start_date = kwargs.get('start_date')
        # S2 -获取要加的天数 暂时不需要了
        days = kwargs.get('adddays')
        # 获取当前的index
        index_current = kwargs.get('index_current')
        # target_line=ser
        # 获取当前的line（str）
        # 读取一日的数据（共3行，有可能出现第4行——可能为max或min——交给外面判断）
        index_temp = 0
        finial_data_list = []
        none_list = ['', '--']
        for index_recycle in range(3):
            # 当前读取的行
            index_temp = index_current + index_recycle
            if index_recycle + 1 < 3:
                index_recycle = index_recycle + 1
                target_line_str = self._data.iloc[index_temp][0]
                realdata_arr = []
                # 24小时的实时数据的步长
                step_24h = 4
                # 24小时的实时数据的列起始位置
                index_realdata_temp = 5
                # 2-1  找到 0-23 时刻的实时数据
                for i, val in enumerate(range(index_realdata_temp, len(target_line_str), step_24h)):
                    #     print(i)
                    if i < 24:
                        # print(f'num:{i+1}')
                        # print(f'start:{val}|end:{val+step_24h}')
                        # #     if val!=0:
                        # #         print(val)
                        # print(target_line_str[val:val + step_24h])
                        # TODO [*] 注意此处可能出现空置
                        val_temp = target_line_str[val:val + step_24h].strip()
                        try:

                            realdata_arr.append((setting.DEFAULT_VAL) if val_temp in none_list else int(val_temp))
                        except ValueError as ex:
                            print(str(ex))
                # print('-------------')
                step = 4
                # 极值的列起始位置
                index_max = 102
                # 极值的步长
                step_max = 9

                # 2-2 获取极值
                for i, val in enumerate(range(index_max, len(target_line_str), step_max)):
                    #     print(i)
                    if i < 24:
                        # print(f'num:{i+1}')
                        # print(f'start:{val}|end:{val+step_max}')

                        #     if val!=0:
                        #         print(val)

                        # print(f'val:{target_line_str[val:val+step]}|val2:{target_line_str[val+step:val+step*2]}')
                        # print(f'hour:{int(target_line_str[val:val+step][:2])}|min:{int(target_line_str[val:val+step][2:])}')
                        # TODO [*] 时间
                        now_date = start_date + datetime.timedelta(days=days)
                        year = now_date.year
                        month = now_date.month
                        day = now_date.day
                        val_hour = target_line_str[val:val + step][:2]
                        val_min = target_line_str[val:val + step][2:]
                        # TODO [*] 可能出现空值
                        if val_hour.strip() in none_list:
                            datetime_temp = setting.DEFAULT_DATE
                            val_temp = setting.DEFAULT_VAL
                        else:
                            try:
                                datetime_temp = datetime.datetime(year,
                                                                  month,
                                                                  day,
                                                                  int(target_line_str[val:val + step][:2]),
                                                                  int(target_line_str[val:val + step][2:]))
                                val_temp = int(target_line_str[val + step:val + step * 2])
                            except:
                                datetime_temp = None
                                val_temp = None
                                print(f'出错所在位置{index_temp}')

                        realdata_arr.append(datetime_temp)
                        # 潮位
                        realdata_arr.append(val_temp)
                        # print('----')

                finial_data_list.append(realdata_arr)
                pass
            # 对于当日 1，2 行数转成数组
            else:
                break

        # while index_recycle<3:

        return finial_data_list, index_temp

