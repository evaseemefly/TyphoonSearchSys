<template>
  <div class="wrapper">
    <div class="card bg-light">
      <div class="card-header">测试</div>
      <div class="card-body">
        <div class="container">
          <div class="row">
            <div class="col">
              <div class="form-group row">
                <label for="deaths" class="col-form-label col-form-label-sm mr-2">死亡人数</label>
                <div class>
                  <input type="text" class="form-control form-control-sm" id="deaths" placeholder>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="form-group row">
                <label for="economical-loss" class="col-form-label col-form-label-sm mr-2">经济损失</label>
                <div class>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="economical-loss"
                    placeholder
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-group row">
                <label
                  for="water-increased"
                  class="col-form-label col-form-label-sm mr-2"
                >增&nbsp;&nbsp;水</label>
                <div class>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="water-increased"
                    placeholder
                  >
                </div>
              </div>
            </div>
            <div class="col">
              <div class="form-group row">
                <label for="sea-level" class="col-form-label col-form-label-sm mr-2">潮&nbsp;&nbsp;位</label>
                <div>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="sea-level"
                    placeholder
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-group row">
                <label
                  for="typhoon-level"
                  class="col-form-label col-form-label-sm mr-2"
                >级&nbsp;&nbsp;别</label>
                <div class>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="typhoon-level"
                    placeholder
                  >
                </div>
              </div>
            </div>
            <div class="col">
              <div class="form-group row">
                <label for="wind-speed" class="col-form-label col-form-label-sm mr-2">风&nbsp;&nbsp;速</label>
                <div class>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="wind-speed"
                    placeholder
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-group row">
                <label
                  for="air-pressure"
                  class="col-form-label col-form-label-sm mr-2"
                >气&nbsp;&nbsp;压</label>
                <div class>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="air-pressure"
                    placeholder
                  >
                </div>
                <div class="col">
                  <button class="btn btn-success" style="width:100%">查询</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container container-fluid">
          <div class="row">
            <div class="col">
              <ul class="list-group">
                <li class="list-group-item">占位条目</li>
                <li class="list-group-item">占位条目</li>
                <li class="list-group-item">占位条目</li>
                <li class="list-group-item">占位条目</li>
                <li class="list-group-item">占位条目</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
.wrapper {
  width: 600px;
  color: black;
  position: relative;
}
</style>


