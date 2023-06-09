<template>
  <div class="cover-upload">
    <el-upload name="file" :show-file-list="false" accept=".png,.PNG,.jpg,.JPG,.gif,.GIF,.bmp,.BMP" :multiple="false"
      :http-request="uploadImage">
      <div class="cover-upload-btn">
        <template v-if="loadFile">
          <img :src="loadFile">
        </template>
        <template v-else>
          <img :src="(imageUrlPrefix ? imageUrlPrefix : globalInfo.imageUrl) + modelValue.imageUrl"
            v-if="modelValue && modelValue.imageUrl">
          <span class="iconfont icon-add" v-else></span>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue"
const { proxy } = getCurrentInstance();
const props = defineProps({
  imageUrlPrefix: {
    type: String
  },
  // 父组件 v-model 没有指定参数名，则默认是 modelValue
  modelValue: {
    type: Object,
    default: null
  }
})
const loadPreview = ref(false)
const loadFile = ref()
const emit = defineEmits()
const uploadImage = async (file) => {
  file = file.file
  let img = new FileReader()
  img.readAsDataURL(file)
  img.onload = ({ target }) => {
    loadFile.value = target.result
  }
  loadPreview.value = true
  emit('update:modelValue', file)
}
</script>

<style lang="scss">
.cover-upload {
  .cover-upload-btn {
    background-color: #f9f9f9;
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    overflow: hidden; //加上这一段就可以避免超出
    justify-content: center;

    .iconfont {
      font-size: 50px;
      color: #ddd;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
