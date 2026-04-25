import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission'

Mock.mock('/api/home/getTableData', 'get', homeApi.getTableData)

Mock.mock('/api/home/getCountData', 'get', homeApi.getCountData)

Mock.mock('/api/home/getChartData', 'get', homeApi.getChartData)

Mock.mock(/\/api\/home\/getUserData/, 'get', userApi.getUserList)

Mock.mock(/\/api\/user\/deleteUser/, 'get', userApi.deleteUser)
Mock.mock(/\/api\/user\/addUser/, 'post', userApi.createUser)

Mock.mock(/\/api\/user\/editUser/, 'post', userApi.updateUser)
Mock.mock(/\/api\/permission\/getMenu/, 'post', menuApi.getMenu)
