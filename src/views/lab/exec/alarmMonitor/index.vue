<!-- 报警信息（监控列表） -->
<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="报警编号" prop="alarmNo">
        <el-input
          v-model="queryParams.alarmNo"
          placeholder="请输入报警编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="来源" prop="sourceType">
        <el-select
          v-model="queryParams.sourceType"
          placeholder="请选择来源"
          clearable
          class="!w-240px"
        >
          <el-option v-for="item in sourceTypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="来源名称" prop="sourceName">
        <el-input
          v-model="queryParams.sourceName"
          placeholder="请输入来源名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="级别" prop="level">
        <el-select v-model="queryParams.level" placeholder="请选择级别" clearable class="!w-240px">
          <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 报警监控列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
    >
      <el-table-column label="报警编号" align="center" prop="alarmNo" width="160" />
      <el-table-column label="来源" align="center" prop="sourceType" width="100">
        <template #default="scope">
          <el-tag type="info" plain>{{ scope.row.sourceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="来源名称" align="center" prop="sourceName" width="140" />
      <el-table-column label="级别" align="center" prop="level" width="90">
        <template #default="scope">
          <el-tag :type="levelType(scope.row.level)">{{ scope.row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报警类型" align="center" prop="type" width="140" />
      <el-table-column label="报警指标" align="center" prop="metric" min-width="140" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-tag :type="alarmStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="报警时间"
        align="center"
        prop="alarmTime"
        :formatter="dateFormatter"
        width="170"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { AlarmApi, AlarmVO } from '@/api/lab/alarm'

defineOptions({ name: 'LabExecAlarmMonitor' })

const loading = ref(true) // 列表的加载中
const list = ref<AlarmVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  alarmNo: undefined,
  sourceType: undefined,
  sourceName: undefined,
  level: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

// 来源选项
const sourceTypeOptions = ['设备', '任务', '环境']
// 级别选项
const levelOptions = ['紧急', '重要', '一般']
// 状态选项
const statusOptions = ['未处理', '处理中', '已处理', '已忽略']

/** 级别对应的 el-tag 颜色 */
const levelType = (level: string) => {
  switch (level) {
    case '紧急':
      return 'danger'
    case '重要':
      return 'warning'
    case '一般':
      return 'info'
    default:
      return 'info'
  }
}

/** 状态对应的 el-tag 颜色 */
const alarmStatusType = (status: string) => {
  switch (status) {
    case '已处理':
      return 'success'
    case '处理中':
      return 'warning'
    case '未处理':
      return 'danger'
    case '已忽略':
      return 'info'
    default:
      return 'info'
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AlarmApi.getPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>