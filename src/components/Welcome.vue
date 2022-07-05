<script setup>
import { defineProps, reactive } from 'vue'
defineProps({
  msg: {
    type: String,
    default: 'lisi'
  }
})
</script>

<template>
  <div>welcome-{{msg}}</div>
  <router-link to="login">去登陆</router-link>
</template>

<style scoped>
</style>
