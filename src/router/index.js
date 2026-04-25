import { resolveDirective } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

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
]

const router = createRouter({
  //设置路由模式
  history: createWebHistory(),
  routes,
})

export default router
