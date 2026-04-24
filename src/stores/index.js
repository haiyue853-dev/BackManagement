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
  function closeTag(tag) {
    const index = state.value.tags.findIndex((t) => t.name === tag.name)
    if (index !== -1) {
      state.value.tags.splice(index, 1)
    }
  }

  return {
    state,
    selectMenu,
    closeTag,
  }
})
