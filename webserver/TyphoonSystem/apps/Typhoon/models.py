from django.db import models

# Create your models here.

class TyphoonBaseInfo(models.Model):
    '''
        台风基础信息
    '''

    id=models.AutoField(primary_key=True)
    