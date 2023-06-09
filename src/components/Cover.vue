<template>
  <div class="cover" :style="{width:width+'px',height:width+'px'}">
    <el-image :style="{width:width+'px',height:width+'px'}" fit="scale-down" loading="lazy" :src="cover?globalInfo.imageUrl+cover:localCover"></el-image>
  </div>
</template>
<script setup>
// :src="cover?globalInfo.imageUrl+cover:localCover"
const localCover=new URL('@/assets/normal.png',import.meta.url).href
const props=defineProps({
  cover:{
    type:String
  },
  width:{
    type:Number,
    default:60
  }
})
</script>
<style lang='scss'>
.cover{
  border-radius: 5px;
  overflow: hidden;
}
</style>