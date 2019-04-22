
import datetime
# 单位
# DIR_PATH=r"/Users/liusihan/Documents/01project/TyphoonSearchSys/demo_data"
# 家中
# DIR_PATH=r"/Users/casablanca/03project/typhoonSearchSys/demo_data"

# aw
# DIR_PATH=r"D:\01proj\typhoon\TyphoonSearchSys\demo_data"
# p52s
DIR_PATH=r"D:\04git仓库\TyphoonSearchSys\demo_data"

FILE_TARGET=r'5622.txt'

MONGO_STATIONTIDEDATA_DOCUMENT_NAME='geostationtidedata'

# 每个时间标志位之间最多存4日的数据
DAYS=4

DEFAULT_VAL=-9999
DEFAULT_DATE=datetime.date(1701,1,1)