# -*- coding: gb2312 -*-
from docx import Document
# from docx.shared import Pt
# from docx.oxml.ns import qn
# from docx.shared import Inches
import os

##目标目录
basep = '.\\'
dirs = []
files = []
##可以指定targetpath 如果不写就在各个文件的根目录下生成docx
targetPath = '.\\result'
# targetPath=''

if targetPath == None:
    targetPath = ''

if not os.path.exists(targetPath) and targetPath != '':
    os.mkdir(targetPath)

#读取文件并生成docx
def handleFile(fplist):
    for fp in fplist:
        if os.path.exists(fp) and os.path.splitext(fp)[-1] == '.txt':
            lines = []
            f = open(fp)
            lines = f.readlines()
            f.close()
            document = Document()
            for line in lines:
                paragraph = document.add_paragraph(line)

            savepath = ''
            if targetPath != '':
                name = os.path.splitext(os.path.basename(fp))[0]
                savepath = os.path.join(targetPath, name+'.docx')
                document.save(savepath)

            else:
                name = os.path.splitext(fp)[0]
                savepath = name+'.docx'
                document.save(savepath)
            if savepath != '':
                print('file saved:', savepath)

#遍历文件夹
def detectPath(path):
    for root, dirs, files in os.walk(path):
      print(root,dirs,files)
      fplist = [os.path.join(root, f) for f in files]
      handleFile(fplist)


#执行方法
detectPath(basep)
