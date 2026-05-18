<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, getCurrentInstance, onMounted, nextTick } from 'vue'

const { proxy } = getCurrentInstance()

const tableData = ref([])
const tableLoading = ref(false)
const loadError = ref('')
const action = ref('add')
const dialogVisible = ref(false)

const tableLabel = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'sexLabel', label: '性别', width: 100 },
  { prop: 'birth', label: '出生日期', width: 160 },
  { prop: 'addr', label: '地址', minWidth: 220 }
]

const formInline = reactive({
  keyWord: ''
})

const config = reactive({
  keyword: '',
  total: 0,
  page: 1,
  pageSize: 10
})

const formUser = reactive({
  id: null,
  name: '',
  age: null,
  sex: '',
  birth: '',
  addr: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字', trigger: 'blur' }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const sexOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '0' }
]

function formatSexLabel(sex) {
  if (sex === 1) return '男'
  if (sex === 0) return '女'
  return '未知'
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function getUserData() {
  tableLoading.value = true
  loadError.value = ''

  try {
    const data = await proxy.$api.getUserData(config)
    tableData.value = data.list.map((item) => ({
      ...item,
      sexLabel: formatSexLabel(item.sex)
    }))
    config.total = data.count
  } catch (error) {
    tableData.value = []
    config.total = 0
    loadError.value = '用户列表加载失败，请检查后端服务或登录状态'
  } finally {
    tableLoading.value = false
  }
}

function handleSearch() {
  config.keyword = formInline.keyWord.trim()
  config.page = 1
  getUserData()
}

function handleChange(page) {
  config.page = page
  getUserData()
}

function resetForm() {
  Object.assign(formUser, {
    id: null,
    name: '',
    age: null,
    sex: '',
    birth: '',
    addr: ''
  })
  proxy.$refs.userFormRef?.resetFields()
}

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function handleCancel() {
  dialogVisible.value = false
  resetForm()
}

function handleAdd() {
  action.value = 'add'
  dialogVisible.value = true
  nextTick(() => {
    resetForm()
  })
}

function handleEdit(row) {
  action.value = 'edit'
  dialogVisible.value = true

  nextTick(() => {
    resetForm()
    Object.assign(formUser, {
      id: row.id,
      name: row.name,
      age: Number(row.age),
      sex: row.sex === null || typeof row.sex === 'undefined' ? '' : String(row.sex),
      birth: formatDate(row.birth),
      addr: row.addr || ''
    })
  })
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认删除用户 ${row.name} 吗？`, '删除提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await proxy.$api.deleteUser(row.id)
        ElMessage.success('删除用户成功')

        if (tableData.value.length === 1 && config.page > 1) {
          config.page -= 1
        }

        getUserData()
      } catch (error) {
        ElMessage.error('删除用户失败')
      }
    })
    .catch(() => {})
}

function onSubmit() {
  proxy.$refs.userFormRef.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请先完成表单填写')
      return
    }

    const payload = {
      name: formUser.name.trim(),
      age: Number(formUser.age),
      sex: formUser.sex === '' ? null : Number(formUser.sex),
      birth: formUser.birth ? formatDate(formUser.birth) : null,
      addr: formUser.addr.trim()
    }

    try {
      if (action.value === 'add') {
        await proxy.$api.addUser(payload)
      } else {
        await proxy.$api.editUser(formUser.id, payload)
      }

      ElMessage.success(action.value === 'add' ? '新增用户成功' : '编辑用户成功')
      dialogVisible.value = false
      resetForm()
      getUserData()
    } catch (error) {
      ElMessage.error(action.value === 'add' ? '新增用户失败' : '编辑用户失败')
    }
  })
}

onMounted(() => {
  getUserData()
})
</script>

<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增用户</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="用户搜索">
        <el-input
          v-model="formInline.keyWord"
          placeholder="请输入姓名关键字"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
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
      :empty-text="tableLoading ? '加载中...' : '暂无数据'"
      style="width: 100%"
    >
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
      />

      <el-table-column fixed="right" label="操作" min-width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="tableLoading" class="table-state">正在加载用户列表...</div>

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
    :title="action === 'add' ? '新增用户' : '编辑用户'"
    width="40%"
    :before-close="handleClose"
  >
    <el-form
      ref="userFormRef"
      :model="formUser"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formUser.name" placeholder="请输入姓名" />
      </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-select v-model="formUser.sex" placeholder="请选择性别">
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="出生日期">
        <el-date-picker
          v-model="formUser.birth"
          type="date"
          placeholder="请选择出生日期"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="地址">
        <el-input v-model="formUser.addr" placeholder="请输入地址" />
      </el-form-item>

      <el-form-item class="dialog-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="less">
.user-header {
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
