import datetime

def local2utc(local_dtm):
    '''
        将本地时间转为utc标准时间
    :param local_dtm:
    :return:
    '''
    return local_dtm+datetime.timedelta(hours=-8)