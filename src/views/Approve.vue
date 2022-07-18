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
      <el-table :data="applyList">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" prop="date"
          :formatter="item.formatter" :width="item.width" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)"
              v-if="scope.row.curAuditUserName === userInfo.userName && [1, 2].includes(scope.row.applyState)">审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination :page-size="pager.pageSize" @current-change="handleCurrentChange" class="pagination" background
        layout="prev, pager, next" :total="pager.total" />
    </div>

    <el-dialog title="审核" width="50%" v-model="showDetailModal" destroy-on-close>
      <el-form ref="dialogForm" label-width="120px" :model="auditForm" label-suffix=":">
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="auditForm.remark" type="textarea" :row="3" placeholder="请输入审核备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')">审核通过</el-button>
          <el-button @click="handleApprove('refuse')" type="primary">驳回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, toRaw, toRefs, ref } from 'vue'
import utils from './../utils/utils'

const { proxy } = getCurrentInstance()

const { queryForm, pager, applyList, showDetailModal, detail, userInfo, auditForm } = toRefs(reactive({
  queryForm: {
    applyState: 1
  },
  pager: {
    pageSize: 10,
    total: 0,
    pageNum: 1
  },
  // 申请列表
  applyList: [],
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
  },
  showDetailModal: false,
  detail: {},
  userInfo: proxy.$store.state.userInfo,
  auditForm: {
    remark: ''
  }
}))

// 定义动态表格格式
const columns = reactive([
  {
    label: '单号',
    prop: 'orderNo'
  },
  {
    label: '申请人',
    prop: 'applyUser',
    formatter(row) {
      return row.applyUser.userName
    }
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
    label: '休假原因', prop: 'reasons'
  },
  {
    label: '申请时间', prop: 'createTime', formatter: (row, column, value) => {
      return utils.formateDate(new Date(value))
    }
  },
  {
    label: '审批人',
    prop: 'auditUsers'
  },
  {
    label: '当前审批人',
    prop: 'curAuditUserName'
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
  }
])

// 初始化接口调用
onMounted(() => {
  getApplyList()
})

// 加载申请列表
const getApplyList = async () => {
  let params = { type: 'approve', ...queryForm.value, ...pager.value, }
  let { list, page } = await proxy.$api.getApplyList(params)
  applyList.value = list
  pager.total = page.total
}

// 重置查询表单
const handleReset = (form) => {
  // 两种重置表单的方法
  // 1. 表单元素直接重置
  // form.value.resetFields()
  // 2. $refs.表单元素 重置
  proxy.$refs[form].resetFields()
}
const handleClose = () => {
  showDetailModal.value = false
  handleReset('dialogForm')
}

// 分页事件处理
const handleCurrentChange = (currentPage) => {
  pager.pageNum = currentPage
}

const handleApprove = (action) => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { action, remark: auditForm.value.remark, _id: detail.value._id }
      let res = await proxy.$api.leaveApprove(params)
      handleClose()
      proxy.$message.success('处理成功')
      getApplyList()
      proxy.$store.commit('saveNoticeCount', proxy.$store.state.noticeCount - 1)
    }
  })
}

// 查看详情
const handleDetail = (row) => {
  showDetailModal.value = true
  let data = { ...row }
  data.applyTypeName = {
    1: '事假',
    2: '调休',
    3: '年假'
  }[data.applyType]
  data.time = (
    utils.formateDate(new Date(data.startTime), 'yyyy-MM-dd') + '到' + utils.formateDate(new Date(data.endTime), 'yyyy-MM-dd')
  )
  data.applyStateName = {
    1: '待审批',
    2: '审批中',
    3: '审批拒绝',
    4: '审批通过',
    5: '作废',
  }[data.applyState]
  detail.value = data
}

</script>

<style lang="scss">
</style>