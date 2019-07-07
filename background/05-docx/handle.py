# -*- coding: gb2312 -*-
from docx import Document
# from docx.shared import Pt
# from docx.oxml.ns import qn
# from docx.shared import Inches
import os

##Ŀ��Ŀ¼
basep = '.\\'
dirs = []
files = []
##����ָ��targetpath �����д���ڸ����ļ��ĸ�Ŀ¼������docx
targetPath = '.\\result'
# targetPath=''

if targetPath == None:
    targetPath = ''

if not os.path.exists(targetPath) and targetPath != '':
    os.mkdir(targetPath)

#��ȡ�ļ�������docx
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

#�����ļ���
def detectPath(path):
    for root, dirs, files in os.walk(path):
      print(root,dirs,files)
      fplist = [os.path.join(root, f) for f in files]
      handleFile(fplist)


#ִ�з���
detectPath(basep)
