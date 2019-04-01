
import datetime

class TyphoonModel:
    def __init__(self,code:str,date:datetime.datetime):
        self.code=code
        self._date=date

    @property
    def year(self):
        return self._date.year