import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'

Mock.mock('/api/home/getTableData', 'get', homeApi.getTableData)

Mock.mock('/api/home/getCountData', 'get', homeApi.getCountData)

Mock.mock('/api/home/getChartData', 'get', homeApi.getChartData)

Mock.mock(/\/api\/home\/getUserData/, 'get', userApi.getUserList)

Mock.mock(/\/api\/user\/deleteUser/, 'get', userApi.deleteUser)
Mock.mock(/\/api\/user\/addUser/, 'post', userApi.createUser)
