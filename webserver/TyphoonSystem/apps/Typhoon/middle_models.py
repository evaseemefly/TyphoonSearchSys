
import datetime
from apps.Typhoon.models import *

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

class StationTideMidModel:
    __slots__ = ['station','tide_arr']

    def __init__(self,station:StationTideData,tide_arr:[]):
        self.station=station
        self.tide_arr=tide_arr

class StationTideMaxMidModel:
    __slots__ = ['station','tide']

    def __init__(self,station:StationTideData,tide:TideRealMidModel):
        self.station=station
        self.tide=tide