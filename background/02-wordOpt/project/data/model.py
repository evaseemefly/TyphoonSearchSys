from mongoengine import *

class DisasterWordInfo(Document):
    '''
        灾情word描述信息
    '''
    # 台风code
    code=StringField(max_length=20)
    # word内容
    wordDocument=StringField()

    meta={
        'collection':'disasterword'
    }