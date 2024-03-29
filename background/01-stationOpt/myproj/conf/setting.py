import datetime
from datetime import timezone,timedelta

# ---------------
# 台风气象数据

# 单位 处理台风对应的测站数据的路径
# aw
# DIR_PATH = r"D:\01proj\typhoon\TyphoonSearchSys\data\station\txt"
# dell 7530
# DIR_PATH = r"D:\02proj\TyphoonSearchSys\data\new_ty"
# aw 台风数据
# DIR_PATH = r"D:\01proj\typhoon\TyphoonSearchSys\data\typhoon\test"
# 单位 处理台风的实时气象数据
DIR_PATH=r"/Users/liusihan/Documents/01project/TyphoonSearchSys/data/test/typhoon"

# --------------
# 测站数据
# mac 15
# DIR_PATH = r"/Users/liusihan/Documents/01project/TyphoonSearchSys/data/test/station"
# aw 测站数据

# DIR_PATH = r"D:\01proj\typhoon\TyphoonSearchSys\data\station\txt"
# 7530 测站数据
# DIR_PATH = r"D:\02proj\TyphoonSearchSys\data\station\test"
# mac16 处理台风是的实时气象数据
# DIR_PATH=r"/Users/drno/Documents/01proj/TyphoonSearchSys/data/typhoon"
# 家中
# DIR_PATH=r"/Users/casablanca/03project/typhoonSearchSys/demo_data"

# aw
# DIR_PATH=r"D:\01proj\typhoon\TyphoonSearchSys\data\typhoon\test"
# p52s
# DIR_PATH=r"D:\04git仓库\TyphoonSearchSys\demo_data"

# w540
# DIR_PATH=r"D:\02git仓库\TyphoonSearchSys\data\typhoon"

FILE_TARGET = r'5622.txt'

MONGO_STATIONTIDEDATA_DOCUMENT_NAME = 'geostationtidedata'

# 每个时间标志位之间最多存4日的数据
DAYS = 4

DEFAULT_VAL = -9999
DEFAULT_DATE = datetime.date(1701, 1, 1)

# 北京时区
TZ_UTC_8=timezone(timedelta(hours=8))
# mongodb相关
_MONGODB_NAME = 'typhoon'
# _MONGODB_HOST='192.168.0.109'
_MONGODB_HOST = '127.0.0.1'
_MONGODB_PORT = 27017
