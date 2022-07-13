<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" prop="date"
          :formatter="item.formatter" :width="item.width" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pager.pageSize" @current-change="handleCurrentChange" class="pagination" background
        layout="prev, pager, next" :total="pager.total" />
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, toRefs, ref } from 'vue'
// 获取表单元素
const form = ref(null)
// 得到vue3全局上下文对象
const { proxy } = getCurrentInstance()
// 初始化用户表单对象
const user = reactive({
  state: 0
})
// 初始化用户列表数据
const userList = ref([])
// 初始化分页对象
const pager = reactive({
  pageNum: 1,
  pageSize: 10
})
// 选中用户列表的对象
const checkedUserIds = ref([])
// 定义动态表格格式
const columns = reactive([
  { label: '用户ID', prop: 'userId' },
  { label: '用户名称', prop: 'userName' },
  { label: '用户邮箱', prop: 'userEmail' },
  {
    label: '用户角色', prop: 'role', formatter(row, column, value) {
      return {
        0: '管理员',
        1: '普通用户'
      }[value]
    }
  },
  {
    label: '用户状态', prop: 'state', formatter(row, column, value) {
      return {
        1: '在职',
        2: '离职',
        3: '试用期',
      }[value]
    }
  },
  { label: '注册时间', prop: 'createTime' },
  { label: '最后登陆时间', prop: 'lastLoginTime' },
])

// 初始化接口调用
onMounted(() => {
  getUserList()
})
// 获取用户列表
const getUserList = async () => {
  let params = { ...user, ...pager }
  try {
    const { list, page } = await proxy.$api.getUserList(params)
    userList.value = list
    pager.total = page.total
  } catch (error) {

  }
}
// 查询事件，获取用户列表
const handleQuery = () => {
  getUserList()
}
// 重置查询表单
const handleReset = () => {
  // 两种重置表单的方法
  // 1. 表单元素直接重置
  form.value.resetFields()
  // 2. $refs.表单元素 重置
  // proxy.$refs.form.resetFields()
}

// 分页事件处理
const handleCurrentChange = (currentPage) => {
  pager.pageNum = currentPage
  getUserList()
}

// 用户单个删除
const handleDel = async (row) => {
  await proxy.$api.userDel({
    userIds: [row.userId] // 可单个删除，也可批量删除
  })
  proxy.$message.success('删除成功')
  getUserList()
}

// 批量删除用户
const handlePatchDel = async () => {
  if (checkedUserIds.value.length === 0) {
    proxy.$message.error('请选择要删除的用户')
    return
  }
  const res = await proxy.$api.userDel({
    userIds: checkedUserIds.value // 可单个删除，也可批量删除
  })
  if (res.nModified > 0) {
    proxy.$message.success('删除成功')
    getUserList()
  } else {
    proxy.$message.error('删除失败')
  }
}

// 表格多选
const handleSelectionChange = (list) => {
  let arr = []
  list.map(item => {
    arr.push(item.userId)
  })
  checkedUserIds.value = arr
}

</script>

<style lang="scss">
</style>