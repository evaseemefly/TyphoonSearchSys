## 出现的一些问题及解决办法收集：

### 1-vue：

1.

使用 `mouseleave` 实现鼠标移出时事件的触发，使用 `mouseout` 可能可会引发冒泡，而出现一些问题，建议使用`mouseleave`

```html

<div
    class="card mt10"
    v-if="isDateShow"
    @mouseleave="hiddeDateForm()"
></div>
```

2. 对于由子组件调用父组件中的方法时，若想直接获取子组件的对象，并修改或为子组件的对象添加属性可以通过如下方式实现

子组件中：触发父组件的某个方法，并将`this`（也就是 myself）传过去

```js
// 根据当前的range以及经纬度提交后台返回对应的台风列表
  getRangeTyphoonList(): void {
    var myself = this;
    // 触发父组件的请求方法
    this.$emit("loadTyphoonList", myself);
  }
```

在父组件中，直接为传入的子组件对象新增新的属性

```js
loadTyphoonListByRange(pageInfo): void {
    var myself = this;
    //
    pageInfo.to='xxx'
    }
```

---

### 2-element-ui：

[官方 api](https://element.eleme.cn/#/zh-CN/component/pagination)

1.使用 pagination 时出现的问题

```html
 <el-pagination
              background
              layout="prev, pager, next"
              :total="typhoonCodeDataTotal"
              :page-size="typhoonCodePageSize"
              :pager-count="3"
              @current-change="onCurrentIndex"
            >
  </el-pagination>

```

参考官方 api 中的参数描述
pager-count 页码按钮的数量，当总页数超过该值时会折叠 number 大于等于 5 且小于等于 21 的奇数 7
此处若 pager-count 小于 5 的话会出现 bug
提示错误信息如下：

```
vue.runtime.esm.js?2b0e:619
[Vue warn]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "typhoonCodeDataTotal"
```

暂时无法解决，会关注此问题
[网上的同样错误的](https://github.com/ElemeFE/element/issues/14055)

---

### 3 leaflet

1. leaflet 中引入 echarts 的散点图  
   使用超图的 iclent 中的`echartsLayer`  
   [超图-iclient](http://iclient.supermap.io/web/apis/leaflet.html)

---

## 收集的一些资料

### markdown 语法相关

[Markdown 语法介绍](https://coding.net/help/doc/project/markdown.html)

[一份简明的 Markdown 笔记与教程](https://github.com/mzlogin/markdown-intro)

### pytho 相关

实现虚拟类中定义虚拟属性方法

枚举的实现：
[enum 枚举的实现](https://www.cnblogs.com/codingmylife/archive/2013/05/31/3110656.html)

实现 switch 的方式：
[参考文章](https://www.zhihu.com/question/21123544)

```
def case1(somearg):
    pass
def case2(somearg):
    pass
def case3(somearg):
    pass

switch={
1: case1,
2: case2,
3: case3
}

switch[case](arg)
```

#### python 常用语法

1. 异常处理

#### python 环境配置

1. 使用 pycharm 创建虚拟环境（by anaconda3）

2. 快速查看 python 所在路径

```python
>>> import sys
>>> print(sys.path)
['', '/Users/drno/anaconda3/lib/python36.zip', '/Users/drno/anaconda3/lib/python3.6', '/Users/drno/anaconda3/lib/python3.6/lib-dynload', '/Users/drno/anaconda3/lib/python3.6/site-packages', '/Users/drno/anaconda3/lib/python3.6/site-packages/aeosa']
```

[Python 学习之工具准备——Anaconda+Pycharm 的安装过程](https://zhuanlan.zhihu.com/p/36389880)

---

### 前端集成及设计

[从前端角度看企业软件的研发过程](https://www.yuque.com/xufei-coder/code/fd0gv5?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

[如何设计一个优秀的分布式系统？重要因素、工具、策略都在这里](https://mp.weixin.qq.com/s/XTh46Zj8aCLJ-hN84cnRXQ)

### flutter 相关

[Flutter 学习资料及笔记总结](https://liudanking.com/beautiful-life/flutter-learn-tutorial/?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

### ide

[用 vscode 开发 vue 应用](https://segmentfault.com/a/1190000019055976?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

### nosql

[redis 的重要知识点](https://github.com/Weiwf/redis-mindmap/blob/master/README.md?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

### 电子书资源汇总

[经典技术书籍 PDF](https://github.com/royeo/awesome-programming-books)
