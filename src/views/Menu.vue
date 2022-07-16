<template>
  <div class="menu-manage">
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
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
      </div>
      <el-table row-key="_id" :data="menuList" :tree-props="{ children: 'children' }">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" prop="date"
          :formatter="item.formatter" :width="item.width" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(2, scope.row)">新增</el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增menu -->
    <el-dialog :before-close="handleClose" title="用户新增" v-model="showModal">
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
    </el-dialog>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from 'vue'
import utils from '../utils/utils'

const { proxy } = getCurrentInstance()

let queryForm = reactive({
  menuState: 1
})
let menuList = ref([])
let showModal = ref(false)
let menuForm = ref({
  parentId: [null],
  menuType: 1,
  menuState: 1
})
let action = ref('')
let rules = reactive({
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 10,
      message: '长度需在2-8个字符',
      trigger: 'blur'
    }
  ]
})

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
  getMenuList()
}
const handleReset = (form) => {
  proxy.$refs[form].resetFields()
}

// 新增菜单
const handleAdd = (type, row) => {
  showModal.value = true
  action.value = 'add'
  if (type === 2) {
    menuForm.value.parentId = [...row.parentId, row._id].filter(item => item)
  }
}

const handleEdit = (row) => {
  showModal.value = true
  action.value = 'edit'
  proxy.$nextTick(() => {
    // 浅拷贝
    console.log(menuForm.value)
    Object.assign(menuForm.value, row)
  })
}

const handleDel = async (_id) => {
  await proxy.$api.menuSubmit({ _id, action: 'delete' })
  proxy.$message.success('删除成功')
  getMenuList()
}

// 菜单操作提交
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...menuForm.value, action: action.value }
      let res = await proxy.$api.menuSubmit(params)
      proxy.$message.success('操作成功')
      handleReset('dialogForm')
      showModal.value = false
      getMenuList()
    }
  })
}
// 关闭dialog
const handleClose = () => {
  showModal.value = false
  handleReset('dialogForm')
}

onMounted(() => {
  getMenuList()
})

// 菜单列表初始化
const getMenuList = async () => {
  try {
    const list = await proxy.$api.getMenuList(queryForm)
    menuList.value = list
  } catch (error) {
    throw new Error(error)
  }
}




</script>

<style lang="scss">
</style>