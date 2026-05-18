<template>
  <el-aside :width="width">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
    >
      <h3 v-show="!isCollapse">通用后台管理系统</h3>
      <h3 v-show="isCollapse">后台</h3>

      <el-menu-item
        v-for="item in noChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <component :is="item.icon" class="icons" />
        <span>{{ item.label }}</span>
      </el-menu-item>

      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.path || item.label"
        :index="item.path || item.label"
      >
        <template #title>
          <component :is="item.icon" class="icons" />
          <span>{{ item.label }}</span>
        </template>

        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.path"
          :index="subItem.path"
          @click="handleMenu(subItem)"
        >
          <component :is="subItem.icon" class="icons" />
          <span>{{ subItem.label }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'

const store = useAllDataStore()
const router = useRouter()
const route = useRoute()

const list = computed(() => store.state.menuList)
const noChildren = computed(() => list.value.filter((item) => !item.children))
const hasChildren = computed(() => list.value.filter((item) => item.children))
const isCollapse = computed(() => store.state.isCollapse)
const width = computed(() => (isCollapse.value ? '64px' : '180px'))
const activeMenu = computed(() => route.path)

function handleMenu(item) {
  if (!item.path) return
  router.push({ path: item.path })
  store.selectMenu(item)
}
</script>

<style scoped lang="less">
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}

.el-menu {
  border-right: none;

  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}

.el-aside {
  height: 100%;
  background-color: #545c64;
}
</style>
