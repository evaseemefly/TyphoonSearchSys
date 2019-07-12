# -*- coding: gb2312 -*-
from docx import Document
# from docx.shared import Pt
# from docx.oxml.ns import qn
# from docx.shared import Inches
import os

##目标目录
basep = '/Users/liusihan/Documents/01project/TyphoonSearchSys/data/word/source'
# aw
basep = r'D:\01proj\typhoon\TyphoonSearchSys\data\word\source'
dirs = []
files = []
##可以指定targetpath 如果不写就在各个文件的根目录下生成docx
# targetPath = '/Users/liusihan/Documents/01project/TyphoonSearchSys/data/word/convert'
# aw
targetPath = r'D:\01proj\typhoon\TyphoonSearchSys\data\word\convert'
# targetPath=''

if targetPath == None:
    targetPath = ''

if not os.path.exists(targetPath) and targetPath != '':
    os.mkdir(targetPath)


# 读取文件并生成docx
def handleFile(fplist):
    for fp in fplist:
        if os.path.exists(fp) and os.path.splitext(fp)[-1] == '.txt':
            lines = []
            # print(fp)
            try:
                # f = open(fp)
                # f = open(fp, encoding='gb2312')
                f = open(fp, encoding='gb2312')
                # f = open(fp,encoding='utf-8')
                # UnicodeDecodeError: 'utf-8' codec can't decode byte 0xba in position 4: invalid start byte
                # UnicodeDecodeError: 'gb2312' codec can't decode byte 0x9c in position 323: illegal multibyte sequence
                lines = f.readlines()
                f.close()
                document = Document()
                for line in lines:
                    paragraph = document.add_paragraph(line)

                savepath = ''
                if targetPath != '':
                    name = os.path.splitext(os.path.basename(fp))[0]
                    savepath = os.path.join(targetPath, name + '.docx')
                    document.save(savepath)

                else:
                    name = os.path.splitext(fp)[0]
                    savepath = name + '.docx'
                    document.save(savepath)
                # if savepath != '':
                #     print('file saved:', savepath)
            except UnicodeDecodeError as uerr:
                # print('Error: {}'.format(uerr))
                print(f'异常文件为{fp},错入提示{uerr}')


# 遍历文件夹
def detectPath(path):
    for root, dirs, files in os.walk(path):
        print(root, dirs, files)
        fplist = [os.path.join(root, f) for f in files]
        handleFile(fplist)


def main():
    # 执行方法
    detectPath(basep)
    print("转换成功")


if __name__ == '__main__':
    main()
