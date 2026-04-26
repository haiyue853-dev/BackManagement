// 整个项目api统一管理
import request from './request'

export default {
  getTableData() {
    return request({
      url: '/home/getTableData',
      method: 'get',
      mock: false,
    })
  },
  getCountData() {
    return request({
      url: '/home/getCountData',
      method: 'get',
      mock: false,
    })
  },
  getChartData() {
    return request({
      url: '/home/getChartData',
      method: 'get',
      mock: false,
    })
  },
  getUserData(data) {
    return request({
      url: '/home/getUserData',
      method: 'get',
      mock: false,
      data,
    })
  },
  deleteUser(data) {
    return request({
      url: '/user/deleteUser',
      method: 'get',
      mock: false,
      data,
    })
  },
  addUser(data) {
    return request({
      url: '/user/addUser',
      method: 'post',
      mock: false,
      data,
    })
  },
  editUser(data) {
    return request({
      url: '/user/editUser',
      method: 'post',
      mock: false,
      data,
    })
  },
  getMenu(params) {
    return request({
      url: '/permission/getMenu',
      method: 'post',
      data: params,
    })
  },
  getMallData(data) {
    return request({
      url: '/mall/getMallData',
      method: 'get',
      mock: false,
      data,
    })
  },
  addMall(data) {
    return request({
      url: '/mall/addMall',
      method: 'post',
      mock: false,
      data,
    })
  },
  editMall(data) {
    return request({
      url: '/mall/editMall',
      method: 'post',
      mock: false,
      data,
    })
  },
  deleteMall(data) {
    return request({
      url: '/mall/deleteMall',
      method: 'get',
      mock: false,
      data,
    })
  },
  updateProfile(data) {
    return request({
      url: '/user/updateProfile',
      method: 'post',
      mock: false,
      data,
    })
  },
}
