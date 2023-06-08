<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form :model="formData" label-width="120px">
        <!--input输入-->
        <el-form-item label="发布人">
          <Avatar :userId="formData.userId" :width="40"></Avatar>
          <span :style="{ 'margin-left': '5px' }">{{ formData.nickName }}</span>
        </el-form-item>
        <el-form-item label="文件名">
          <span>{{ formData.fileName }}</span>
        </el-form-item>
        <el-form-item label="文件大小">
          <span>{{ formData.fileSize }}</span>
        </el-form-item>
        <el-form-item label="下载所需积分">
          <span>{{ formData.integral }}</span>
        </el-form-item>
        <el-form-item label="文件名">
          <a
            :href="'/api/forum/attachmentDownload?fileId=' + formData.fileId"
            target="_blank"
            class="a-link"
            >下载</a
          >
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue"
const { proxy } = getCurrentInstance();
const dialogConfig = reactive({
  show: false,
  title: "查看附件",
  buttons: [
   {
    type: "danger",
    text: "关闭",
    click: (e) => {
      dialogConfig.show=false
    },
  },
 ],
});
const api={
  getAttachment:'/forum/getAttachment'
}
const formData=ref({})
const show =async (nickName,articleId)=>{
  dialogConfig.show=true
  let result =await proxy.Request({
    url:api.getAttachment,
    params:{
      articleId:articleId
    }
  })
  if(!result){
    return
  }
  formData.value=result.data
  formData.value.nickName=nickName
}
defineExpose({show})
</script>

<style lang="scss"></style>
