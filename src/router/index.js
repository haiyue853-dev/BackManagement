import { createRouter, createWebHistory } from 'vue-router'
import { useAllDataStore } from '@/stores'

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/User.vue'),
      },
      {
        path: 'mall',
        name: 'mall',
        component: () => import('@/views/Mall.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAllDataStore()
  const token = store.state.token

  if (!token && to.path !== '/login') {
    next('/login')
    return
  }

  if (token && to.path === '/login') {
    next('/home')
    return
  }

  const menuList = Array.isArray(store.state.menuList) ? store.state.menuList : []
  const dynamicRouteNames = menuList.flatMap((item) =>
    item.children ? item.children.map((child) => child.name) : [item.name],
  )
  const needRestoreRoutes =
    token &&
    menuList.length > 0 &&
    dynamicRouteNames.some((name) => name && !router.hasRoute(name))

  if (needRestoreRoutes) {
    store.addMenu(router)
    next({ ...to, replace: true })
    return
  }

  next()
})

export default router
