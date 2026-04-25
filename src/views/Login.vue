<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { useAllDataStore } from '@/stores/'
import { useRouter } from 'vue-router'
const loginForm = reactive({
  username: '',
  password: '',
})
const { proxy } = getCurrentInstance()
const store = useAllDataStore()
const router = useRouter()
const handleLogin = async () => {
  const res = await proxy.$api.getMenu(loginForm)
  store.updateMenuList(res.menuList)
  store.state.token = res.token
  store.addMenu(router)
  router.push('/home')
}
</script>

<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h1>欢迎登录</h1>
      <el-form-item>
        <el-input
          type="input"
          placeholder="请输入账号"
          v-model="loginForm.username"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="passsword"
          placeholder="请输入密码"
          v-model="loginForm.password"
          show-password
        >
        </el-input>
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
  /* 建议使用 cover，保证图片铺满且不变形裁剪 */
  background-image: url(../assets/images/background.png);
  background-size: cover;
  overflow: hidden;

  /* 使用 flex 布局让登录框居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-container {
  width: 350px;
  padding: 30px; /* 增加内边距让表单不那么拥挤 */
  background-color: #fff;
  border-radius: 8px; /* 可选：增加圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 可选：增加阴影 */
}
</style>
