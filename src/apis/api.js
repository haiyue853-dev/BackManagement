// 整个项目api统一管理
import request from './request'
//首页左侧表格数据

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
}
