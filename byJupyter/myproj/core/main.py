import sys
import os
curPath = os.path.abspath(os.path.dirname(__file__))
rootPath = os.path.split(curPath)[0]
sys.path.append(rootPath)

from core.stationtide import *
from conf import setting

def main():
    dir_path=setting.DIR_PATH
    file_name=setting.FILE_TARGET
    # 测试
    station=StationTideRealData(dir_path,file_name)
    # station.open()
    station.run()

if __name__=='__main__':
    main()