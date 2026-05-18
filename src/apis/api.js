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
      url: '/users',
      method: 'get',
      mock: false,
      data,
    })
  },
  deleteUser(id) {
    return request({
      url: `/users/${id}`,
      method: 'delete',
      mock: false,
    })
  },
  addUser(data) {
    return request({
      url: '/users',
      method: 'post',
      mock: false,
      data,
    })
  },
  editUser(id, data) {
    return request({
      url: `/users/${id}`,
      method: 'put',
      mock: false,
      data,
    })
  },
  getAccountData(data) {
    return request({
      url: '/accounts',
      method: 'get',
      mock: false,
      data,
    })
  },
  addAccount(data) {
    return request({
      url: '/accounts',
      method: 'post',
      mock: false,
      data,
    })
  },
  editAccount(id, data) {
    return request({
      url: `/accounts/${id}`,
      method: 'put',
      mock: false,
      data,
    })
  },
  resetAccountPassword(id, data) {
    return request({
      url: `/accounts/${id}/password`,
      method: 'put',
      mock: false,
      data,
    })
  },
  deleteAccount(id) {
    return request({
      url: `/accounts/${id}`,
      method: 'delete',
      mock: false,
    })
  },
  getMenu(params) {
    return request({
      url: '/permission/getMenu',
      method: 'post',
      mock: false,
      data: params,
    })
  },
  logout() {
    return request({
      url: '/permission/logout',
      method: 'post',
      mock: false,
    })
  },
  getMallData(data) {
    return request({
      url: '/malls',
      method: 'get',
      mock: false,
      data,
    })
  },
  addMall(data) {
    return request({
      url: '/malls',
      method: 'post',
      mock: false,
      data,
    })
  },
  editMall(id, data) {
    return request({
      url: `/malls/${id}`,
      method: 'put',
      mock: false,
      data,
    })
  },
  deleteMall(id) {
    return request({
      url: `/malls/${id}`,
      method: 'delete',
      mock: false,
    })
  },
  updateProfile(data) {
    return request({
      url: '/profile',
      method: 'put',
      mock: false,
      data,
    })
  },
  getProfile() {
    return request({
      url: '/profile',
      method: 'get',
      mock: false,
    })
  },
}
