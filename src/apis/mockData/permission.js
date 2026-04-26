import Mock from 'mockjs'

export default {
  getMenu: (config) => {
    const { username, password } = JSON.parse(config.body)

    if (username === 'admin' && password === 'admin') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home',
            },
            {
              path: '/mall',
              name: 'mall',
              label: '商品管理',
              icon: 'video-play',
              url: 'Mall',
            },
            {
              path: '/profile',
              name: 'profile',
              label: '个人中心',
              icon: 'avatar',
              url: 'Profile',
            },
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'user',
              url: 'User',
            },
            {
              path: 'other',
              label: '其他',
              icon: 'location',
              children: [
                {
                  path: '/page1',
                  name: 'page1',
                  label: '页面1',
                  icon: 'setting',
                  url: 'Page1',
                },
                {
                  path: '/page2',
                  name: 'page2',
                  label: '页面2',
                  icon: 'setting',
                  url: 'Page2',
                },
              ],
            },
          ],
          token: Mock.Random.guid(),
          userInfo: {
            username: 'admin',
            role: '超级管理员',
            avatar: 'user',
            signature: '今天也要把系统打磨到极致。',
            lastLoginTime: '2026-04-26 09:30:00',
            lastLoginCity: '深圳',
          },
          message: '获取成功',
        },
      }
    }

    if (username === 'xiaoxiao' && password === 'xiaoxiao') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home',
            },
            {
              path: '/profile',
              name: 'profile',
              label: '个人中心',
              icon: 'avatar',
              url: 'Profile',
            },
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'user',
              url: 'User',
            },
          ],
          token: Mock.Random.guid(),
          userInfo: {
            username: 'xiaoxiao',
            role: '运营专员',
            avatar: 'user-default',
            signature: '持续迭代，交付稳定体验。',
            lastLoginTime: '2026-04-25 20:16:00',
            lastLoginCity: '广州',
          },
          message: '获取成功',
        },
      }
    }

    return {
      code: -999,
      data: {
        message: '密码错误',
      },
    }
  },
}
