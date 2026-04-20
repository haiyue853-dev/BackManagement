import Mock from 'mockjs'
import homeApi from './mockData/home'

Mock.mock('/api/home/getTableData', 'get', homeApi.getTableData)

Mock.mock('/api/home/getCountData', 'get', homeApi.getCountData)
