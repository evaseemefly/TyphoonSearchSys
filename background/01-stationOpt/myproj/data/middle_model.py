from datetime import datetime
from .model import GeoTyphoonRealData
from mongoengine import *
from conf.setting import TZ_UTC_8

from core.common import local2utc

class GeoTyphoonRealDataMidModel:
    '''
        支持geojson的存储至mongodb的model
    '''

    def _convert_2typhoon(self, obj, code, num: str):
        '''
            根据传入的series将其转为typhoob Model
        '''
        lat = float(f"{str(obj[2])[:-1]}.{str(obj[2])[-1:]}")
        lon = float(f"{str(obj[3])[:-1]}.{str(obj[3])[-1:]}")
        stamp_str = obj[0]
        # TODO 注意此处需要修改num的值
        stamp = datetime.strptime(str(stamp_str), '%Y%m%d%H')
        # TODO:[-] 19-07-25 加入时区
        # todo:[*] 19-08-06 注意现在确定读取的台风数据为utc时间，此处不需要再做转换
        # stamp=local2utc(stamp)
        # stamp = stamp.replace(tzinfo=TZ_UTC_8)
        # num_str = str(stamp_str)[2:4] + str('%02d' % num)
        num_str = str(num).zfill(4)
        typhoon_temp = GeoTyphoonRealData(code=code,
                                          date=stamp,
                                          num=num_str,
                                          bp=obj[4],
                                          wsm=obj[5],
                                          level=obj[1],
                                          latlon=[lon, lat])
        return typhoon_temp

    def _get_header_body(self, data, start, end=None):
        '''
            根据df的起止位置截取其中的头部（66666	0	25	0	1	0	6.0	(nameless)	20180501.0），
            以及数据内容body（2017041406	0	109	1302	1010	10）
        '''
        header = data.iloc[start - 1]
        body = data.iloc[start:end, 0:6]
        return header, body

    def _init_typhoon_list(self, data, list_startend):
        typhoon_list = []
        for start in list_startend:
            start_index = start[0]
            end_index = None
            if len(start) == 1:
                end_index = None
            else:
                #         start_index=start[0]
                end_index = start[1]
            # 获取header与body
            #     header,body=None
            header, body = self._get_header_body(data, start_index + 1, end_index)
            # 从header中获取name
            #     typhoon_code=header[7]
            #     typhoon_num=header[3]
            #     typhoon_startdate=datetime.strptime(str(int(header[8]),'%Y%m%d'))

            #     print(header)
            #     print(f"code:{typhoon_code}|num:{typhoon_num}|typhoon_date:{str(int(header[8]))}")

            #     print(f"当前body长度{len(body)}")
            for i in range(len(body)):
                if i >= len(body) - 1:
                    print("跳出本次循环")
                    break
                temp_typhoon = body.iloc[i]
                print(f"当前i:{i}")
                print(f"当前index:{start_index+1+i}")
                print(f"当前header:\n{header}")
                print(f"当前body:\n{body.iloc[i+1]}")
                print(f"写入的台风code为{header[7]}!!")
                # TODO:[*] 19-05-09 可能出现得问题：ValueError: day is out of range for month
                try:
                    # TODO:[-] 19-06-30 注意此处存在一个bug，注意iloc是根据index进行索引（注意index是从0开始的）
                    # typhoon_list.append(self._convert_2typhoon(body.iloc[i + 1], header[7], header[4]))
                    typhoon_list.append(self._convert_2typhoon(body.iloc[i], header[7], header[4]))
                except ValueError as ex:
                    print(f'err:{str(ex)}')
            print('--------')
        return typhoon_list

    def save_mongo(self, data, list_startend):
        # 写入mongodb
        index_save = 0
        typhoon_list = self._init_typhoon_list(data, list_startend)
        for temp in typhoon_list:
            try:
                temp.save()
                index_save = index_save + 1
                print(f'{index_save}写入成功')
            except ValueError as ex:
                print(f'出现错误的位置{index_save}|err:{str(ex)}')
            except ValidationError as ex:
                print(f'出现错误的位置{index_save}|err:{str(ex)}')
            except OperationError as ex:
                print(f'出现经纬度错误的位置{index_save}|err:{str(ex)}')
