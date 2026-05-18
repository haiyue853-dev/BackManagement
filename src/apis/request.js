import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config'
import router from '@/router'
import { useAllDataStore } from '@/stores'

const service = axios.create()
const NETWORK_ERROR = '网络异常，请稍后重试'
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

service.interceptors.request.use(
  (requestConfig) => {
    const token = getToken()

    if (token) {
      requestConfig.headers = requestConfig.headers || {}
      requestConfig.headers.Authorization = `Bearer ${token}`
    }

    return requestConfig
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (res) => {
    const { code, data, message, msg } = res.data

    if (code === 200) {
      return data
    }

    const errorMessage = message || msg || NETWORK_ERROR
    ElMessage.error(errorMessage)
    return Promise.reject(new Error(errorMessage))
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || NETWORK_ERROR

    ElMessage.error(message)

    if (status === 401) {
      clearAuthAndRedirect()
    }

    return Promise.reject(error)
  }
)

function request(options) {
  const requestOptions = {
    method: 'get',
    ...options
  }

  if (requestOptions.method.toLowerCase() === 'get') {
    requestOptions.params = requestOptions.data
  }

  let isMock = config.mock
  if (typeof requestOptions.mock !== 'undefined') {
    isMock = requestOptions.mock
  }

  service.defaults.baseURL = isMock ? config.mockApi : config.baseApi

  return service(requestOptions)
}

export default request
