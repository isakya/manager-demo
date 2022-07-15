<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" prop="date"
          :formatter="item.formatter" :width="item.width" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="primary" size="small">设置权限</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination :page-size="pager.pageSize" @current-change="handleCurrentChange" class="pagination" background
      layout="prev, pager, next" :total="pager.total" />
    <!-- 新增角色 -->
    <!-- <el-dialog title="用户新增" v-model="showModal">
      <el-form ref="dialogForm" :rules="rules" :model="menuForm" label-width="100px">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader v-model="menuForm.parentId" :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }" clearable />
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType === 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 认</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue'
import utils from '../utils/utils'

const { proxy } = getCurrentInstance()

let queryForm = reactive({
  roleName: ''
})

let roleList = ref([])
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

const handleReset = (form) => {
  proxy.$refs[form].resetFields()
}



const handleDel = async (_id) => {
  await proxy.$api.menuSubmit({ _id, action: 'delete' })
  proxy.$message.success('删除成功')
  getMenuList()
}


// 关闭dialog
const handleClose = () => {
  showModal.value = false
  handleReset('dialogForm')
}
const handleCurrentChange = () => {

}

onMounted(() => {
  getRoleList()
})

// 菜单列表初始化
const getRoleList = async () => {
  try {
    console.log(123123123)

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