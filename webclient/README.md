# 历史台风相似路径查询系统

---
## 项目安装及启动
Project setup

```
npm install
```

Compiles and hot-reloads for development

```
npm run serve
```

Compiles and minifies for production

```
npm run build
```

---

## 项目主要参与人员

主要参与人员：

[evaseemefly](https://github.com/evaseemefly)

[stupidanimal](https://github.com/stupidanimal)

---

## 项目目录

<pre><code>.
├──README.MD  
├── document                      <=一些遇见的问题的归档 
├── src                           <=项目源代码  
│ ├── content                     <= 内容页面  
│ │ ├── center_map_range.vue      <= 包含range 范围查询功能的map主页面
│ │ ├── center_map_search.vue     <= 包含复杂查询的map主页面
                                  <= 由 map_base 与 complex_search 子组件组成
│ │ ├── backup                    <= 保存一些备份的页面（基本不再使用了）
│ │ ├── map_base                  <= 基于地图页面的 base 组件(使用mixin，并且将页面与样式从基础vue文件中分离)
│ │ ├── map_common                <= 部分公共的map的mixin组件
│ │ ├── map_complexsearch         <= 复杂查询组件页面（业务逻辑及功能由 stupidanimal 完成，风格统一由 evaseemefly完成）
│ │ ├── map_range                 <= 根据全选范围获取指定区域内的经过的台风页面
│ ├── index                       <= 几个 home 页面  
│ ├── member                      <= 组件

</code></pre>

</details>

## 组件结构说明

对于复用的 vue 组件的目录结构被拆分为 vue 与相关的 html，css 以及 mixin 拆分出来的文件

<pre><code>
├──xx_xxx_xxxx.vue      <=命名规范为 定位_组件主要名称_功能.vue  
├──xx_xxx
│ ├──xxx_data_mixin.ts  <= vue中的data
│ ├──xxx.html           <= vue中的template中的html代码，在template中由src直接指定相对路径
│ ├──xxx.css            <= vue中的style中的css代码
</code></pre>

---
### 历史台风查询页面组件说明  
历史台风查询页面-by [stupidanimal](https://github.com/stupidanimal)

<pre><code>
├── views                               <=
│ ├── content                           <= 
│ │  ├── form_static                    <=  统计页面的主文件夹
│ │  │  ├── form_static_detail.vue      <=  下半部分的数据展示子组件。主要包含： map_single 地图缩略图显示子组件（暂时使用div填充即可）， typhoon_detail_chart 可复用的echarts子组件
│ │  │  ├── form_static.vue             <=  统计页面的入口文件 需要嵌入上半部分的搜索子组件 search_statistic_typhoon 以及下半部分的数据展示 form_static_detail 子组件
│ ├── member                            <= 
│ │  ├── charts
│ │  │  ├── typhoon_detail_chart.vue    <= 台风的echarts子组件
│ │  ├── map
│ │  │  ├── map_single.vue              <= 台风路径的缩小的子组件
│ │  ├── search
│ │  │  ├── search_statistic_typhoon.vue<= 台风的搜索子组件
</code></pre>

---

## 注意事项：

1. 注意台风实时数据可能会出现一个`code`不同年份重复的问题，现在使用台风编号替代-`numn`

---

## 其他规约

代码规范参考  
[JavaScript 编码规范](https://github.com/fex-team/styleguide/blob/master/javascript.md)  
[JavaScript 开发规范](https://juejin.im/entry/599d433cf265da24797b5c66)

python 参考规范（参考 pep8）
[pep8 规范](https://zh-google-styleguide.readthedocs.io/en/latest/google-python-styleguide/)

引入的顺序

1. 框架库
2. 第三方库

3. 自定义组件及 `mixin`
4. 自定义的接口及 `model`

---

## 引用的第三方库

会逐渐补充

js 的 date 库:
[fecha](https://github.com/taylorhakes/fecha)
[vue-class-component](https://github.com/vuejs/vue-class-component)
[Vue Property Decorator](https://github.com/kaorun343/vue-property-decorator)

地图相关库：
[超图的 iclent](http://iclient.supermap.io/)

### 2 python 使用的库

[python docx](https://python-docx.readthedocs.io/en/latest/)
