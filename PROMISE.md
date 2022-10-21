## 规约
### 1 git的规约
本项目 webserver的忽略清单
<pre><code>
├──TyphoonSystem      <=webserver中的子目录
├──.idea              <= 后端的pycharm的相关配置，不要提交
├──apps              
│ ├──__pycache__  <= 不要提交
├──common              
│ ├──__pycache__  <= 不要提交
├──env            <= 虚拟环境不需要提交
├──TyphoonSystem              
│ ├──__pycache__  <= 不要提交
|─.gitignore      <= git忽略的配置，最好同步。
</code></pre>

对于本地已有的已忽略的文件，第一次拉取时请先删除，随后再恢复，此种方法比较省力。  
对于大面积修改或新增的代码段，请在起始位置加入`TODO -by user`  
每次修改之后请新建其他的修改分支，分支命名规范:  
1. 新增的主要功能分支： *added_分支描述_作者* 
2. 重构的主要功能分支: *rebbuild_分支描述_作者*  

修改后会将新建分支的release版本，合并至主分支master中，请及时同步master分支。  
合并后有错误请先在本地自行修改并调试，再提交请求。