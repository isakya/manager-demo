/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/b09b110c04e039773df12c4cc0e50817/api'
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/b09b110c04e039773df12c4cc0e50817/api'
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/b09b110c04e039773df12c4cc0e50817/api'
  }
}
export default {
  env,
  mock: true,
  // 命名空间
  namespace: 'manager',
  ...EnvConfig[env]
}