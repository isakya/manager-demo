/**
 * Vuex状态管理
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import sotrage from './../utils/sotrage'

const state = {
  userInfo: sotrage.getItem('userInfo') || {} // 获取用户信息
}
export default createStore({
  state,
  mutations
})