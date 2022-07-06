/**
 * axios 二次封装
 * */
import axios from 'axios'
import config from './../config'
import router from './../router'
import { ElMessage } from 'element-plus'

const TOKEN_INVALID = 'Token认证失败，请重新登陆'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建 axios 实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  // TO-DO
  const headers = req.headers
  if (!headers.Authorization) headers.Authorization = 'Bear izumi'
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 15000)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * 请求的核心函数
 * @param {*} options 请求的配置
 * 调用方式一
 */
function request(options) {
  // 配置请求方法
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  // 局部mock
  if (typeof options.mock !== 'undefined') {
    config.mock = options.mock
  }
  // 配置请求地址
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  return service(options)
}
// 示例
/* proxy.$request({
  method: 'get',
  url: '/login',
  data: {
    name: 'izumi'
  }
}).then((res) => {
  console.log(res)
}) */


// 调用方式二
['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})
// 示例
// proxy.$request.get('/login', { name: 'izumi' },{mock:true, loading:true}).then(res => console.log(res))

export default request