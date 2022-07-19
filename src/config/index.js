/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: 'http://106.12.161.180:3000/api',
    mockApi: 'https://www.fastmock.site/mock/b09b110c04e039773df12c4cc0e50817/api'
  },
  test: {
    baseApi: 'http://106.12.161.180:3000/api',
    mockApi: 'https://www.fastmock.site/mock/b09b110c04e039773df12c4cc0e50817/api'
  },
  prod: {
    baseApi: 'http://106.12.161.180:3000/api',
    mockApi: 'https://www.fastmock.site/mock/b09b110c04e039773df12c4cc0e50817/api'
  }
}
export default {
  env,
  mock: false,
  // 命名空间
  namespace: 'manager',
  ...EnvConfig[env]
}