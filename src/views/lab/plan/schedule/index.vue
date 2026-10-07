<!-- 实验策划-排产任务 -->
<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="任务组编号" prop="groupCode">
        <el-input
          v-model="queryParams.groupCode"
          placeholder="请输入任务组编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="配方编号" prop="formulaCode">
        <el-input
          v-model="queryParams.formulaCode"
          placeholder="请输入配方编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-200px">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['lab:schedule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="任务组编号" align="center" prop="groupCode" min-width="150">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">
            {{ scope.row.groupCode }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="配方编号" align="center" prop="formulaCode" min-width="140" />
      <el-table-column label="工序名称" align="center" prop="procName" min-width="120" />
      <el-table-column label="排产资源" align="center" prop="resource" min-width="110" />
      <el-table-column label="优先级" align="center" prop="priority" min-width="90" />
      <el-table-column
        label="计划开始时间"
        align="center"
        prop="planStart"
        :formatter="dateFormatter"
        width="170px"
      />
      <el-table-column
        label="计划完成时间"
        align="center"
        prop="planEnd"
        :formatter="dateFormatter"
        width="170px"
      />
      <el-table-column label="状态" align="center" prop="status" min-width="90" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="170px"
      />
      <el-table-column label="操作" align="center" width="160" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['lab:schedule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['lab:schedule:delete']"
          >
            删除
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

  <!-- 表单弹窗：新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" append-to-body>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务组编号" prop="groupCode">
            <el-input v-model="formData.groupCode" placeholder="请输入任务组编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配方编号" prop="formulaCode">
            <el-input v-model="formData.formulaCode" placeholder="请输入配方编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工序名称" prop="procName">
            <el-input v-model="formData.procName" placeholder="请输入工序名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排产资源" prop="resource">
            <el-input v-model="formData.resource" placeholder="请输入排产资源" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="priority">
            <el-input v-model="formData.priority" placeholder="请输入优先级" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" class="!w-100%">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划开始时间" prop="planStart">
            <el-date-picker
              v-model="formData.planStart"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择计划开始时间"
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划完成时间" prop="planEnd">
            <el-date-picker
              v-model="formData.planEnd"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择计划完成时间"
              class="!w-100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import {
  createSchedule,
  deleteSchedule,
  getSchedule,
  getSchedulePage,
  ScheduleTaskVO,
  updateSchedule
} from '@/api/lab/schedule'

defineOptions({ name: 'LabPlanSchedule' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ScheduleTaskVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  groupCode: undefined,
  formulaCode: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

// 状态选项
const statusOptions = ['待排产', '已排产', '执行中', '已完成']

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getSchedulePage(queryParams)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await deleteSchedule(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// ==================== 表单弹窗 ====================
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
const formData = ref<ScheduleTaskVO>({
  id: undefined,
  groupCode: '',
  formulaCode: '',
  procName: '',
  resource: '',
  priority: '',
  planStart: '',
  planEnd: '',
  status: ''
})
const formRules = reactive({})

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增排产任务' : '编辑排产任务'
  formType.value = type
  resetForm()
  // 修改时，加载数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await getSchedule(id)
    } finally {
      formLoading.value = false
    }
  }
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = { ...formData.value }
    if (formType.value === 'create') {
      await createSchedule(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateSchedule(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    await getList()
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    groupCode: '',
    formulaCode: '',
    procName: '',
    resource: '',
    priority: '',
    planStart: '',
    planEnd: '',
    status: ''
  }
  formRef.value?.resetFields()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>