from datetime import datetime,date,timedelta
import calendar

def getYearDateRange(year):
    '''
        获取该年的起止日期
    :param year:
    :return:
    '''
    start=datetime.strptime(f"{year}/01/01 00:00",'%Y/%m/%d %H:%M')
#     end=None
    end=datetime.strptime(f"{year}/12/31 23:59",'%Y/%m/%d %H:%M')
    return start,end