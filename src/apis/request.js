import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config'
import router from '@/router'
import { useAllDataStore } from '@/stores'

const service = axios.create()
const NETWORK__ERROR = '网络错误'
const STORAGE_KEY = 'allDataStore'

function getToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return ''
    return JSON.parse(raw)?.token || ''
  } catch {
    return ''
  }
}

function clearAuthAndRedirect() {
  try {
    const store = useAllDataStore()
    store.clearAuthState()
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }

  if (router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
}

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 添加响应拦截器
service.interceptors.response.use(
  (res) => {
    const { code, data, message, msg } = res.data
    if (code == 200) {
      return data
    } else {
      const errorMessage = message || msg || NETWORK__ERROR
      ElMessage.error(errorMessage)
      return Promise.reject(errorMessage)
    }
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || NETWORK__ERROR

    if (status === 401) {
      ElMessage.error(message)
      clearAuthAndRedirect()
    } else {
      ElMessage.error(message)
    }

    return Promise.reject(error)
  }
)

function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  let isMock = config.mock
  if (typeof options.mock != 'undefined') {
    isMock = options.mock
  }
  if (config.env === 'prod') {
    // 不能用mock
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  return service(options)
}
export default request
