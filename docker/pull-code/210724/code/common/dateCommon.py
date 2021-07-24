from datetime import datetime, date, timedelta
import calendar


def getYearDateRange(year):
    '''
        获取该年的起止日期
    :param year:
    :return:
    '''
    start = datetime.strptime(f"{year}/01/01 00:00", '%Y/%m/%d %H:%M')
    #     end=None
    end = datetime.strptime(f"{year}/12/31 23:59", '%Y/%m/%d %H:%M')
    return start, end


def sortTyphoonNum(list: [], desc: bool, index: int) -> []:
    '''
        根据传入的list（num:str）通过 desc 进行排序，分界线为index
    :param list:
    :param desc:
    :return:
    '''
    old_list=[]
    present_list=[]
    [present_list.append(num) if int(num[:2])<index else old_list.append(num) for num in list]
    # 分别对 old 与 present 进行排序
    old_list=sorted(old_list, key=lambda x: int(x), reverse=desc)
    present_list = sorted(present_list, key=lambda x: int(x), reverse=desc)
    return present_list+old_list if desc else old_list+present_list
