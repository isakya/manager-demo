<script>
export default {
  name: 'app',
  // 测试storage所封装的功能
  mounted() {
    this.$storage.setItem('name', 'izumi')
    console.log(this.$storage.getItem('name'))
    // this.$storage.clearItem('name')
    // this.$storage.clearAll()
  }
}
</script>

<template>
  <router-view></router-view>
</template>

<style>
</style>
