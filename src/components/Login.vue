<script setup>
import Welcome from './Welcome.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
  router.push('/welcome')
}
</script>

<template>
  <div>login</div>
  <Welcome msg="zs"></Welcome>
  <el-button @click="goHome">回首页</el-button>
</template>

<style scoped>
</style>
