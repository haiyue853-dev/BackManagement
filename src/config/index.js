const env = import.meta.env.MODE || 'development'

const baseApi = import.meta.env.VITE_API_BASE || '/api'
const mockApi =
  import.meta.env.VITE_MOCK_API ||
  'https://apifoxmock.com/m1/4068509-0-default/api'
const mock = String(import.meta.env.VITE_USE_MOCK || 'false') === 'true'

export default {
  env,
  baseApi,
  mockApi,
  mock,
}
