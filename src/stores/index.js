import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'allDataStore'

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

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return initState()

  try {
    const parsed = JSON.parse(raw)
    return {
      ...initState(),
      ...parsed,
      tags: parsed.tags?.length ? parsed.tags : initState().tags,
      menuList: Array.isArray(parsed.menuList) ? parsed.menuList : [],
      routerList: Array.isArray(parsed.routerList) ? parsed.routerList : [],
    }
  } catch {
    return initState()
  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(loadState())

  function persistState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  }

  function selectMenu(val) {
    state.value.currentMenu = val
    const index = state.value.tags.findIndex((item) => item.name === val.name)
    if (index === -1) {
      state.value.tags.push(val)
    }
    persistState()
  }

  function removeTag(tag) {
    const index = state.value.tags.findIndex((t) => t.name === tag.name)
    if (index !== -1) {
      state.value.tags.splice(index, 1)
      persistState()
    }
  }

  function updateMenuList(val) {
    state.value.menuList = Array.isArray(val) ? val : []
    persistState()
  }

  function setToken(token) {
    state.value.token = token || ''
    persistState()
  }

  function clearAuthState() {
    state.value = initState()
    localStorage.removeItem(STORAGE_KEY)
  }

  function addMenu(router) {
    const menu = state.value.menuList
    const modules = import.meta.glob('../views/**/*.vue')

    const routeArr = []

    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          const url = `../views/${child.url}.vue`
          if (modules[url]) {
            child.component = modules[url]
          }
          routeArr.push(child)
        })
      } else {
        const url = `../views/${item.url}.vue`
        if (modules[url]) {
          item.component = modules[url]
        }
        routeArr.push(item)
      }
    })

    routeArr.forEach((routeConfig) => {
      if (!router.hasRoute(routeConfig.name)) {
        router.addRoute('main', routeConfig)
      }

      if (!state.value.routerList.includes(routeConfig.name)) {
        state.value.routerList.push(routeConfig.name)
      }
    })

    persistState()
  }

  return {
    state,
    selectMenu,
    removeTag,
    updateMenuList,
    addMenu,
    setToken,
    clearAuthState,
  }
})
