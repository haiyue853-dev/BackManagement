import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission'
import mallApi from './mockData/mall'
import profileApi from './mockData/profile'

Mock.mock('/api/home/getTableData', 'get', homeApi.getTableData)
Mock.mock('/api/home/getCountData', 'get', homeApi.getCountData)
Mock.mock('/api/home/getChartData', 'get', homeApi.getChartData)

Mock.mock(/\/api\/home\/getUserData/, 'get', userApi.getUserList)
Mock.mock(/\/api\/user\/deleteUser/, 'get', userApi.deleteUser)
Mock.mock(/\/api\/user\/addUser/, 'post', userApi.createUser)
Mock.mock(/\/api\/user\/editUser/, 'post', userApi.updateUser)

Mock.mock(/\/api\/mall\/getMallData/, 'get', mallApi.getMallList)
Mock.mock(/\/api\/mall\/deleteMall/, 'get', mallApi.deleteMall)
Mock.mock(/\/api\/mall\/addMall/, 'post', mallApi.createMall)
Mock.mock(/\/api\/mall\/editMall/, 'post', mallApi.updateMall)

Mock.mock(/\/api\/user\/updateProfile/, 'post', profileApi.updateProfile)
Mock.mock(/\/api\/permission\/getMenu/, 'post', menuApi.getMenu)
