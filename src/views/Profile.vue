<script setup>
import { reactive, computed, getCurrentInstance, nextTick } from 'vue'
import { useAllDataStore } from '@/stores'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const store = useAllDataStore()
const userInfo = computed(() => store.state.userInfo || {})

const getImageUrl = (user) =>
  new URL(`../assets/images/${user}.png`, import.meta.url).href

const profileForm = reactive({
  username: '',
  role: '',
  avatar: 'user',
  signature: '',
  lastLoginTime: '',
  lastLoginCity: '',
})

const rules = reactive({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
  avatar: [{ required: true, message: '头像标识不能为空', trigger: 'change' }],
})

const resetFormData = () => {
  Object.assign(profileForm, {
    username: userInfo.value.username || '',
    role: userInfo.value.role || '',
    avatar: userInfo.value.avatar || 'user',
    signature: userInfo.value.signature || '',
    lastLoginTime: userInfo.value.lastLoginTime || '',
    lastLoginCity: userInfo.value.lastLoginCity || '',
  })
}

resetFormData()

const handleReset = () => {
  nextTick(() => {
    proxy.$refs['profileFormRef']?.resetFields()
    resetFormData()
  })
}

const handleSubmit = () => {
  proxy.$refs['profileFormRef'].validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请完善个人信息后再保存')
      return
    }

    const payload = {
      ...profileForm,
      lastLoginTime:
        profileForm.lastLoginTime || new Date().toLocaleString('zh-CN', { hour12: false }),
      lastLoginCity: profileForm.lastLoginCity || '未知',
    }

    const res = await proxy.$api.updateProfile(payload)
    if (res) {
      store.updateUserInfo(payload)
      ElMessage.success('个人信息已更新')
    }
  })
}
</script>

<template>
  <div class="profile-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="profile-card">
          <div class="profile-summary">
            <img :src="getImageUrl(profileForm.avatar || 'user')" class="avatar" />
            <p class="name">{{ profileForm.username || '未命名用户' }}</p>
            <el-tag type="success">{{ profileForm.role || '未设置角色' }}</el-tag>
            <p class="signature">{{ profileForm.signature || '这个人很酷，什么都没留下。' }}</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">个人信息设置</div>
          </template>

          <el-form :model="profileForm" :rules="rules" label-width="100px" ref="profileFormRef">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item label="角色" prop="role">
              <el-input v-model="profileForm.role" placeholder="请输入角色" />
            </el-form-item>

            <el-form-item label="头像标识" prop="avatar">
              <el-select v-model="profileForm.avatar" placeholder="请选择头像">
                <el-option label="默认头像" value="user" />
                <el-option label="浅色头像" value="user-default" />
              </el-select>
            </el-form-item>

            <el-form-item label="个性签名" prop="signature">
              <el-input
                type="textarea"
                :rows="3"
                v-model="profileForm.signature"
                placeholder="请输入个性签名"
              />
            </el-form-item>

            <el-form-item label="登录地点" prop="lastLoginCity">
              <el-input v-model="profileForm.lastLoginCity" placeholder="请输入登录地点" />
            </el-form-item>

            <el-form-item>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleSubmit">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.profile-page {
  margin-top: 20px;
}

.profile-card {
  min-height: 420px;
}

.profile-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 20px;

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .name {
    font-size: 24px;
    font-weight: 600;
  }

  .signature {
    color: #666;
    text-align: center;
    line-height: 1.6;
  }
}

.card-header {
  font-size: 16px;
  font-weight: 600;
}
</style>
