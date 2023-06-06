<template>
  <div  class="avatar" :style="{ width: width + 'px', height: width + 'px', 'border-radius': width / 2 + 'px' }">
    <el-image v-if="userId" :style="{ width: width + 'px', height: width + 'px', 'border-radius': width / 2 + 'px' }" :src="globalInfo.avatarUrl+userId" fit="scale-down" loading="lazy" @click="goToUcenter"></el-image>
    <div v-else class="no-login">未登录</div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const props = defineProps({
  userId: {
    type: String,
  },
  width: {
    type: Number,
    default: 60
  },
  addLink: {
    type: Boolean,
    default: true
  }
})
const goToUcenter = () => {
  if (props.addLink) {
    router.push('/user/' + props.userId)
  }
}
</script>
<style lang="scss">
.avatar{
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: #ddd;
  .no-login{
    width: 100%;
    text-align: center;
    font-size: 13px;
    
  }
}
</style>