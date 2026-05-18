<template>
  <div class="header">
    <div class="l-content">
      <el-button size="small" @click="handleCollapse">
        <component is="Menu" class="icons" />
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link user-entry">
          <img :src="avatarUrl" class="user" />
          <span class="user-name">{{ userInfo.username || '未登录用户' }}</span>
          <el-tag size="small" effect="dark" class="user-role">
            {{ userInfo.role || '未设置角色' }}
          </el-tag>
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAllDataStore } from '@/stores'

const { proxy } = getCurrentInstance() || {}
const store = useAllDataStore()
const router = useRouter()

const userInfo = computed(() => store.state.userInfo || {})
const avatarUrl = computed(
  () => new URL(`../assets/images/${userInfo.value.avatar || 'user'}.png`, import.meta.url).href
)

function handleCollapse() {
  store.toggleCollapse()
}

function goProfile() {
  router.push('/profile')
}

async function handleLogout() {
  try {
    await proxy?.$api.logout()
    ElMessage.success('退出登录成功')
  } catch (error) {
    // 请求层会统一处理错误提示。
  } finally {
    store.clearAuthState()
    router.push('/login')
  }
}
</script>

<style scoped lang="less">
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
