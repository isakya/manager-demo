/**
 * Vuex状态管理
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import sotrage from './../utils/sotrage'

const state = {
  userInfo: sotrage.getItem('userInfo') || {}, // 获取用户信息
  menuList: sotrage.getItem('menuList') || [], // 获取菜单列表
  actionList: sotrage.getItem('actionList') || [] // 获取按钮列表
}
export default createStore({
  state,
  mutations
})