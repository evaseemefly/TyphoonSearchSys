<template>
  <div class="disaster-pic-container alert">
    <div class="alert-heading">
      <button class="btn btn-info" @click="displayOrHide">灾情图片</button>
    </div>
    <transition name="fade">
      <div class="disaster-pic-main" style="width:400px;" v-show="display">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide
            v-for="(item,index) in items"
            v-bind:key="index"
            style="height:400px;width:400px"
          >
            <img :src="item" class="disasterImg">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </transition>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { getDisasterPicPath, getBaseHostPicPath } from "@/api/api.js";

export default {
  data() {
    return {
      display: false,
      items: [],
      swiperOption: {
        height: 400,
        width: 400,
        loop: true,
        notNextTick: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "bullets"
        },
        slidesPerView: "auto",
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 10,
        onSlideChangeEnd: swiper => {
          this.page = swiper.realIndex + 1;
          this.index = swiper.realIndex;
        }
      }
    };
  },
  name: "app",
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    targetTyphoon() {
      return this.$store.state.map.typhoon;
    }
  },
  watch: {
    targetTyphoon(data) {
      let app = this;
      if (!data) return;
      let year = data.year;
      let num = data.num;
      getDisasterPicPath(year, num).then(res => {
        if (res.status === 200) {
          let imgPartUrlList = res.data;
          let imgUrlList = [];
          for (let i in imgPartUrlList) {
            imgUrlList.push(getBaseHostPicPath() + imgPartUrlList[i]);
          }
          if (imgUrlList.length > 0) app.items = imgUrlList;
          else {
            app.items = [];
            app.display = false;
          }
          app.swiper.slideTo(0, 0, true);
        }
      });
    }
  },
  methods: {
    displayOrHide() {
      if (this.items.length == 0) {
        alert("没有灾情展示");
        return;
      }
      this.display = !this.display;
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted() {
    this.swiper.slideTo(0, 0, true);
  }
};
</script>
<style scoped>
.disaster-pic-main {
  height: 400px;
  width: 500px;
  margin-top: 10px;
}
.disaster-pic-container {
  right: 35px;
  height: 500px;
  top: 40%;
  position: fixed;
  z-index: 9999;
}
.disaster-pic-img {
  height: 100%;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.disasterImg {
  border-radius: 10px;
  height: 100%;
  width: 100%;
}
</style>



