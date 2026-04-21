import Mock from 'mockjs'
import homeApi from './mockData/home'

Mock.mock('/api/home/getTableData', 'get', homeApi.getTableData)

Mock.mock('/api/home/getCountData', 'get', homeApi.getCountData)

Mock.mock('/api/home/getChartData', 'get', homeApi.getChartData)
