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
  { prop: 'name', label: '商品名称', width: 180 },
  { prop: 'category', label: '商品分类', width: 120 },
  { prop: 'price', label: '商品价格', width: 120 },
  { prop: 'stock', label: '商品库存', width: 120 },
  { prop: 'status', label: '商品状态', width: 120 },
  { prop: 'coverTag', label: '标签', width: 120 },
  { prop: 'updateTime', label: '更新时间', width: 180 }
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

const formMall = reactive({
  id: null,
  name: '',
  category: '',
  price: null,
  stock: null,
  status: '上架',
  coverTag: '',
  desc: ''
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请输入商品分类', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', message: '商品价格必须是数字', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', message: '商品库存必须是数字', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }]
}

const statusOptions = [
  { label: '上架', value: '上架' },
  { label: '下架', value: '下架' }
]

function formatDateTime(value) {
  if (!value) return ''
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

async function getMallData() {
  tableLoading.value = true
  loadError.value = ''

  try {
    const data = await proxy.$api.getMallData(config)
    tableData.value = data.list.map((item) => ({
      ...item,
      updateTime: formatDateTime(item.updateTime || item.updatedAt)
    }))
    config.total = data.count
  } catch (error) {
    tableData.value = []
    config.total = 0
    loadError.value = '商品列表加载失败，请检查后端服务或登录状态'
  } finally {
    tableLoading.value = false
  }
}

function handleSearch() {
  config.page = 1
  config.keyword = formInline.keyWord.trim()
  getMallData()
}

function handleChange(page) {
  config.page = page
  getMallData()
}

function resetForm() {
  Object.assign(formMall, {
    id: null,
    name: '',
    category: '',
    price: null,
    stock: null,
    status: '上架',
    coverTag: '',
    desc: ''
  })
  proxy.$refs.mallFormRef?.resetFields()
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
    Object.assign(formMall, {
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      stock: Number(row.stock),
      status: row.status,
      coverTag: row.coverTag || '',
      desc: row.desc || ''
    })
  })
}

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function handleCancel() {
  dialogVisible.value = false
  resetForm()
}

function onSubmit() {
  proxy.$refs.mallFormRef.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请先完成表单填写')
      return
    }

    const payload = {
      name: formMall.name.trim(),
      category: formMall.category.trim(),
      price: Number(formMall.price),
      stock: Number(formMall.stock),
      status: formMall.status,
      coverTag: formMall.coverTag.trim(),
      desc: formMall.desc.trim()
    }

    try {
      if (action.value === 'add') {
        await proxy.$api.addMall(payload)
      } else {
        await proxy.$api.editMall(formMall.id, payload)
      }

      ElMessage.success(action.value === 'add' ? '新增商品成功' : '编辑商品成功')
      dialogVisible.value = false
      resetForm()
      getMallData()
    } catch (error) {
      ElMessage.error(action.value === 'add' ? '新增商品失败' : '编辑商品失败')
    }
  })
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认删除商品 ${row.name} 吗？`, '删除提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await proxy.$api.deleteMall(row.id)
        ElMessage.success('删除商品成功')

        if (tableData.value.length === 1 && config.page > 1) {
          config.page -= 1
        }

        getMallData()
      } catch (error) {
        ElMessage.error('删除商品失败')
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
      <el-form-item label="商品搜索">
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

    <div v-if="tableLoading" class="table-state">正在加载商品列表...</div>

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
    <el-form
      ref="mallFormRef"
      :model="formMall"
      :rules="rules"
      label-width="90px"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="formMall.name" placeholder="请输入商品名称" />
      </el-form-item>

      <el-form-item label="商品分类" prop="category">
        <el-input v-model="formMall.category" placeholder="请输入商品分类" />
      </el-form-item>

      <el-form-item label="商品价格" prop="price">
        <el-input v-model.number="formMall.price" placeholder="请输入商品价格" />
      </el-form-item>

      <el-form-item label="商品库存" prop="stock">
        <el-input v-model.number="formMall.stock" placeholder="请输入商品库存" />
      </el-form-item>

      <el-form-item label="商品状态" prop="status">
        <el-select v-model="formMall.status" placeholder="请选择商品状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品标签">
        <el-input v-model="formMall.coverTag" placeholder="请输入商品标签" />
      </el-form-item>

      <el-form-item label="商品描述">
        <el-input
          v-model="formMall.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入商品描述"
        />
      </el-form-item>

      <el-form-item class="dialog-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
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
