<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" ref="form" :model="queryForm">
        <el-form-item>
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList" type="primary">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
        <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }" strip>
          <el-table-column v-for="item in columns" :key="item.prop" v-bind="item"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDel(scope.row._id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :before-close="handleClose" :title="action === 'create' ? '创建部门' : '编辑部门'" v-model="showModal">
      <el-form ref="dialogForm" :model="deptForm" :rules="rules" label-width="120px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader placeholder="请选择上级部门" v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable :options="deptList"
            :show-all-levels="true">
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select placeholder="请选择部门负责人" v-model="deptForm.user" @change="handleUser">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input placeholder="请输入负责人邮箱" v-model="deptForm.userEmail" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, toRefs, toRaw, ref, onMounted } from "vue"

const { proxy } = getCurrentInstance()
// let deptList = ref([])

let { queryForm, columns, deptList, rules, deptForm, userList, pager, action, showModal } =
  toRefs(reactive({
    queryForm: {
      deptName: ''
    },
    columns: [
      {
        label: '部门名称',
        prop: 'deptName'
      },
      {
        label: '负责人',
        prop: 'userName'
      },
      {
        label: '更新时间',
        prop: 'updateTime'
      },
      {
        label: '创建时间',
        prop: 'createTime'
      }
    ],
    deptList: null,
    pager: {
      pageNum: 1,
      pageSize: 10
    },
    action: 'create',
    showModal: false,
    userList: [],
    deptForm: {
      parentId: [null]
    },
    rules: {
      parentId: [
        {
          required: true,
          message: '请选择上级部门',
          trigger: 'blur'
        }
      ],
      deptName: [
        {
          required: true,
          message: '请输入部门名称',
          trigger: 'blur'
        }
      ],
      user: [
        {
          required: true,
          message: '请选择负责人',
          trigger: 'change'
        }
      ]
    }
  }))

onMounted(() => {
  getDeptList()
  getAllUserList()
})


const getDeptList = async () => {
  let list = await proxy.$api.getDeptList({ ...queryForm.value })
  deptList.value = list
}

const getAllUserList = async () => {
  let list = await proxy.$api.getAllUserList()
  userList.value = list
}

const handleReset = (form) => {
  proxy.$refs[form].resetFields()
}

const handleOpen = () => {
  action.value = 'create'
  showModal.value = true
}

const handleEdit = (row) => {
  action.value = 'edit'
  showModal.value = true
  proxy.$nextTick(() => {
    Object.assign(deptForm.value, row, {
      user: `${row.userId}/${row.userName}/${row.userEmail}`
    })
  })
}
const handleDel = async (_id) => {
  action.value = 'delete'
  await proxy.$api.deptOperate({ _id, action: action.value })
  proxy.$message.success('删除成功')
  getDeptList()
}

const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...deptForm.value, action: action.value }
      delete params.user
      let res = await proxy.$api.deptOperate(params)
      proxy.$message.success('操作成功')
      handleClose()
      getDeptList()
    }
  })
}

const handleClose = () => {
  showModal.value = false
  handleReset('dialogForm')
}

const handleUser = (val) => {
  const [userId, userName, userEmail] = val.split('/')
  Object.assign(deptForm.value, { userId, userName, userEmail })

}


</script>

<style lang="scss" scoped>
</style>