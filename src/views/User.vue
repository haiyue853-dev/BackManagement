<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'

const handleClick = () => {}

const tableData = ref([])
const { proxy } = getCurrentInstance()
const getUserData = async () => {
  let data = await proxy.$api.getUserData(config)

  tableData.value = data.list.map((item) => {
    return {
      ...item,
      sexLabel: item.sex == 1 ? '男' : '女',
    }
  })
  config.total = data.count
}

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
})
const handleSearch = () => {
  config.name = formInline.keyWord
  getUserData()
}
const handleChange = (page) => {
  config.page = page
  getUserData()
}
const handleDelete = (val) => {
  ElMessageBox.confirm('是否确认删除该用户?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // 1. 打印调试信息，确保进入这里
        console.log('开始删除，ID:', val.id)

        // 2. 执行删除请求
        await proxy.$api.deleteUser({ id: val.id })

        // 3. 提示成功
        ElMessage({
          showClose: true,
          message: '删除成功',
          type: 'success',
        })

        // 4. 重新加载列表
        getUserData()
      } catch (error) {
        // 5. 捕获删除过程中的错误
        console.error('删除失败:', error)
        ElMessage({
          type: 'error',
          message: '删除失败，请稍后重试',
        })
      }
    })
    .catch(() => {
      // 用户点击取消或删除框关闭时触发
      console.log('用户取消删除')
    })
}

const action = ref('add')
const dialogVisible = ref(false)
const formUser = reactive({
  name: '',
  age: null,
  sex: '', // 默认选“男”
  birth: null,
  addr: '',
})
const rules = reactive({
  name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
  age: [
    { required: true, message: '年龄是必填项', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字' },
  ],
  sex: [{ required: true, message: '性别是必选项', trigger: 'change' }],
  birth: [{ required: true, message: '出生日期是必选项' }],
  addr: [{ required: true, message: '地址是必填项' }],
})

const handleClose = () => {
  dialogVisible.value = false
  proxy.$refs['userForm'].resetFields()
}
const handleCancel = () => {
  dialogVisible.value = false
  proxy.$refs['userForm'].resetFields()
}

const handleAdd = () => {
  dialogVisible.value = true
  action.value = 'add'
}

const timeFormat = (time) => {
  var time = new Date(time)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var day = time.getDate()
  function add(m) {
    return m < 10 ? '0' + m : m
  }
  return year + '-' + add(month) + '-' + add(day)
}
const onSubmit = () => {
  //先校验
  proxy.$refs['userForm'].validate(async (valid) => {
    if (valid) {
      let res = null
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
        ? formUser.birth
        : timeFormat(formUser.birth)
      if (action.value === 'add') {
        res = await proxy.$api.addUser(formUser)
      } else {
        res = await proxy.$api.editUser(formUser)
      }
      if (res) {
        dialogVisible.value = false
        proxy.$refs['userForm'].resetFields()

        getUserData()
      }
    } else {
      ElMessage({
        showClose: true,
        message: '添加失败,请输入正确内容',
        type: 'error',
      })
    }
  })
}

const handleEdit = (val) => {
  action.value = 'edit'
  dialogVisible.value = true

  nextTick(() => {
    Object.assign(formUser, { ...val, sex: '' + val.sex })
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
      <el-form-item label="请输入">
        <el-input
          placeholder="请输入用户名"
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
        :width="item.width ? item.width : 125"
        :prop="item.prop"
        :label="item.label"
      />

      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="table">
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
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
    <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
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
            <el-select v-model="formUser.sex" placeholder="请选择">
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
              placeholder="请输入"
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
</style>
