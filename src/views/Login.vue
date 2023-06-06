<template>
  <div class="login-body">
    <div class="login-panel">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input clearable placeholder="请输入账号" size="large" v-model.trim="formData.account">
            <template #prefix>
              <span class="inonfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input clearable placeholder="请输入密码" size="large" type="password" v-model.trim="formData.account">
            <template #prefix>
              <span class="inonfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input clearable placeholder="请输入验证码" size="large" v-model.trim="formData.account">
            <template #prefix>
              <span class="inonfont icon-checkcode"></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};
</script>

<style lang="scss" scoped></style>
