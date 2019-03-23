from rest_framework.decorators import APIView

class BaseView(APIView):
    def getTyphoonList(self,*args,**kwargs):
        '''
            获取台风路径集合（由子类实现）
        :param args:
        :param kwargs:
        :return:
        '''
        pass