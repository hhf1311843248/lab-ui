<!-- 实验任务（任务监控） -->
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
      <el-form-item label="任务编号" prop="taskNo">
        <el-input
          v-model="queryParams.taskNo"
          placeholder="请输入任务编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="配方编号" prop="formulaCode">
        <el-input
          v-model="queryParams.formulaCode"
          placeholder="请输入配方编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="工段" prop="section">
        <el-input
          v-model="queryParams.section"
          placeholder="请输入工段"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="当前工序" prop="procName">
        <el-input
          v-model="queryParams.procName"
          placeholder="请输入当前工序"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="item in statusOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 任务监控列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
      :row-class-name="rowClassName"
    >
      <el-table-column label="任务编号" align="center" prop="taskNo" width="160">
        <template #default="scope">
          <el-button link type="primary" @click="openStatus(scope.row)">
            {{ scope.row.taskNo }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="配方编号" align="center" prop="formulaCode" width="140" />
      <el-table-column label="工段" align="center" prop="section" width="100" />
      <el-table-column label="当前工序" align="center" prop="procName" width="120" />
      <el-table-column label="进度" align="center" prop="progress" width="120">
        <template #default="scope">
          <el-progress :percentage="scope.row.progress ?? 0" :stroke-width="16" />
        </template>
      </el-table-column>
      <el-table-column label="占用资源" align="center" prop="resource" width="120" />
      <el-table-column label="优先级" align="center" prop="priority" width="90" />
      <el-table-column
        label="计划开始时间"
        align="center"
        prop="planStart"
        :formatter="dateFormatter"
        width="160"
      />
      <el-table-column
        label="计划完成时间"
        align="center"
        prop="planEnd"
        :formatter="dateFormatter"
        width="160"
      />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-tag :type="taskStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openStatus(scope.row)"
            v-hasPermi="['lab:task:update']"
          >
            编辑状态
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 编辑状态弹窗 -->
  <el-dialog v-model="dialogVisible" title="编辑任务状态" width="500px" append-to-body>
    <el-form :model="form" label-width="100px">
      <el-form-item label="任务编号">
        <el-input :model-value="form.taskNo" disabled />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="请选择状态" class="!w-full">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="进度(%)">
        <el-input-number v-model="form.progress" :min="0" :max="100" controls-position="right" class="!w-full" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { TaskApi, TaskVO } from '@/api/lab/task'

defineOptions({ name: 'LabExecTaskMonitor' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true) // 列表的加载中
const list = ref<TaskVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskNo: undefined,
  formulaCode: undefined,
  section: undefined,
  procName: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

// 状态选项
const statusOptions = ['待开始', '执行中', '暂停', '已完工', '异常']

/** 已下达状态行高亮（浅绿背景） */
const rowClassName = ({ row }) => (row.status === '已下达' ? 'task-row-released' : '')

/** 状态对应的 el-tag 颜色 */
const taskStatusType = (status: string) => {
  switch (status) {
    case '执行中':
      return 'success'
    case '已完工':
      return 'success'
    case '暂停':
      return 'warning'
    case '异常':
      return 'danger'
    case '待开始':
      return 'info'
    default:
      return 'info'
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TaskApi.getPage(queryParams)
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

// 编辑状态弹窗
const dialogVisible = ref(false)
const submitLoading = ref(false)
const form = reactive<TaskVO>({
  id: 0,
  taskNo: '',
  status: '',
  progress: 0
})

/** 打开编辑状态弹窗 */
const openStatus = (row: TaskVO) => {
  form.id = row.id
  form.taskNo = row.taskNo
  form.status = row.status
  form.progress = row.progress ?? 0
  dialogVisible.value = true
}

/** 提交编辑状态 */
const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await TaskApi.update({ id: form.id, status: form.status, progress: form.progress })
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    await getList()
  } finally {
    submitLoading.value = false
  }
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style lang="scss">
// 已下达状态行：浅绿背景（浅色主题用更浅的绿，深色主题用深绿）
.el-table__row.task-row-released td.el-table__cell {
  background-color: #ddf3e1;
}
html.dark .el-table__row.task-row-released td.el-table__cell {
  background-color: #123c1f;
}
</style>