<template>
  <form class="form-horizontal">
    <div class="col-sm-12">
      <div class="panel panel-default boxshadow">
        <div class="panel-heading">潮位站信息</div>
        <div class="panel-body table-responsive ">
          <table class=" table table-striped table-hover table-bordered">
            <thead>
              <th>测站名称</th>
              <th>风暴增水极值</th>
              <th>对应时间</th>
              <!-- <th>吨位</th> -->
            </thead>
            <tbody>
              <tr>
                <td>台州</td>
                <td>3.5</td>
                <td class="my-th-normal">2014-07-21 13：00</td>
                <!-- <td class="my-th-warm">{{ton}}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {

}
</script>

<style scoped>
.my-th-normal {
  color: #4154de;
}
.table th {
  color: blanchedalmond;
}
.my-th-warm {
  color: rgba(255, 0, 0, 0.838);
}
/* 带一个阴影 */
.boxshadow {
  box-shadow: 2px 2px 10px grey;
}
/* 顶部字体加粗加大 */
.panel-heading {
  font-weight: bolder;
  font-size: large;
}
</style>
