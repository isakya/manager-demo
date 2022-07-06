/**
 * Storage 二次封装
 * @author isakya
 * @config.namespace 命名空间
 */
import config from './../config'
export default {
  // 取出 localStorage 里面的值
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
  },
  // 把数据存到 localStorage 当中
  setItem(key, val) {
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  // 获取某项数据
  getItem(key) {
    return this.getStorage()[key]
  },
  // 删除某项
  clearItem(key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  // 删除全部
  clearAll() {
    window.localStorage.clear()
  },
}