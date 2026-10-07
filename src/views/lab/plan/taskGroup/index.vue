<!-- 实验策划-实验任务组 -->
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
      <el-form-item label="任务组编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入任务组编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
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
          v-hasPermi="['lab:task-group:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="任务组编号" align="center" prop="code" min-width="160">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">
            {{ scope.row.code }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="任务组描述" align="center" prop="description" min-width="200" />
      <el-table-column label="优先级" align="center" prop="prio" min-width="90" />
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
            v-hasPermi="['lab:task-group:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['lab:task-group:delete']"
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
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" append-to-body>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务组编号" prop="code">
            <el-input v-model="formData.code" placeholder="请输入任务组编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="prio">
            <el-input v-model="formData.prio" placeholder="请输入优先级" />
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
      <el-form-item label="任务组描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="2"
          placeholder="请输入任务组描述"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态" class="!w-100%">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <!-- 配方关联子表 -->
      <el-divider content-position="left">配方关联</el-divider>
      <el-table :data="formData.linkList" border>
        <el-table-column label="明细序号" type="index" align="center" width="60" />
        <el-table-column label="配方编号" prop="formulaCode" min-width="180">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`linkList.${$index}.formulaCode`"
              :rules="formRules.formulaCode"
              class="mb-0px!"
            >
              <el-input v-model="row.formulaCode" placeholder="请输入配方编号" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="负极配方" prop="negFormula" min-width="160">
          <template #default="{ row }">
            <el-form-item class="mb-0px!">
              <el-input v-model="row.negFormula" placeholder="请输入负极配方" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="60">
          <template #default="{ $index }">
            <el-button link type="danger" @click="handleDeleteLink($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" plain class="mt-2" @click="handleAddLink">
        <Icon icon="ep:plus" class="mr-5px" /> 新增配方
      </el-button>
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
  createTaskGroup,
  deleteTaskGroup,
  getTaskGroup,
  getTaskGroupPage,
  TaskGroupLinkVO,
  TaskGroupVO,
  updateTaskGroup
} from '@/api/lab/taskGroup'

defineOptions({ name: 'LabPlanTaskGroup' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<TaskGroupVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

// 状态选项
const statusOptions = ['新建', '已下达', '生产中', '已完工', '取消']

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getTaskGroupPage(queryParams)
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
    await deleteTaskGroup(id)
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
const formData = ref({
  id: undefined,
  code: '',
  description: '',
  prio: '',
  planStart: '',
  planEnd: '',
  status: '',
  linkList: [] as TaskGroupLinkVO[]
})
const formRules = reactive({
  code: [{ required: true, message: '任务组编号不能为空', trigger: 'blur' }],
  formulaCode: [{ required: true, message: '配方编号不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增实验任务组' : '编辑实验任务组'
  formType.value = type
  resetForm()
  // 修改时，加载数据
  if (id) {
    formLoading.value = true
    try {
      const data = await getTaskGroup(id)
      formData.value = data
      if (!formData.value.linkList) {
        formData.value.linkList = []
      }
    } finally {
      formLoading.value = false
    }
  }
}

/** 新增配方 */
const handleAddLink = () => {
  formData.value.linkList.push({ formulaCode: '', negFormula: '' })
}

/** 删除配方 */
const handleDeleteLink = (index: number) => {
  formData.value.linkList.splice(index, 1)
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = { ...formData.value }
    if (formType.value === 'create') {
      await createTaskGroup(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateTaskGroup(data)
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
    code: '',
    description: '',
    prio: '',
    planStart: '',
    planEnd: '',
    status: '',
    linkList: []
  }
  formRef.value?.resetFields()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>