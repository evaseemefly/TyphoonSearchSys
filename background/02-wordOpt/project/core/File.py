import os
class FileInfo:
    def __init__(self,dir):
        self.dir=dir

    def getWordFiles(self):
        words=[]
        for root,dirs,files in os.walk(self.dir):
            print(f'root:{root}')
            print(f'dirs:{dirs}')
            print(f'files:{files}')
            if len(files)>1:
                [(lambda x:words.append(WordFile(root,x)))(file) for file in files]
            # words.append(WordFile(root,file))
        return words


class WordFile:
    '''
        读取的灾情描述word文件
    '''
    def __init__(self,dir,filename):
        self._dir=dir
        self._filename=filename


    @property
    def dir(self):
        '''
            当前路径
        :return:
        '''
        return self._dir

    @property
    def filename(self):
        '''
            当前文件名称（不含拓展名）
        :return:
        '''
        # fullpath=os.path.join(self._dir,self._filename)
        [name,ext]=os.path.splitext(self._filename)
        return name

    @property
    def ext(self):
        '''
            文件拓展名
        :return:
        '''
        try:
            [name, ext] = os.path.splitext(self._filename)
        except TypeError as err:
            print(f'当前文件为{self._dir}/{self._filename}发生了类型异常，跳出！')
            return None
        return ext

    @property
    def standard(self):
        '''
            根据文件后缀是否为 .docx 来判断是否为标准文件
        :return: 
        '''
        if(self.ext=='.docx'):
            return True
        else:
            return False

    @property
    def year(self):
        '''

        :return:
        '''

        '''
            注意实际的文件为：
            1970_7013.txt
        '''
        path_index= self.filename.split("_")
        return path_index[-2]

    @property
    def typhoonNum(self):
        path_index=self.filename.split("_")
        return path_index[-1]