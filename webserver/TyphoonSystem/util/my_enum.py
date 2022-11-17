from enum import Enum, unique


@unique
class FilterTypeEnum(Enum):
    """
        过滤枚举类
    """
    # 未选择
    UNLL=1000
    """
        过滤类型枚举
    """
    """ 
    按照唯一月份过滤
    """
    UNIQUE_MONTH = 1001

    """
    按照唯一年份过滤
    """
    UNIQUE_YEAR = 1002

    """
        按照复杂条件过滤
    """
    UNIQUE_COMPLEX = 1003
