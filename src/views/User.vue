<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'

const { proxy } = getCurrentInstance()

const tableData = ref([])
const tableLoading = ref(false)
const loadError = ref('')
const action = ref('add')
const dialogVisible = ref(false)

const tableLabel = reactive([
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'sexLabel',
    label: '性别',
  },
  {
    prop: 'birth',
    label: '出生日期',
    width: 200,
  },
  {
    prop: 'addr',
    label: '地址',
    width: 400,
  },
])

const formInline = reactive({
  keyWord: '',
})

const config = reactive({
  name: '',
  total: 0,
  page: 1,
  pageSize: 10,
})

const formUser = reactive({
  id: null,
  name: '',
  age: null,
  sex: '',
  birth: null,
  addr: '',
})

const rules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字' },
  ],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birth: [{ required: true, message: '请选择出生日期' }],
  addr: [{ required: true, message: '请输入地址' }],
})

const formatSexLabel = (sex) => {
  if (sex === 1) return '男'
  if (sex === 0) return '女'
  return '未知'
}

const getUserData = async () => {
  tableLoading.value = true
  loadError.value = ''

  try {
    const data = await proxy.$api.getUserData(config)

    tableData.value = data.list.map((item) => {
      return {
        ...item,
        sexLabel: formatSexLabel(item.sex),
      }
    })
    config.total = data.count
  } catch (error) {
    tableData.value = []
    config.total = 0
    loadError.value = '用户数据加载失败，请稍后重试'
  } finally {
    tableLoading.value = false
  }
}

const handleSearch = () => {
  config.name = formInline.keyWord
  config.page = 1
  getUserData()
}

const handleChange = (page) => {
  config.page = page
  getUserData()
}

const resetForm = () => {
  Object.assign(formUser, {
    id: null,
    name: '',
    age: null,
    sex: '',
    birth: null,
    addr: '',
  })
  proxy.$refs.userForm?.resetFields()
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
}

const handleAdd = () => {
  action.value = 'add'
  dialogVisible.value = true
  nextTick(() => {
    resetForm()
  })
}

const handleEdit = (row) => {
  action.value = 'edit'
  dialogVisible.value = true

  nextTick(() => {
    Object.assign(formUser, {
      ...row,
      sex: row.sex === null || typeof row.sex === 'undefined' ? '' : String(row.sex),
    })
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('删除该用户?', '删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await proxy.$api.deleteUser(row.id)

        ElMessage({
          showClose: true,
          message: '删除成功',
          type: 'success',
        })

        if (tableData.value.length === 1 && config.page > 1) {
          config.page -= 1
        }

        getUserData()
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '删除失败，请稍后重试',
        })
      }
    })
    .catch(() => {})
}

const timeFormat = (time) => {
  const value = new Date(time)
  const year = value.getFullYear()
  const month = value.getMonth() + 1
  const day = value.getDate()

  function add(num) {
    return num < 10 ? `0${num}` : num
  }

  return `${year}-${add(month)}-${add(day)}`
}

const onSubmit = () => {
  proxy.$refs.userForm.validate(async (valid) => {
    if (!valid) {
      ElMessage({
        showClose: true,
        message: '请正确填写表单',
        type: 'error',
      })
      return
    }

    const payload = {
      ...formUser,
      name: formUser.name.trim(),
      sex: formUser.sex === '' ? null : Number(formUser.sex),
      birth: /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
        ? formUser.birth
        : timeFormat(formUser.birth),
      addr: formUser.addr.trim(),
    }

    try {
      if (action.value === 'add') {
        await proxy.$api.addUser(payload)
      } else {
        await proxy.$api.editUser(formUser.id, payload)
      }

      ElMessage({
        showClose: true,
        message: action.value === 'add' ? '新增成功' : '编辑成功',
        type: 'success',
      })

      dialogVisible.value = false
      resetForm()
      getUserData()
    } catch (error) {
      ElMessage({
        showClose: true,
        message: action.value === 'add' ? '新增失败' : '编辑失败',
        type: 'error',
      })
    }
  })
}

onMounted(() => {
  getUserData()
})
</script>

<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="关键字">
        <el-input
          v-model="formInline.keyWord"
          placeholder="请输入用户姓名"
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
        :width="item.width ? item.width : 125"
        :prop="item.prop"
        :label="item.label"
      />

      <el-table-column fixed="right" label="操作" min-width="140">
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

    <div v-if="tableLoading" class="table-state">正在加载用户数据...</div>

    <div class="table">
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
    width="35%"
    :before-close="handleClose"
  >
    <el-form ref="userForm" :inline="true" :model="formUser" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择性别">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>

      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
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
  height: 50px;

  .table-alert {
    margin-bottom: 12px;
  }

  .pager {
    position: absolute;
    bottom: 10px;
    right: 30px;
  }
}

.el-table {
  height: 500px;
  width: 100%;
}

.select-clearn {
  display: flex;
}

.table-state {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}
</style>
