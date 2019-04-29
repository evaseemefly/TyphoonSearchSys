from docx import Document
import os

targetfilename=r"5622.docx"
targetpath=r"D:\01proj\typhoon\TyphoonSearchSys\demo_data"
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


print (readtxt(fullname))