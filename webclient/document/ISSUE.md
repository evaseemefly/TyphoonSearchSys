## 出现的一些问题及解决办法收集：

### 1-vue：

1.

使用 `mouseleave` 实现鼠标移出时事件的触发，使用 `mouseout` 可能可会引发冒泡，而出现一些问题，建议使用`mouseleave`

```

<div
    class="card mt10"
    v-if="isDateShow"
    @mouseleave="hiddeDateForm()"
></div>
```

2. 对于由子组件调用父组件中的方法时，若想直接获取子组件的对象，并修改或为子组件的对象添加属性可以通过如下方式实现

子组件中：触发父组件的某个方法，并将`this`（也就是 myself）传过去

```
// 根据当前的range以及经纬度提交后台返回对应的台风列表
  getRangeTyphoonList(): void {
    var myself = this;
    // 触发父组件的请求方法
    this.$emit("loadTyphoonList", myself);
  }
```

在父组件中，直接为传入的子组件对象新增新的属性

```
loadTyphoonListByRange(pageInfo): void {
    var myself = this;
    //
    pageInfo.to='xxx'
    }
```

---

## 收集的一些资料

### markdown 语法相关

[Markdown 语法介绍](https://coding.net/help/doc/project/markdown.html)

[一份简明的 Markdown 笔记与教程](https://github.com/mzlogin/markdown-intro)

### pytho 相关

#### python 常用语法

1. 异常处理

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
