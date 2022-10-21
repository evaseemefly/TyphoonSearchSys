<template>
  <div id="my-footer">

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class footer extends Vue {}
</script>

<style scoped>
#my-footer {
  /* background: green; */
  /* background: #2c3e50; */
  background: linear-gradient(to right, #2c3e50 30%, rgba(4, 107, 114, 0.639));
  width: 100%;
  flex: 0.5;
}
</style>
