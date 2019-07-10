import model
import mongoengine
import os
import re

filename = "typhoonNumCode.txt"
targetpath=r'D:\02git仓库\TyphoonSearchSys\data\ext'
extfilename='typhoonNumCode.txt'
mongoengine.connect('typhoon', host="127.0.0.1:27017")
gt = model.GeoTyphoonRealData



def produceTyphoonCodeList():
    '''
        创建台风num的列表，并写入文本中
    :return:
    '''
    res = gt.objects.aggregate(
        {"$group": {"_id": "$num", "codes": {"$push": "$code"}}},
        {"$sort": {"_id": 1}}
    )

    lst = list(res)
    diclist = []
    for item in lst:
        numcode = {}
        for code in item['codes']:
            if code not in numcode.values():
                numcode[item['_id']] = code
        diclist.append(numcode)

    if os.path.exists(filename):
        os.remove(filename)

    f = open(filename, 'w')
    for item in diclist:
        for k in item.keys():
            f.write(k + ',' + item[k] + ',\n')

    f.close()

def insertTyphoonNumbyCh(fullname:str):
    '''
        根据读取的文件向mongo中插入台风中英对照表
    :return:
    '''

    '''
        大致流程如下：
            -1 读取指定文件
            -2 逐行读取并录入mongo
    '''
    with open(fullname,'r') as file:
        list=file.readlines()
        # 循环写入
        for typhoon in list:
            try:
                temp=typhoon.split(',')
                pattern=re.compile(r'\w*')
                name_ch=pattern.match(temp[2]).group()
                model.TyphoonNumChDict(code=temp[1], num=temp[0], chname=name_ch).save()
            except IndexError as err:
                print(f'{temp},index出现错误')
            # [model.TyphoonNumChDict(code=temp[1],num=temp[0],chname=temp[2]).save() for temp in typhoon.split(',')]
        pass


def main():
    # 创建typhoon的字典文件
    # produceTyphoonCodeList()

    # 要读取的字典文件
    full=os.path.join(targetpath,extfilename)
    insertTyphoonNumbyCh(full)


if __name__ == '__main__':
    main()

