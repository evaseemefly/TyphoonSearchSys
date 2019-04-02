
import datetime

class TyphoonModel:
    def __init__(self,code:str,date:datetime.datetime):
        self.code=code
        self._date=date

    @property
    def year(self):
        return self._date.year

class TideRealMidModel:
    '''
        潮位站的实时数据与实践 mid model
    '''
    __slots__ = ['val','occurred']

    def __init__(self,val:int,occurred:datetime.datetime):
        self.val=val
        self.occurred=occurred