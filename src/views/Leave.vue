<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="3" label="审批通过"></el-option>
            <el-option :value="3" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" prop="date"
          :formatter="item.formatter" :width="item.width" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">查看</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination :page-size="pager.pageSize" @current-change="handleCurrentChange" class="pagination" background
        layout="prev, pager, next" :total="pager.total" />
    </div>

    <el-dialog title="休假申请" v-model="showModal" width="70%">
      <el-form ref="dialogForm" :rules="rules" :model="leaveForm" label-width="100px">
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType" required>
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker v-model="leaveForm.startTime" type="date" placeholder="选择开始日期"
                  @change="(val) => handleDateChange('startTime')" />
              </el-form-item>
            </el-col>
            <el-col :span="1">---</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime">
                <el-date-picker v-model="leaveForm.endTime" type="date" placeholder="选择结束日期"
                  @change="(val) => handleDateChange('endTime')" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input v-model="leaveForm.reasons" type="textarea" :row="3" placeholder="请输入休假原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, toRaw, toRefs, ref } from 'vue'
import utils from './../utils/utils'

const { proxy } = getCurrentInstance()

const { queryForm, pager, applyList, leaveForm, showModal, action, rules } = toRefs(reactive({
  queryForm: {
    applyState: ''
  },
  pager: {
    pageSize: 10,
    total: 0,
    pageNum: 1
  },
  // 申请列表
  applyList: [],
  leaveForm: {
    applyType: 1,
    startTime: '',
    endTime: '',
    leaveTime: '0天',
    reasons: ''
  },
  showModal: false,
  // 操作行为
  action: '',
  rules: {
    startTime: [
      {
        type: 'date',
        required: true,
        message: '请输入开始日期',
        trigger: 'change'
      }
    ],
    endTime: [
      {
        type: 'date',
        required: true,
        message: '请输入结束日期',
        trigger: 'change'
      }
    ],
    reasons: [
      {
        required: true,
        message: '请输入休假原因',
        trigger: ['change', 'blur']
      }
    ]
  }
}))

// 定义动态表格格式
const columns = reactive([
  {
    label: '单号',
    prop: 'orderNo'
  },
  {
    label: '休假时间',
    prop: '',
    formatter(row) {
      return utils.formateDate(new Date(row.startTime), 'yyyy-MM-dd') + '到' + utils.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
    }
  },
  {
    label: '休假时长',
    prop: 'leaveTime'
  },
  {
    label: '休假类型', prop: 'applyType', formatter(row, column, value) {
      return {
        1: '事假',
        2: '调休',
        3: '年假'
      }[value]
    }
  },
  {
    label: '休假原因', prop: 'reason'
  },
  {
    label: '申请时间', prop: 'createTime', formatter: (row, column, value) => {
      return utils.formateDate(new Date(value))
    }
  },
  {
    label: '审批人',
    prop: 'auditUser'
  },
  {
    label: '当前审批人',
    prop: 'curAuditUser'
  },
  {
    label: '审批状态',
    prop: 'applyState',
    formatter(row, column, value) {
      return {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废',
      }[value]
    }
  },
])

// 初始化接口调用
onMounted(() => {
  getApplyList()
})

// 加载申请列表
const getApplyList = async () => {
  let params = { ...queryForm.value, ...pager.value }
  let { list, page } = await proxy.$api.getApplyList(params)
  applyList.value = list
  pager.total = page.total
}

// 查询事件，获取用户列表
const handleQuery = () => {
}
// 重置查询表单
const handleReset = (form) => {
  // 两种重置表单的方法
  // 1. 表单元素直接重置
  // form.value.resetFields()
  // 2. $refs.表单元素 重置
  proxy.$refs[form].resetFields()
}

// 分页事件处理
const handleCurrentChange = (currentPage) => {
  pager.pageNum = currentPage
}

// 用户单个删除
const handleDel = async (row) => {

}

// 申请休假
const handleApply = () => {
  action.value = 'create'
  showModal.value = true
}


// 提交表单
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...leaveForm.value, action: action.value }
      const res = await proxy.$api.leaveOperate(params)
      proxy.$message.success('创建成功')
      handleClose()
      getApplyList()
    }
  })
}
// 用户弹窗关闭
const handleClose = () => {
  showModal.value = false
  handleReset('dialogForm')
}
// 用户编辑
const handleEdit = (row) => {
  action.value = 'edit'
  showModal.value = true
}

// 获取休假时长
const handleDateChange = (key, val) => {
  console.log(123)
  let { startTime, endTime } = leaveForm.value
  if (!startTime || !endTime) return
  if (startTime > endTime) {
    proxy.$message.error('开始日期不能晚于结束日期')
    leaveForm.value.leaveTime = '0天'
    setTimeout(() => {
      leaveForm.value[key] = ''
    }, 0)
  } else {
    console.log(leaveForm.value)
    leaveForm.value.leaveTime = (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + '天'
  }
}
</script>

<style lang="scss">
</style>