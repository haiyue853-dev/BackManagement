<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed, getCurrentInstance, onMounted, nextTick } from 'vue'

const { proxy } = getCurrentInstance()

const text = {
  account: '\u8d26\u53f7',
  role: '\u89d2\u8272',
  status: '\u72b6\u6001',
  createdAt: '\u521b\u5efa\u65f6\u95f4',
  updatedAt: '\u66f4\u65b0\u65f6\u95f4',
  actions: '\u64cd\u4f5c',
  accountSearch: '\u8d26\u53f7\u641c\u7d22',
  searchPlaceholder: '\u8bf7\u8f93\u5165\u8d26\u53f7\u5173\u952e\u5b57',
  addAccount: '\u65b0\u589e\u8d26\u53f7',
  editAccount: '\u7f16\u8f91\u8d26\u53f7',
  resetPassword: '\u91cd\u7f6e\u5bc6\u7801',
  newPassword: '\u65b0\u5bc6\u7801',
  password: '\u5bc6\u7801',
  loading: '\u52a0\u8f7d\u4e2d...',
  empty: '\u6682\u65e0\u6570\u636e',
  loadingList: '\u6b63\u5728\u52a0\u8f7d\u8d26\u53f7\u5217\u8868...',
  loadError: '\u8d26\u53f7\u5217\u8868\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u540e\u7aef\u670d\u52a1\u6216\u767b\u5f55\u72b6\u6001',
  createSuccess: '\u65b0\u589e\u8d26\u53f7\u6210\u529f',
  createFailed: '\u65b0\u589e\u8d26\u53f7\u5931\u8d25',
  editSuccess: '\u7f16\u8f91\u8d26\u53f7\u6210\u529f',
  editFailed: '\u7f16\u8f91\u8d26\u53f7\u5931\u8d25',
  deleteSuccess: '\u5220\u9664\u8d26\u53f7\u6210\u529f',
  deleteFailed: '\u5220\u9664\u8d26\u53f7\u5931\u8d25',
  passwordSuccess: '\u91cd\u7f6e\u5bc6\u7801\u6210\u529f',
  passwordFailed: '\u91cd\u7f6e\u5bc6\u7801\u5931\u8d25',
  fillForm: '\u8bf7\u5148\u5b8c\u6210\u8868\u5355\u586b\u5199',
  validPassword: '\u8bf7\u8f93\u5165\u6709\u6548\u7684\u65b0\u5bc6\u7801',
  deleteTitle: '\u5220\u9664\u63d0\u793a',
  deleteConfirmPrefix: '\u786e\u8ba4\u5220\u9664\u8d26\u53f7',
  deleteConfirmSuffix: '\u5417\uff1f',
  confirm: '\u786e\u5b9a',
  cancel: '\u53d6\u6d88',
  delete: '\u5220\u9664',
  edit: '\u7f16\u8f91',
  search: '\u641c\u7d22',
  usernameRequired: '\u8bf7\u8f93\u5165\u8d26\u53f7',
  passwordRequired: '\u8bf7\u8f93\u5165\u5bc6\u7801',
  passwordMin: '\u5bc6\u7801\u81f3\u5c11 5 \u4f4d',
  roleRequired: '\u8bf7\u9009\u62e9\u89d2\u8272',
  statusRequired: '\u8bf7\u9009\u62e9\u72b6\u6001',
  roleAdmin: '\u7ba1\u7406\u5458',
  roleEditor: '\u7f16\u8f91',
  statusActive: '\u542f\u7528',
  statusDisabled: '\u505c\u7528',
}

const tableData = ref([])
const tableLoading = ref(false)
const loadError = ref('')
const action = ref('add')
const dialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const currentAccount = ref(null)

const formInline = reactive({
  keyWord: '',
})

const config = reactive({
  username: '',
  total: 0,
  page: 1,
  pageSize: 10,
})

const tableLabel = reactive([
  { prop: 'username', label: text.account, width: 180 },
  { prop: 'roleLabel', label: text.role, width: 120 },
  { prop: 'statusLabel', label: text.status, width: 120 },
  { prop: 'createdAtLabel', label: text.createdAt, width: 180 },
  { prop: 'updatedAtLabel', label: text.updatedAt, width: 180 },
])

const formAccount = reactive({
  id: null,
  username: '',
  password: '',
  role: 'editor',
  status: 'active',
})

const passwordForm = reactive({
  password: '',
})

const accountRules = computed(() => {
  const rules = {
    role: [{ required: true, message: text.roleRequired, trigger: 'change' }],
    status: [{ required: true, message: text.statusRequired, trigger: 'change' }],
  }

  if (action.value === 'add') {
    rules.username = [{ required: true, message: text.usernameRequired, trigger: 'blur' }]
    rules.password = [
      { required: true, message: text.passwordRequired, trigger: 'blur' },
      { min: 5, message: text.passwordMin, trigger: 'blur' },
    ]
  }

  return rules
})

const passwordRules = {
  password: [
    { required: true, message: text.passwordRequired, trigger: 'blur' },
    { min: 5, message: text.passwordMin, trigger: 'blur' },
  ],
}

const roleOptions = [
  { label: text.roleAdmin, value: 'admin' },
  { label: text.roleEditor, value: 'editor' },
]

const statusOptions = [
  { label: text.statusActive, value: 'active' },
  { label: text.statusDisabled, value: 'disabled' },
]

const dialogTitle = computed(() =>
  action.value === 'add' ? text.addAccount : text.editAccount
)

const roleTextMap = {
  admin: text.roleAdmin,
  editor: text.roleEditor,
}

const statusTextMap = {
  active: text.statusActive,
  disabled: text.statusDisabled,
}

const formatDateTime = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const normalizeRow = (item) => ({
  ...item,
  roleLabel: roleTextMap[item.role] || item.role,
  statusLabel: statusTextMap[item.status] || item.status,
  createdAtLabel: formatDateTime(item.createdAt),
  updatedAtLabel: formatDateTime(item.updatedAt),
})

const getAccountData = async () => {
  tableLoading.value = true
  loadError.value = ''

  try {
    const data = await proxy.$api.getAccountData(config)
    tableData.value = data.list.map(normalizeRow)
    config.total = data.count
  } catch (error) {
    tableData.value = []
    config.total = 0
    loadError.value = text.loadError
  } finally {
    tableLoading.value = false
  }
}

const handleSearch = () => {
  config.page = 1
  config.username = formInline.keyWord.trim()
  getAccountData()
}

const handleChange = (page) => {
  config.page = page
  getAccountData()
}

const resetAccountForm = () => {
  Object.assign(formAccount, {
    id: null,
    username: '',
    password: '',
    role: 'editor',
    status: 'active',
  })
  proxy.$refs.accountFormRef?.resetFields()
}

const resetPasswordForm = () => {
  passwordForm.password = ''
  proxy.$refs.passwordFormRef?.resetFields()
}

const handleAdd = () => {
  action.value = 'add'
  dialogVisible.value = true
  nextTick(() => {
    resetAccountForm()
  })
}

const handleEdit = (row) => {
  action.value = 'edit'
  dialogVisible.value = true
  nextTick(() => {
    resetAccountForm()
    Object.assign(formAccount, {
      id: row.id,
      username: row.username,
      password: '',
      role: row.role,
      status: row.status,
    })
  })
}

const handleResetPassword = (row) => {
  currentAccount.value = row
  passwordDialogVisible.value = true
  nextTick(() => {
    resetPasswordForm()
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `${text.deleteConfirmPrefix} ${row.username} ${text.deleteConfirmSuffix}`,
    text.deleteTitle,
    {
      confirmButtonText: text.delete,
      cancelButtonText: text.cancel,
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await proxy.$api.deleteAccount(row.id)
        ElMessage.success(text.deleteSuccess)

        if (tableData.value.length === 1 && config.page > 1) {
          config.page -= 1
        }

        getAccountData()
      } catch (error) {
        ElMessage.error(text.deleteFailed)
      }
    })
    .catch(() => {})
}

const handleClose = () => {
  dialogVisible.value = false
  resetAccountForm()
}

const handlePasswordClose = () => {
  passwordDialogVisible.value = false
  currentAccount.value = null
  resetPasswordForm()
}

const handleCancel = () => {
  dialogVisible.value = false
  resetAccountForm()
}

const handlePasswordCancel = () => {
  passwordDialogVisible.value = false
  currentAccount.value = null
  resetPasswordForm()
}

const onSubmit = () => {
  proxy.$refs.accountFormRef.validate(async (valid) => {
    if (!valid) {
      ElMessage.error(text.fillForm)
      return
    }

    try {
      if (action.value === 'add') {
        await proxy.$api.addAccount({
          username: formAccount.username.trim(),
          password: formAccount.password.trim(),
          role: formAccount.role,
          status: formAccount.status,
        })
      } else {
        await proxy.$api.editAccount(formAccount.id, {
          role: formAccount.role,
          status: formAccount.status,
        })
      }

      ElMessage.success(action.value === 'add' ? text.createSuccess : text.editSuccess)
      dialogVisible.value = false
      resetAccountForm()
      getAccountData()
    } catch (error) {
      ElMessage.error(action.value === 'add' ? text.createFailed : text.editFailed)
    }
  })
}

const onSubmitPassword = () => {
  proxy.$refs.passwordFormRef.validate(async (valid) => {
    if (!valid) {
      ElMessage.error(text.validPassword)
      return
    }

    try {
      await proxy.$api.resetAccountPassword(currentAccount.value.id, {
        password: passwordForm.password.trim(),
      })

      ElMessage.success(text.passwordSuccess)
      passwordDialogVisible.value = false
      currentAccount.value = null
      resetPasswordForm()
      getAccountData()
    } catch (error) {
      ElMessage.error(text.passwordFailed)
    }
  })
}

onMounted(() => {
  getAccountData()
})
</script>

<template>
  <div class="account-header">
    <el-button type="primary" @click="handleAdd">{{ text.addAccount }}</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item :label="text.accountSearch">
        <el-input
          v-model="formInline.keyWord"
          :placeholder="text.searchPlaceholder"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ text.search }}</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
    <el-alert
      v-if="loadError"
      :title="loadError"
      type="error"
      show-icon
      :closable="false"
      class="table-alert"
    />

    <el-table
      :data="tableData"
      :empty-text="tableLoading ? text.loading : text.empty"
      style="width: 100%"
    >
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      />

      <el-table-column fixed="right" :label="text.actions" min-width="260">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            :disabled="scope.row.username === 'admin'"
            @click="handleEdit(scope.row)"
          >
            {{ text.edit }}
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="handleResetPassword(scope.row)"
          >
            {{ text.resetPassword }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="scope.row.username === 'admin'"
            @click="handleDelete(scope.row)"
          >
            {{ text.delete }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="tableLoading" class="table-state">{{ text.loadingList }}</div>

    <div class="table-pager">
      <el-pagination
        class="pager"
        background
        layout="prev, pager, next"
        size="small"
        :total="config.total"
        :current-page="config.page"
        :page-size="config.pageSize"
        @current-change="handleChange"
      />
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="40%"
    :before-close="handleClose"
  >
    <el-form
      ref="accountFormRef"
      :model="formAccount"
      :rules="accountRules"
      label-width="90px"
    >
      <el-form-item :label="text.account" prop="username">
        <el-input
          v-model="formAccount.username"
          :placeholder="text.usernameRequired"
          :disabled="action === 'edit'"
        />
      </el-form-item>

      <el-form-item v-if="action === 'add'" :label="text.password" prop="password">
        <el-input
          v-model="formAccount.password"
          type="password"
          show-password
          :placeholder="text.passwordRequired"
        />
      </el-form-item>

      <el-form-item :label="text.role" prop="role">
        <el-select v-model="formAccount.role" :placeholder="text.roleRequired">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="text.status" prop="status">
        <el-select v-model="formAccount.status" :placeholder="text.statusRequired">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="dialog-actions">
        <el-button @click="handleCancel">{{ text.cancel }}</el-button>
        <el-button type="primary" @click="onSubmit">{{ text.confirm }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="passwordDialogVisible"
    :title="text.resetPassword"
    width="35%"
    :before-close="handlePasswordClose"
  >
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-width="90px"
    >
      <el-form-item :label="text.account">
        <el-input :model-value="currentAccount?.username || ''" disabled />
      </el-form-item>

      <el-form-item :label="text.newPassword" prop="password">
        <el-input
          v-model="passwordForm.password"
          type="password"
          show-password
          :placeholder="text.passwordRequired"
        />
      </el-form-item>

      <el-form-item class="dialog-actions">
        <el-button @click="handlePasswordCancel">{{ text.cancel }}</el-button>
        <el-button type="primary" @click="onSubmitPassword">{{ text.confirm }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="less">
.account-header {
  display: flex;
  justify-content: space-between;
}

.table {
  position: relative;

  .table-alert {
    margin-bottom: 12px;
  }

  .el-table {
    height: 560px;
  }

  .table-pager {
    height: 50px;
    position: relative;

    .pager {
      position: absolute;
      right: 30px;
      bottom: 10px;
    }
  }
}

.table-state {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
