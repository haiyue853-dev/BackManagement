const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api/home/getTable',
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api/home/getTable',
  },
  prod: {
    baseApi: '//future.com/api',
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api/home/getTable',
  },
}

export default {
  env,
  ...EnvConfig[env],
  mock: false,
}
