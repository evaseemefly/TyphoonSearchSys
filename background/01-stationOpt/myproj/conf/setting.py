
import datetime
# 单位 处理台风对应的测站数据的路径
# DIR_PATH=r"/Users/liusihan/Documents/01project/TyphoonSearchSys/demo_data"
# DIR_PATH=r"/Users/liusihan/Documents/01project/TyphoonSearchSys/data/station/2014"
# mac16 测站数据
# DIR_PATH=r"/Users/drno/Documents/01proj/TyphoonSearchSys/data/station/2014"
# 单位 处理台风的实时气象数据
DIR_PATH=r"/Users/liusihan/Documents/01project/TyphoonSearchSys/data/typhoon"
# mac16 处理台风是的实时气象数据
# DIR_PATH=r"/Users/drno/Documents/01proj/TyphoonSearchSys/data/typhoon"
# 家中
# DIR_PATH=r"/Users/casablanca/03project/typhoonSearchSys/demo_data"

# aw
# DIR_PATH=r"D:\01proj\typhoon\TyphoonSearchSys\data\typhoon"
# p52s
# DIR_PATH=r"D:\04git仓库\TyphoonSearchSys\demo_data"

# w540
# DIR_PATH=r"D:\02git仓库\TyphoonSearchSys\data\typhoon"

FILE_TARGET=r'5622.txt'

MONGO_STATIONTIDEDATA_DOCUMENT_NAME='geostationtidedata'

# 每个时间标志位之间最多存4日的数据
DAYS=4

DEFAULT_VAL=-9999
DEFAULT_DATE=datetime.date(1701,1,1)

#mongodb相关
_MONGODB_NAME = 'typhoon'