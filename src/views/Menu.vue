<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table row-key="_id" :data="menuList" :tree-props="{ children: 'children' }">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" prop="date"
          :formatter="item.formatter" :width="item.width" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(scope.row)">新增</el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增用户 -->
    <!-- <el-dialog title="用户新增" v-model="showModal">
      <el-form ref="dialogForm" :rules="rules" :model="userForm" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input :disabled="action === 'edit'" v-model="userForm.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input :disabled="action === 'edit'" v-model="userForm.userEmail" placeholder="请输入用户邮箱">
            <template #append>
              @izumi.com
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple style="width:100%">
            <el-option v-for="role in roleList" :key="role._id" :label="role.roleName" :value="role._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader v-model="userForm.deptId" style="width:100%" :options="deptList" placeholder="请选择所属部门"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable />
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
  menuState: 1
})

let menuList = ref([

])

const columns = reactive([
  {
    label: '菜单名称',
    prop: 'menuName',
    width: 180,
  },
  {
    label: '图标',
    prop: 'icon',
  },
  {
    label: '菜单类型',
    prop: 'menuType',
    formatter(row, column, value) {
      return {
        '1': '菜单',
        '2': '按钮'
      }[value]
    }
  },
  {
    label: '权限标识',
    prop: 'menuCode',
  },
  {
    label: '路由地址',
    prop: 'path',
  },
  {
    label: '组件路径',
    prop: 'component',
  },
  {
    label: '菜单状态',
    prop: 'menuState',
    formatter(row, column, value) {
      return {
        '1': '正常',
        '2': '停用'
      }[value]
    }
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  },
])

const handleQuery = () => {

}

const handleAdd = () => {

}

const handleEdit = () => {

}

const handleDel = () => {

}

onMounted(() => {
  getMenuList()
})

const getMenuList = async () => {
  try {
    const list = await proxy.$api.getMenuList(queryForm)

    menuList.value = list

    console.log(menuList)
  } catch (error) {
    throw new Error(error)
  }
}


</script>

<style lang="scss">
</style>