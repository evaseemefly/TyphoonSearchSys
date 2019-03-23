<template>
  <div class="col-md-8 subitem">
    <div class="card bg-info w-100">
      <div class="card-header">观测站</div>
      <div class="card-body">
        <div class="row">
          <div class="col">
            <ul class="list-group">
              <li class="list-group-item" v-for="(item,index) in date_list" :key="index" @click="listStationTimeSeries(item)">{{item}}</li>
            </ul>
          </div>

          <div class="col" v-show="currentTimeSeries.length">
            <ul class="list-group">
              <li class="list-group-item datetimeItem" v-for="(item,index) in currentTimeSeries" :key="index" @click="listTypoon(item)">{{`${item.getFullYear()}-${item.getMonth()+1}-${item.getDate()}`}}</li>
            </ul>
          </div>
        </div>
        <div class="row mt-2" v-show="currentTypoonSeries.length">
          <div class="typoonSeriesBoard col">
            <ul class="list-group w-100">
              <li class="list-group-item" v-for="(item,index) in currentTypoonSeries" :key="index">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  DataList_Mid_Model,
  DemoStationDto
} from "../../../middle_model/common";

@Component({
  data() {
    return {
      DemoStationDtoList: [
        new DemoStationDto("station1", [new Date(), new Date(), new Date()]),
        new DemoStationDto("station2", [new Date(), new Date(), new Date()]),
        new DemoStationDto("station3", [new Date(), new Date(), new Date()]),
        new DemoStationDto("station4", [new Date(), new Date(), new Date()])
      ],
      currentTimeSeries: []
    };
  },
  props: {
    target_typhoon: Object
  },
  watch: {
    target_typhoon(value) {}
  },
  filters: {
    formatDate(date: Date): String {
      return date.toDateString();
    }
  }
})
export default class SearchByStationMenu_Stations extends Vue {
  date_list: string[] = ["station1", "station2", "station3"]; // 加载的时间列表
  showTimeSeries: boolean = false;

  currentTimeSeries: Date[] = [];
  currentTypoonSeries: string[] = [];
  DemoStationDtoList: DemoStationDto[] = [
    new DemoStationDto("station1", [new Date(), new Date(), new Date()]),
    new DemoStationDto("station2", [new Date(), new Date(), new Date()]),
    new DemoStationDto("station3", [new Date(), new Date(), new Date()]),
    new DemoStationDto("station4", [new Date(), new Date(), new Date()])
  ];
  DemoTypoonDtoList: string[] = ["item1", "item2", "item3"];
  listStationTimeSeries(item: string): void {
    var target = this.DemoStationDtoList.filter(x => x.name === item);
    if (target.length > 0) {
      this.currentTimeSeries = target[0].timeSeries;
    }
  }
  listTypoon(date: Date) {
    this.currentTypoonSeries = this.DemoTypoonDtoList;
  }
}
</script>

<style scoped>
.datetimeItem {
  text-align: left;
}
.subitem {
  /* position: absolute; */
  display: flex;
  /* flex-direction: column; */
  top: 0px;
  /* margin-left: 460px; */
  /* background: rgb(166, 187, 187); */
  bottom: 12px;
}
</style>
