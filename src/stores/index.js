import { defineStore } from 'pinia'
import { ref } from 'vue'

function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'home',
      },
    ],
    currentMenu: null,
    menuList: [],
    token: '',
    routerList: [],
  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())

  function selectMenu(val) {
    // 1. 更新当前菜单状态（可选，用于侧边栏高亮等）
    state.value.currentMenu = val

    // 2. 核心逻辑：查找标签是否已存在
    // 注意：确保 val 对象里有 name 属性
    let index = state.value.tags.findIndex((item) => item.name === val.name)

    // 3. 如果不存在，则 push 进数组
    index === -1 ? state.value.tags.push(val) : ''
  }

  // 建议增加一个关闭标签的方法，方便后续开发

  function removeTag(tag) {
    const index = state.value.tags.findIndex((t) => t.name === tag.name)
    if (index !== -1) {
      state.value.tags.splice(index, 1)
    }
  }
  function updateMenuList(val) {
    state.value.menuList = Array.isArray(val) ? val : []
  }

  function addMenu(router) {
    const menu = state.value.menuList
    const modules = import.meta.glob('../views/**/*.vue')

    // 1. 定义数组变量名为 routeArr
    const routeArr = []

    menu.forEach((item) => {
      if (item.children) {
        // 处理子菜单
        item.children.forEach((child) => {
          // 使用反引号构建路径
          const url = `../views/${child.url}.vue`
          if (modules[url]) {
            child.component = modules[url]
          }
          // 将子路由推入数组
          routeArr.push(child)
        })
      } else {
        // 处理无子菜单项
        const url = `../views/${item.url}.vue`
        if (modules[url]) {
          item.component = modules[url]
        }
        // 将当前路由推入数组
        routeArr.push(item)
      }
    })

    // 2. 遍历 routeArr (之前写成了 routesToAdd，导致报错)
    routeArr.forEach((routeConfig) => {
      // 3. 使用传入的参数 router (之前写成了 routerInstance，导致报错)
      // 确保 router/index.js 中父路由的 name 是 'main'
      router.addRoute('main', routeConfig)

      // 记录已添加的路由名称
      state.value.routerList.push(routeConfig.name)
    })
  }

  return {
    state,
    selectMenu,
    removeTag,
    updateMenuList,
    addMenu,
  }
})
