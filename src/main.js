import { createApp } from 'vue'

import App from './App.vue'
import 'element-plus/dist/index.css'
import '@/assets/less/index.less'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import api from '@/apis/api'
if (import.meta.env.DEV) {
  import('@/apis/mock.js')
}

const pinia = createPinia()
const app = createApp(App)
app.config.globalProperties.$api = api
app.use(pinia)

app.use(router).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
