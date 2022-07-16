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
            <el-button type="primary" size="small" @click="handleOpenPermission(scope.row)">设置权限</el-button>
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
    <!-- 权限弹框 -->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree ref="permissionTree" default-expand-all :data="menuList" node-key="_id"
            :props="{ label: 'menuName' }" show-checkbox />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 认</el-button>
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
  pageNum: 1,
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
    prop: 'permissionList',
    formatter: (row, column, value) => {
      console.log(value.halfCheckedKeys)
      if (value.halfCheckedKeys) {
        let names = []
        let list = value.halfCheckedKeys || []
        list.map(key => {
          let name = actionMap.value[key]
          console.log(actionMap)
          if (key && name) names.push(actionMap.value[key])
        })
        return names.join(',')
      }
    }
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  },
  {
    label: '更新时间',
    prop: 'updateTime',
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
    roleForm.value = { _id: row._id, roleName: row.roleName, remark: row.remark }
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
      let params = { ...roleForm.value, action: action.value }
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

// 权限展示
let showPermission = ref(false)
let curRoleName = ref('')
let curRoleId = ref('')
let menuList = ref([])
const handleOpenPermission = (row) => {
  curRoleId.value = row._id
  curRoleName.value = row.roleName
  showPermission.value = true
  let { checkedKeys } = row.permissionList
  proxy.$nextTick(() => {
    proxy.$refs.permissionTree.setCheckedKeys(checkedKeys)
  })
}
const handlePermissionSubmit = async () => {
  let nodes = proxy.$refs.permissionTree.getCheckedNodes()
  let halfKeys = proxy.$refs.permissionTree.getHalfCheckedKeys()
  let checkedKeys = []
  let parentKeys = []
  nodes.map(node => {
    if (!node.children) {
      checkedKeys.push(node._id)
    } else {
      parentKeys.push(node._id)
    }
  })
  let params = {
    _id: curRoleId.value,
    permissionList: {
      checkedKeys,
      halfCheckedKeys: parentKeys.concat(halfKeys)
    }
  }
  await proxy.$api.updatePermission(params)
  showPermission.value = false
  proxy.$message.success('设置成功')
  getRoleList()
}
// 菜单列表初始化
const getMenuList = async () => {
  const list = await proxy.$api.getMenuList(queryForm)
  menuList.value = list
  getActionMap(list)
}

// 菜单映射表
let actionMap = ref({})
const getActionMap = (list) => {
  let _actionMap = {}
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop()
      if (item.children && item.action) {
        _actionMap[item._id] = item.menuName
      }
      if (item.children && !item.action) {
        deep(item.children)
      }
    }
  }
  deep(JSON.parse(JSON.stringify(list)))
  actionMap.value = _actionMap
}


// 关闭dialog
const handleClose = () => {
  handleReset('dialogForm')
  showModal.value = false
}
const handleCurrentChange = (currentPage) => {
  pager.pageNum = currentPage
  getRoleList()
}


onMounted(() => {
  getRoleList()
  getMenuList()
})

// 角色列表初始化
const getRoleList = async () => {
  try {
    const { list, page } = await proxy.$api.getRoleList({ ...queryForm, ...pager })
    roleList.value = list
    pager.total = page.total
  } catch (error) {
    throw new Error(error)
  }
}

</script>

<style lang="scss">
</style>