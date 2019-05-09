from docx import Document
import os
from core.Paragraph import *
from data.model import *
from mongoengine import *

targetfilename=r"5622.docx"
# aw
# targetpath=r"D:\01proj\typhoon\TyphoonSearchSys\demo_data"
# P52S
targetpath=r"D:\04git仓库\TyphoonSearchSys\demo_data"

fullname=os.path.join(targetpath,targetfilename)


def readtxt(filename):
    '''
        读取word文档
    :param filename:
    :return:
    '''
    doc = Document(filename)
    fullText = []
    # ((lambda x: fullText.append(x) )(para))
    for para in doc.paragraphs:
        if len(para.text)>0:
            fullText.append(para.text)
    return '\n'.join(fullText)

def main():
    code='5622'
    par= Paragraph(targetpath,targetfilename)
    # 写入mongo
    connect('typhoon')
    dis=DisasterWordInfo(code=code,wordDocument=par.wordText)
    dis.save()
    print(par.wordText)

if __name__=='__main__':
    main()
# print (readtxt(fullname))