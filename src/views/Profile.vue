<script setup>
import { reactive, computed, getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAllDataStore } from '@/stores'

const { proxy } = getCurrentInstance()
const store = useAllDataStore()
const userInfo = computed(() => store.state.userInfo || {})
const loading = ref(false)

const profileForm = reactive({
  username: '',
  role: '',
  avatar: 'user',
  signature: '',
  lastLoginTime: '',
  lastLoginCity: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  role: [{ required: true, message: '请输入角色', trigger: 'blur' }],
  avatar: [{ required: true, message: '请选择头像', trigger: 'change' }]
}

const avatarOptions = [
  { label: '管理员头像', value: 'user' },
  { label: '默认头像', value: 'user-default' }
]

const avatarUrl = computed(
  () => new URL(`../assets/images/${profileForm.avatar || 'user'}.png`, import.meta.url).href
)

function resetFormData() {
  Object.assign(profileForm, {
    username: userInfo.value.username || '',
    role: userInfo.value.role || '',
    avatar: userInfo.value.avatar || 'user',
    signature: userInfo.value.signature || '',
    lastLoginTime: userInfo.value.lastLoginTime || '',
    lastLoginCity: userInfo.value.lastLoginCity || ''
  })
}

async function getProfileData() {
  loading.value = true

  try {
    const data = await proxy.$api.getProfile()
    store.updateUserInfo(data)
    resetFormData()
  } catch (error) {
    ElMessage.error('个人资料加载失败，请检查后端服务或登录状态')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  nextTick(() => {
    proxy.$refs.profileFormRef?.resetFields()
    resetFormData()
  })
}

function handleSubmit() {
  proxy.$refs.profileFormRef.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请先完成表单填写')
      return
    }

    const payload = {
      ...profileForm,
      username: profileForm.username.trim(),
      role: profileForm.role.trim(),
      signature: profileForm.signature.trim(),
      lastLoginTime:
        profileForm.lastLoginTime || new Date().toLocaleString('zh-CN', { hour12: false }),
      lastLoginCity: profileForm.lastLoginCity.trim() || '未知'
    }

    const res = await proxy.$api.updateProfile(payload)
    if (res) {
      store.updateUserInfo(res)
      ElMessage.success('个人资料更新成功')
    }
  })
}

onMounted(() => {
  resetFormData()
  getProfileData()
})
</script>

<template>
  <div class="profile-page" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="profile-card">
          <div class="profile-summary">
            <img :src="avatarUrl" class="avatar" />
            <p class="name">{{ profileForm.username || '未登录用户' }}</p>
            <el-tag type="success">{{ profileForm.role || '未设置角色' }}</el-tag>
            <p class="signature">{{ profileForm.signature || '这个人很低调，还没有留下签名。' }}</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">个人资料设置</div>
          </template>

          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item label="角色" prop="role">
              <el-input v-model="profileForm.role" placeholder="请输入角色" />
            </el-form-item>

            <el-form-item label="头像" prop="avatar">
              <el-select v-model="profileForm.avatar" placeholder="请选择头像">
                <el-option
                  v-for="item in avatarOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="个性签名">
              <el-input
                v-model="profileForm.signature"
                type="textarea"
                :rows="3"
                placeholder="请输入个性签名"
              />
            </el-form-item>

            <el-form-item label="最近登录城市">
              <el-input v-model="profileForm.lastLoginCity" placeholder="请输入最近登录城市" />
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
