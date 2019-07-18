<template>
    <div>
        <TyphoonLevelFrame></TyphoonLevelFrame>
    </div>
</template>

<script lang="ts">
// 本子组件为图例组件，现包含 台风登记划分图例 与 
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TyphoonLevelFrame from './children/typhoon_level_frame.vue'
@Component({
    components:{
        TyphoonLevelFrame:TyphoonLevelFrame
    }
})
export default class legendFrame extends Vue{

}
</script>

<style>

</style>

