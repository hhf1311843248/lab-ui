<!-- 实验策划-工艺路线 -->
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
      <el-form-item label="工艺路线编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入工艺路线编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="工艺路线描述" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入工艺路线描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="所属工段" prop="sec">
        <el-input
          v-model="queryParams.sec"
          placeholder="请输入所属工段"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['lab:route:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="工艺路线编号" align="center" prop="code" min-width="160">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">
            {{ scope.row.code }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="工艺路线描述" align="center" prop="name" min-width="200" />
      <el-table-column label="所属工段" align="center" prop="sec" min-width="120" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="160" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['lab:route:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['lab:route:delete']"
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
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="编号" prop="code">
            <el-input v-model="formData.code" placeholder="请输入工艺路线编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="name">
            <el-input v-model="formData.name" placeholder="请输入工艺路线描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属工段" prop="sec">
        <el-input v-model="formData.sec" placeholder="请输入所属工段" />
      </el-form-item>

      <!-- 工序明细子表 -->
      <el-divider content-position="left">工序明细</el-divider>
      <el-table :data="formData.steps" border>
        <el-table-column label="明细序号" type="index" align="center" width="80" />
        <el-table-column label="序号" prop="seq" min-width="80">
          <template #default="{ row, $index }">
            <el-form-item :prop="`steps.${$index}.seq`" :rules="formRules.seq" class="mb-0px!">
              <el-input-number v-model="row.seq" :min="0" controls-position="right" class="!w-100%" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="工序编号" prop="procCode" min-width="140">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`steps.${$index}.procCode`"
              :rules="formRules.procCode"
              class="mb-0px!"
            >
              <el-input v-model="row.procCode" placeholder="请输入工序编号" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="工序描述" prop="procName" min-width="160">
          <template #default="{ row }">
            <el-form-item class="mb-0px!">
              <el-input v-model="row.procName" placeholder="请输入工序描述" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="60">
          <template #default="{ $index }">
            <el-button link type="danger" @click="handleDeleteStep($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" plain class="mt-2" @click="handleAddStep">
        <Icon icon="ep:plus" class="mr-5px" /> 新增工序
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
  createRoute,
  deleteRoute,
  getRoute,
  getRoutePage,
  RouteStepVO,
  RouteVO,
  updateRoute
} from '@/api/lab/route'

defineOptions({ name: 'LabPlanRoute' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<RouteVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  sec: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getRoutePage(queryParams)
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
    await deleteRoute(id)
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
  name: '',
  sec: '',
  steps: [] as RouteStepVO[]
})
const formRules = reactive({
  code: [{ required: true, message: '工艺路线编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '工艺路线描述不能为空', trigger: 'blur' }],
  seq: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
  procCode: [{ required: true, message: '工序编号不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增工艺路线' : '编辑工艺路线'
  formType.value = type
  resetForm()
  // 修改时，加载数据
  if (id) {
    formLoading.value = true
    try {
      const data = await getRoute(id)
      formData.value = data
      if (!formData.value.steps) {
        formData.value.steps = []
      }
    } finally {
      formLoading.value = false
    }
  }
}

/** 新增工序 */
const handleAddStep = () => {
  formData.value.steps.push({ seq: undefined, procCode: '', procName: '' })
}

/** 删除工序 */
const handleDeleteStep = (index: number) => {
  formData.value.steps.splice(index, 1)
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = { ...formData.value }
    if (formType.value === 'create') {
      await createRoute(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateRoute(data)
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
    name: '',
    sec: '',
    steps: []
  }
  formRef.value?.resetFields()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>