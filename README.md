# TyphoonSearchSys

#历史台风相似路径查询系统

## 项目描述

本项目为历史台风及风暴潮查询显示系统  
主要参与人员：
[evaseemefly](https://github.com/evaseemefly)
[stupidanimal](https://github.com/stupidanimal)

---

## 项目主要构成目录

前后端的相关描述请详见`webclient`与 `webserver` 目录下的 readme 文件
[前端 readme](/webclient/README.md) 较详细
进度及问题：
[进度](/webclient/document/SCHEDULE.md)
[相关问题收集](/webclient/document/ISSUE.md)
[规约](/PROMISE.md)
- 22-11-04 新加入的工程化文档  
  - [工程化](/ENGINEERING.md)--具体记录详见(onenote-6-服务器部署)

[部分自己总结的知识点请见](https://github.com/evaseemefly/CodingBook/blob/417c6fb1860c6b5fd77e8a77da1c45d44f3793da/README.md) 以后均汇总至此

---
* @copyright: nmefc & [evaseemefly](https://github.com/evaseemefly)  
* 若有引用请写明出处

---


### 项目界面大致如下：

- v0.5 版本

1. 范围搜索，根据点选的位置，以及框选圆的半径获取该范围内的台风列表
   ![avatar](/document/img/20190514171719.png)
2. 根据复杂查询条件获取匹配条件的台风列表
   ![avatar](/document/img/20190514172637.png)
3. 根据复杂查询条件获取匹配后的台风列表，点选台风列表后可以加载台风的历史轨迹的时间列表，点选后加载该时刻全部测站的数据
   ![avatar](/document/img/20190514172716.png)

4. 如表移入台风中心位置后加载该时刻的台风的气象数据
   ![avatar](/document/img/20190515105544.png)

5. 点击指定时刻的台风加载指定时刻对应的测站数据
   ![avatar](/document/img/20190522220708.png)

6. 历史潮位数据查询页面
   ![avatar](document/img/WX20190620-213846.png)

---

- v 1.0 版本

1. 地图页面加入了台风详情信息框（配色需再与当前配色统一）
   ![avatar](document/img/WX20190620-213739.png)

2. 点击测站加载整个过程的三条曲线以及极值（现只获取过程中增水最大值及对应的时刻）  
   by _19-06-27_
   ![avatar](document/img/WX20190627-180029.png)

3. 缩小到一定级别（6 级）后测站的风暴增水只显示数值  
    by _19-06-27_
   缩放前：
   ![avatar](document/img/WX20190627-221200.png)
   缩放后：
   ![avatar](document/img/WX20190627-221214.png)

4. 点击台风后加载该过程共影响的测站数量
   by _19-06-29_
   不同数量的颜色略有不同
   ![avatar](document/img/WX20190629-171743.png)
   ![avatar](document/img/WX20190629-171806.png)
   ![avatar](document/img/WX20190629-171819.png)

5) 级别改为下拉菜单，对应为 1-6 级（val 对应也是 1-6），并加上对应的风速范围（热带低压->强台风）
   by _19-06-30_
   效果如下：  
   ![avatar](document/img/WX20190630-114713.png)

6. 点击台风后加载的灾情图片
   by _19-07-03_
   ![avatar](document/img/WX20190703-151902.png)
   收起的效果
   ![avatar](document/img/WX20190703-151933.png)
   展开的效果
   ![avatar](document/img/WX20190703-151942.png)

7. 录入全部测站数据后的效果
   by _19-07-11_
   ![avatar](document/img/WX20190711-192858.png)
   ![avatar](webclient/document/img/WX20190711-192946.png)


----
22-10-14 日起开始重构此项目
#### 22-10-25
1- 重构了页面布局;   
2- 台风路径加入了线性过度以及对应的台风icon;  
3- 底部`btn-bar`加入了重新设计后的`时间组件`,当前时间组件步长:1h,加入了对当前时刻的对应位置示意的线性插值功能;  
4- 台风列表进行了重构，见右侧
![avatar](document/img/WX20221025-150840@2x.png)

#### 22-10-26
1- 加入了海洋站风暴增水组件(tideChartsFormView + stationTideForm);  
2- 以及对应的全部逻辑;  
3- 对于增水form与tySearch form 均加入了拖拽功能.  
![avatar](document/img/QQ20221026-153736@2x.png)

#### 22-10-27 
1- 地图修改为浅色底图(个人更倾向于深色);  
2- 增水曲线加入了`天文潮` `风暴增水`与`实况` 以及对应样式,加入了对于缺省值的NaN过滤处理.  
![avatar](document/img/v2_03.png)

####  22-10-28  
1- 对于地图中显示的站点加入了逐时的增水surge值显示,并加入了对应的四色警戒
![avatar](document/img/v2_04.png)
![avatar](document/img/v2_05.png)
2- 加入了根据当前台风`tyNum`获取该过程的所有站点的极值情况集合
![avatar](document/img/v2_06.png)

#### 22-11-01  
1- 加入了隐藏的关联操作  
![avatar](document/img/v2_08.png)  
2- 极值显示列表中加入了对应的四色  

#### 22-11-07
1- 加入了图例
![avatar](document/img/v2_11.png)  
2- 完成了极值列表与对应预报时刻台风所在位置与站点的联动
3- 实现了三个缩略按钮的对应逻辑

#### 22-11-09  
1- 加入了站点名称中英文的映射关系  
2- 修复了由于 `stationName` 与 `stationCode` 混用导致的部分bug
3- 修复了由于缺少过程某个站而导致无法加载 极值集合列表组件 与 站点分布无法加载 的bug
4- 修复了 tideChart 组件中的一些bug并加入了x轴的 format 
![avatar](document/img/v2_12.png)

#### 22-11-11  
1- 在各个子form中加入了最小化按钮，取消了缩略按钮中的最小化按钮，修改了对应的逻辑
* 在查询集合组件中加入了最小化按钮
![avatar](document/img/v2_13.png)
* 在详情中加入了最小化按钮
![avatar](document/img/v2_14.png)
* 在缩略组件中取消了最小化按钮
![avatar](document/img/v2_15.png)

#### 22-11-14  
1- 加入了根据圈选范围加载途经的所有台风的分布散点|热图;  
* 散点
![avatar](document/img/v2_21.png)
* 热图
![avatar](document/img/v2_20.png)
* 加载热图及选定台风
![avatar](document/img/v2_18.png)  
2- 底部操作栏中加入了切换按钮  
逻辑:  
* 点击展开并默认加载热图
* 切换散点加载散点  
![avatar](document/img/v2_22.png)  
3- 部分按钮加入了描述信息