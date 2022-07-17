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

// 定义全局指令
app.directive('has', {
  beforeMonut: ((element, binding) => {
    // 获取按钮全选
    let actionList = storage.getItem('actionList')
    let value = binding.value
    // 判断列表中是否有对应去按钮权限标识
    let hasPermission = actionList.includes(value)
    if (!hasPermission) {
      // 隐藏按钮
      element.style = 'display:none'
      // 删除按钮节点 , 需要等dom渲染完成后才能删除节点，所以需要加上 setTimeout()
      setTimeout(() => {
        element.parentNode.removeChild(el)
      }, 0)
    }
  })
})


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
