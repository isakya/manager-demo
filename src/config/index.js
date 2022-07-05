/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/',
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
  ...EnvConfig[env]
}