import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import request from './utils/request'
import storage from './utils/sotrage'
import api from './api'
import store from './store'


const app = createApp(App)

// 解决图标不显示问题
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


//重要：如何全局挂载方法
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api


app.use(router).use(store).use(ElementPlus, { size: 'default' }).mount('#app')
