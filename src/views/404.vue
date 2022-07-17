<template>
  <div class="container">
    <div style="font-size: 50px;margin-bottom: 20px;">404 页面不存在</div>
    <el-button type="success" @click="goHome">回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, toRefs, ref } from "vue"
const { proxy } = getCurrentInstance()
const goHome = () => {
  proxy.$router.push('/')
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>