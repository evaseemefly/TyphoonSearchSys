import model
import mongoengine
import os
import re

# 读取的文件夹路径
# target_path=r'D:\02proj\TyphoonSearchSys\data\ext'
# mac
target_path=r'../../data/ext'

file_name = "stationCode.txt"
mongoengine.connect('typhoon', host="127.0.0.1:27017")


def produceStationNameList():
    '''
        创建 station 的 name 列表，并写入文本
    :return:
    '''
    st = model.StationTideData

    res = st.objects.distinct('stationname')

    stlist = list(res)

    stlist.sort()

    f = open(file_name, 'w')
    for s in stlist:
        f.write(s + ',\n')

    f.close()

def insertStationNamebyCh(fullname:str):
    '''
        根据 指定文件 测站名称对照表 向mongo中插入中英对照表
        此部分与读取typhoonNameDict的类似
    :param fullname:
    :return:
    '''

    '''
        大致流程如下：
            -1 读取指定文件
            -2 逐行录入mongo
    '''
    # 注意在win下面不需要加入 encoding='utf-8'
    # 注意若在mac下需要设定编码格式为 gb2312
    with open(fullname,'r',encoding='gb2312') as file:
        list=file.readlines()
        for station in list:
            try:
                temp=station.split(',')
                pattern = re.compile(r'\w*')
                name_ch = pattern.match(temp[1]).group()
                model.StationNameDict(name=temp[0],chname=name_ch).save()
            except IndexError as err:
                print(f'{temp},index出现错误')
    pass

def main():
    fullname=os.path.join(target_path,file_name)
    insertStationNamebyCh(fullname)
    print('录入完成')
    print('-------------------')
    pass



if __name__ == '__main__':
    main()
