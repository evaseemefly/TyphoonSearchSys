
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

class StationTideForecastMidModel:
    '''
        StationTideData->realtidedata->forecastdata->forecast_arr中的一个值
    '''
    __slots__ = ['occurred','val']
    def __init__(self,val:str,moment:datetime.datetime):
        self.val=val
        self.occurred=moment

    def __str__(self):
        return (f'val:{self.val}|occurred:{self.occurred}')

class StationTideRealMidModel:
    '''
        StationTideData->realtidedata->forecastdata->forecast_arr中的一个值
    '''
    __slots__ = ['occurred','val']
    def __init__(self,val:str,moment:datetime.datetime):
        self.val=val
        self.occurred=moment

class StationTideAllDataMidModel:
    '''
        StationTideData->realtidedata->forecastdata->forecast_arr中的一个值
    '''
    __slots__ = ['occurred','val_forecast','val_real']
    def __init__(self,val_forecast:str,val_real:str,moment:datetime.datetime):
        self.val_forecast=val_forecast
        self.val_real=val_real
        self.occurred=moment

class StationTideIncludeForecastMidModel:
    '''
        TODO 补充备注
    '''
    __slots__ = ['station', 'forecast']
    def __init__(self,station:StationTideData,forecast:StationTideAllDataMidModel):
        self.station=station
        self.forecast=forecast

