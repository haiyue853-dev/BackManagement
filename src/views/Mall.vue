<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'

const tableData = ref([])
const tableLoading = ref(false)
const loadError = ref('')
const { proxy } = getCurrentInstance()

const tableLabel = reactive([
  { prop: 'name', label: '商品名称', width: 180 },
  { prop: 'category', label: '商品分类', width: 120 },
  { prop: 'price', label: '商品价格', width: 120 },
  { prop: 'stock', label: '商品库存', width: 100 },
  { prop: 'status', label: '商品状态', width: 100 },
  { prop: 'coverTag', label: '商品标签', width: 100 },
  { prop: 'updateTime', label: '更新时间', width: 180 },
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

const action = ref('add')
const dialogVisible = ref(false)

const formMall = reactive({
  id: null,
  name: '',
  category: '',
  price: null,
  stock: null,
  status: '上架',
  coverTag: '',
  desc: '',
})

const rules = reactive({
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请输入商品分类', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', message: '商品价格必须是数字', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', message: '商品库存必须是数字', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
})

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

const getMallData = async () => {
  tableLoading.value = true
  loadError.value = ''

  try {
    const data = await proxy.$api.getMallData(config)
    tableData.value = data.list.map((item) => ({
      ...item,
      updateTime: formatDateTime(item.updateTime || item.updatedAt),
    }))
    config.total = data.count
  } catch (error) {
    tableData.value = []
    config.total = 0
    loadError.value = '商品数据加载失败，请稍后重试'
  } finally {
    tableLoading.value = false
  }
}

const handleSearch = () => {
  config.page = 1
  config.name = formInline.keyWord.trim()
  getMallData()
}

const handleChange = (page) => {
  config.page = page
  getMallData()
}

const resetForm = () => {
  Object.assign(formMall, {
    id: null,
    name: '',
    category: '',
    price: null,
    stock: null,
    status: '上架',
    coverTag: '',
    desc: '',
  })
  proxy.$refs.mallForm?.resetFields()
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
    proxy.$refs.mallForm?.resetFields()
    Object.assign(formMall, {
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      stock: Number(row.stock),
      status: row.status,
      coverTag: row.coverTag || '',
      desc: row.desc || '',
    })
  })
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
}

const onSubmit = () => {
  proxy.$refs.mallForm.validate(async (valid) => {
    if (!valid) {
      ElMessage({
        showClose: true,
        message: '请正确填写商品表单',
        type: 'error',
      })
      return
    }

    const payload = {
      name: formMall.name.trim(),
      category: formMall.category.trim(),
      price: Number(formMall.price),
      stock: Number(formMall.stock),
      status: formMall.status,
      coverTag: formMall.coverTag.trim(),
      desc: formMall.desc.trim(),
    }

    try {
      if (action.value === 'add') {
        await proxy.$api.addMall(payload)
      } else {
        await proxy.$api.editMall(formMall.id, payload)
      }

      ElMessage({
        showClose: true,
        message: action.value === 'add' ? '新增商品成功' : '编辑商品成功',
        type: 'success',
      })

      dialogVisible.value = false
      resetForm()
      getMallData()
    } catch (error) {
      ElMessage({
        showClose: true,
        message: action.value === 'add' ? '新增商品失败' : '编辑商品失败',
        type: 'error',
      })
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除这个商品吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await proxy.$api.deleteMall(row.id)

        ElMessage({
          showClose: true,
          message: '删除商品成功',
          type: 'success',
        })

        if (tableData.value.length === 1 && config.page > 1) {
          config.page -= 1
        }

        getMallData()
      } catch (error) {
        ElMessage({
          showClose: true,
          message: '删除商品失败，请稍后重试',
          type: 'error',
        })
      }
    })
    .catch(() => {})
}

onMounted(() => {
  getMallData()
})
</script>

<template>
  <div class="mall-header">
    <el-button type="primary" @click="handleAdd">新增商品</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="关键字">
        <el-input
          v-model="formInline.keyWord"
          placeholder="请输入商品名称或分类"
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

    <div v-if="tableLoading" class="table-state">正在加载商品数据...</div>

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
    :title="action === 'add' ? '新增商品' : '编辑商品'"
    width="45%"
    :before-close="handleClose"
  >
    <el-form ref="mallForm" :inline="true" :model="formMall" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formMall.name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品分类" prop="category">
            <el-input v-model="formMall.category" placeholder="请输入商品分类" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="商品价格" prop="price">
            <el-input v-model.number="formMall.price" placeholder="请输入商品价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品库存" prop="stock">
            <el-input v-model.number="formMall.stock" placeholder="请输入商品库存" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="商品状态" prop="status">
            <el-select v-model="formMall.status" placeholder="请选择商品状态">
              <el-option label="上架" value="上架" />
              <el-option label="下架" value="下架" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品标签" prop="coverTag">
            <el-input v-model="formMall.coverTag" placeholder="请输入商品标签" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="商品描述" prop="desc">
          <el-input
            v-model="formMall.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
      </el-row>

      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="less">
.mall-header {
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
      bottom: 10px;
      right: 30px;
    }
  }
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
