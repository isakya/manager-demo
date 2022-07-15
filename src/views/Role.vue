<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" prop="date"
          :formatter="item.formatter" :width="item.width" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" size="small">设置权限</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination :page-size="pager.pageSize" @current-change="handleCurrentChange" class="pagination" background
      layout="prev, pager, next" :total="pager.total" />
    <!-- 新增角色 -->
    <el-dialog title="角色新增" v-model="showModal">
      <el-form ref="dialogForm" :rules="rules" :model="roleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="roleForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue'
import utils from '../utils/utils'

const { proxy } = getCurrentInstance()

let queryForm = reactive({
  roleName: ''
})

let showModal = ref(false)
let roleForm = ref({})
let action = ref('create')
// 校验规则
let rules = ref({
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
    }
  ]
})
// 角色列表
let roleList = ref([])
// 分页
let pager = reactive({
  total: 0,
  pageSize: 10
})

const columns = reactive([
  {
    label: '角色名称',
    prop: 'roleName',
  },
  {
    label: '备注',
    prop: 'remark',
  },
  {
    label: '权限列表',
    prop: '',
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  },
])

// 表单重置
const handleReset = (form) => {
  proxy.$refs[form].resetFields()
}

// 角色编辑
const handleEdit = (row) => {
  action.value = 'edit'
  showModal.value = true
  proxy.$nextTick(() => {
    roleForm.value = row
  })
}

// 角色添加
const handleAdd = () => {
  action.value = 'create'
  showModal.value = true
}

// 角色删除
const handleDel = async (_id) => {
  await proxy.$api.roleOperate({ _id, action: 'delete' })
  proxy.$message.success('删除成功')
  getRoleList()
}

// 角色提交
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...roleForm, action }
      let res = await proxy.$api.roleOperate(params)
      if (res) {
        showModal.value = false
        proxy.$message.success('创建成功')
        handleReset('dialogForm')
        getRoleList()
      }
    }
  })
}


// 关闭dialog
const handleClose = () => {
  handleReset('dialogForm')
  showModal.value = false
}
const handleCurrentChange = () => {

}

onMounted(() => {
  getRoleList()
})

// 菜单列表初始化
const getRoleList = async () => {
  try {
    const { list, page } = await proxy.$api.getRoleList(queryForm)
    roleList.value = list
    pager.total = page.total
  } catch (error) {
    throw new Error(error)
  }
}

</script>

<style lang="scss">
</style>