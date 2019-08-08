import model
import mongoengine
import os

filename = "stationCode.txt"
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

    f = open(filename, 'w')
    for s in stlist:
        f.write(s + ',\n')

    f.close()

def insertStationNamebyCh(fullname:str):
    '''
        根据 指定文件 测站名称对照表 向mongo中插入中英对照表
    :param fullname:
    :return:
    '''

    '''
        大致流程如下：
            -1 读取指定文件
            -2 逐行录入mongo
    '''
    pass

def main():
    pass



if __name__ == '__main__':
    main()
