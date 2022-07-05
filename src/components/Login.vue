<script setup>
import { useRouter } from 'vue-router'
// 拿到全局方法
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const router = useRouter()
const goHome = () => {
  router.push('/welcome')
}

proxy.$request({
  method: 'get',
  url: '/login',
  data: {
    name: 'izumi'
  }
}).then((res) => {
  console.log(res)
})

proxy.$request.get('/login', { name: 'izumi' }).then(res => console.log(res))
</script>

<template>
  <div>login</div>
  <el-button @click="goHome">回首页</el-button>
</template>

<style scoped>
</style>
