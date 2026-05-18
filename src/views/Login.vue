<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'

const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useAllDataStore()

const loginForm = reactive({
  username: '',
  password: ''
})

async function handleLogin() {
  const res = await proxy.$api.getMenu(loginForm)
  store.updateMenuList(res.menuList)
  store.setToken(res.token)
  store.setUserInfo(res.userInfo)
  store.addMenu(router)
  router.push('/home')
}
</script>

<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h1>后台管理系统</h1>
      <el-form-item>
        <el-input
          v-model="loginForm.username"
          type="text"
          placeholder="请输入账号"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="loginForm.password"
          type="password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.body-login {
  width: 100%;
  min-height: 100vh;
  background-image: url(../assets/images/background.png);
  background-size: cover;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 350px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
