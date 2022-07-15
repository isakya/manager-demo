/**
 * api 管理
 */
import request from './../utils/request'
export default {
  login(params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params,
    })
  },
  noticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {},
      mock: true
    })
  },
  getMenuList() {
    return request({
      url: '/menu/list',
      method: 'get',
      mock: true,
      data: {}
    })
  },
  getUserList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      mock: false,
      data: params
    })
  },
  userDel(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      mock: false,
      data: params
    })
  },
  getRoleList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      mock: true,
      data: {}
    })
  },
  getDeptList() {
    return request({
      url: '/dept/list',
      method: 'get',
      mock: true,
      data: {}
    })
  },
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      mock: true,
      data: params
    })
  },
}