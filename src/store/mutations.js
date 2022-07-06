/**
 * Mutations业务层数据提交
 */

import storage from './../utils/sotrage'

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  }
}