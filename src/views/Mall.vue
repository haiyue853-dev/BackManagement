<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'

const tableData = ref([])
const { proxy } = getCurrentInstance()

const tableLabel = reactive([
  { prop: 'name', label: '商品名称', width: 180 },
  { prop: 'category', label: '分类', width: 120 },
  { prop: 'price', label: '价格', width: 120 },
  { prop: 'stock', label: '库存', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'coverTag', label: '标签', width: 100 },
  { prop: 'updateTime', label: '更新时间', width: 180 },
])

const formInline = reactive({
  keyWord: '',
})

const config = reactive({
  name: '',
  total: 0,
  page: 1,
})

const getMallData = async () => {
  const data = await proxy.$api.getMallData(config)
  tableData.value = data.list
  config.total = data.count
}

const handleSearch = () => {
  config.page = 1
  config.name = formInline.keyWord
  getMallData()
}

const handleChange = (page) => {
  config.page = page
  getMallData()
}

const action = ref('add')
const dialogVisible = ref(false)
const formMall = reactive({
  id: '',
  name: '',
  category: '',
  price: null,
  stock: null,
  status: '上架',
  coverTag: '',
  desc: '',
})

const rules = reactive({
  name: [{ required: true, message: '商品名称是必填项', trigger: 'blur' }],
  category: [{ required: true, message: '分类是必填项', trigger: 'blur' }],
  price: [
    { required: true, message: '价格是必填项', trigger: 'blur' },
    { type: 'number', message: '价格必须是数字', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '库存是必填项', trigger: 'blur' },
    { type: 'number', message: '库存必须是数字', trigger: 'blur' },
  ],
  status: [{ required: true, message: '状态是必选项', trigger: 'change' }],
})

const resetForm = () => {
  formMall.id = ''
  formMall.name = ''
  formMall.category = ''
  formMall.price = null
  formMall.stock = null
  formMall.status = '上架'
  formMall.coverTag = ''
  formMall.desc = ''
}

const handleAdd = () => {
  action.value = 'add'
  dialogVisible.value = true
  nextTick(() => {
    proxy.$refs['mallForm']?.resetFields()
    resetForm()
  })
}

const handleEdit = (row) => {
  action.value = 'edit'
  dialogVisible.value = true
  nextTick(() => {
    proxy.$refs['mallForm']?.resetFields()
    Object.assign(formMall, row)
  })
}

const handleClose = () => {
  dialogVisible.value = false
  proxy.$refs['mallForm']?.resetFields()
  resetForm()
}

const handleCancel = () => {
  dialogVisible.value = false
  proxy.$refs['mallForm']?.resetFields()
  resetForm()
}

const onSubmit = () => {
  proxy.$refs['mallForm'].validate(async (valid) => {
    if (!valid) {
      ElMessage({
        showClose: true,
        message: '保存失败，请检查输入内容',
        type: 'error',
      })
      return
    }

    let res = null
    if (action.value === 'add') {
      res = await proxy.$api.addMall(formMall)
    } else {
      res = await proxy.$api.editMall(formMall)
    }

    if (res) {
      ElMessage({
        showClose: true,
        message: action.value === 'add' ? '新增成功' : '编辑成功',
        type: 'success',
      })
      dialogVisible.value = false
      proxy.$refs['mallForm']?.resetFields()
      resetForm()
      getMallData()
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('是否确认删除该商品?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await proxy.$api.deleteMall({ id: row.id })
      ElMessage({
        showClose: true,
        message: '删除成功',
        type: 'success',
      })
      getMallData()
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
      <el-form-item label="关键词">
        <el-input
          placeholder="请输入商品名或分类"
          v-model="formInline.keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
    <el-table :data="tableData" style="width: 100%">
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

    <div class="table-pager">
      <el-pagination
        class="pager"
        background
        layout="prev, pager, next"
        size="small"
        :total="config.total"
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
    <el-form :inline="true" :model="formMall" :rules="rules" ref="mallForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formMall.name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="category">
            <el-input v-model="formMall.category" placeholder="请输入商品分类" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="formMall.price" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存" prop="stock">
            <el-input v-model.number="formMall.stock" placeholder="请输入库存" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="状态" prop="status">
            <el-select v-model="formMall.status" placeholder="请选择">
              <el-option label="上架" value="上架" />
              <el-option label="下架" value="下架" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签" prop="coverTag">
            <el-input v-model="formMall.coverTag" placeholder="如：热卖/新品" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="商品描述" prop="desc">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formMall.desc"
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
</style>
