<template>
  <div class="header">
    <div class="l-content">
      <el-button suzi="small" @click="handleCollapse">
        <component class="icons" is="menu"></component>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link user-entry">
          <img :src="avatarUrl" class="user" />
          <span class="user-name">{{ userInfo.username || '未命名用户' }}</span>
          <el-tag size="small" effect="dark" class="user-role">{{ userInfo.role || '未设置角色' }}</el-tag>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'
import { useAllDataStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const getImageUrl = (user) =>
  new URL(`../assets/images/${user}.png`, import.meta.url).href
const store = useAllDataStore()
const router = useRouter()
const { proxy } = getCurrentInstance() || {}
const userInfo = computed(() => store.state.userInfo || {})
const avatarUrl = computed(() => getImageUrl(userInfo.value.avatar || 'user'))

const handleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse
}

const goProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  try {
    await proxy?.$api.logout()
    ElMessage.success('已退出登录')
  } catch (error) {
    // The request layer will handle 401 and error messages.
  } finally {
    store.clearAuthState()
    router.push('/login')
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #535353;
}

.icons {
  width: 18px;
  height: 18px;
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.r-content {
  .user-entry {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
  }

  .user {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .user-name {
    font-size: 14px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-role {
    border: none;
  }
}

:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>
