/**
 * Mutations业务层数据提交
 */

import storage from './../utils/sotrage'

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  },
  saveUserMenu(state, menuList) {
    state.menuList = menuList
    storage.setItem('menuList', menuList)
  },
  saveUserAction(state, actionList) {
    state.actionList = actionList
    storage.setItem('actionList', actionList)
  }
}