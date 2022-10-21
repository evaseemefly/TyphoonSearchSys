import os, re
import pandas as pd
import numpy as np
from data.middle_model import GeoTyphoonRealDataMidModel


class TyphoonFileInfo:
    '''
        单台风文件info
    '''

    def __init__(self, dir, name):
        self.dir_path = dir
        self.file_name = name
        self.data = None

    @property
    def full_name(self):
        return os.path.join(self.dir_path, self.file_name)

    def _read_file(self):
        '''
            根据fullname通过pandas读取文件，并保存至data中
        :return:
        '''
        with open(self.full_name, 'rb') as f:
            # TODO:[*] 19-07-17
            # pandas.errors.ParserError: Error tokenizing data. C error: Expected 6 fields in line 4, saw 15
            self.data = pd.read_table(f, sep='\s+', encoding='utf-8', header=None, infer_datetime_format=False,error_bad_lines=False)
            # self.data = pd.read_table(f, sep='\s+', encoding='utf-8', header=None, infer_datetime_format=False,
            #                           error_bad_lines=False)
            print('读取成功')

    def _check_mark(self, index):
        '''
            判断是否为标志位
        '''
        return self.data.iloc[index][0] == 66666 and self.data.iloc[index][7] != np.nan

    def _append_mark2List(self):
        '''
            找到标志位所在的位置
        :return:
        '''
        mark_indexs = []
        for i in range(len(self.data)):
            #     print(i)
            if self._check_mark(i):
                mark_indexs.append(i)
        return mark_indexs

    def _append_started_mark(self):
        '''
           保存起止数组的数组
        :return:
        '''
        # 保存起止数组的数组
        list_startend = []
        index = 0
        # 找到标志位所在位置获取标志位置数组
        mark_indexs = self._append_mark2List()

        for val in mark_indexs:
            #     list_startend.append(mark_indexs[index:2])
            #     print(mark_indexs[index:index+2])
            list_startend.append(mark_indexs[index:index + 2])
            index = index + 1
        #     print(index)
        return list_startend

    def run(self):
        # 1 读取文件
        self._read_file()
        # 2 获取起止位置数组
        list_startend = self._append_started_mark()
        # 3 写入数据库
        GeoTyphoonRealDataMidModel().save_mongo(self.data,list_startend)


class TyphoonRealData:
    def __init__(self, dir_path, *args, **kwargs):
        self.dir_path = dir_path
        pass

    @property
    def all_files(self):
        '''
            获取全部的.txt文件
        :return:
        '''
        list_files = os.listdir(self.dir_path)
        list_filted = list(filter(lambda x: re.match('^.+.txt$', x), list_files))
        return list_filted

    def run(self):
        '''
            执行方法
        :return:
        '''
        for file in self.all_files:
            TyphoonFileInfo(self.dir_path,file).run()
            print(f'{os.path.join(self.dir_path,file)}已处理完成！')
            print('————————')
