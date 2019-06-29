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
[前端 readme](/webclient/README.md)  
进度及问题：
[进度](/webclient/document/SCHEDULE.md)
[相关问题收集](/webclient/document/ISSUE.md)
[规约](/PROMISE.md)

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

3. 缩小到一定级别（6级）后测站的风暴增水只显示数值  
 by _19-06-27_
 缩放前：
 ![avatar](document/img/WX20190627-221200.png)
缩放后：
 ![avatar](document/img/WX20190627-221214.png)

 4. 点击台风后加载该过程共影响的测站数量
 by _19-06-29_
 不同数量的颜色略有不同
 ![avatar]( document/img/WX20190629-171743.png)
 ![avatar]( document/img/WX20190629-171806.png)
  ![avatar]( document/img/WX20190629-171819.png)