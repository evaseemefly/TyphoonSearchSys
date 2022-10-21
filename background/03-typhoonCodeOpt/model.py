from mongoengine import *


class GeoTyphoonRealData(Document):
    '''
        支持geojson的存储至mongodb的model
    '''
    code = StringField(max_length=10)
    num = StringField()
    date = DateTimeField()
    bp = FloatField()
    wsm = FloatField()
    # 注意此处与django中的类型不同，django的类型为IntegerField，mongoengine为IntField！
    level = IntField()
    # latlon=models.ForeignKey(Point,on_delete=models.CASCADE)
    latlon = PointField()
    meta = {'collection': 'geotyphoonrealdata'}

    def __str__(self):
        return f'code:{self.code}|num:{self.num}|date:{self.date}|bp:{self.bp}|wsm:{self.wsm}|level:{self.level}|latlon:{self.latlon}'


class TyphoonNumChDict(Document):
    '''
        台风名称对照表
    '''
    # 台风英文名称
    code = StringField(max_length=10)
    # 台风编号
    num = StringField()
    # 台风对应中文名字
    chname = StringField(max_length=50)
    meta = {'collection': 'typhoonnumchdict'}
