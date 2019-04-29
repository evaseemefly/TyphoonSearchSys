# 作为 word中的段落
import abc
import os
from docx import Document

class IDocument(abc.ABC):
    # _document=None

    def __init__(self,dir,filename):
        self.dir=dir
        self.filename=filename
        self._document=None
        fullpath=os.path.join(dir,filename)
        self.read(fullpath)

    @abc.abstractmethod
    def load(self,iterable):
        '''

        :param iterable:
        :return:
        '''

    @abc.abstractmethod
    def read(self,fullpath:str):
        '''
            读取文档
        :param fullpath:
        :return:
        '''


class Paragraph(IDocument):
    '''
        段落
    '''

    def __init__(self,dir,filename):
        super(Paragraph, self).__init__(dir,filename)



    def read(self,fullpath):
        '''

        :return:
        '''
        if self._document is not None:
            self._document=
