<!-- 基础数据-工艺路线维护 -->
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
        <el-select v-model="queryParams.sec" placeholder="请选择所属工段" clearable class="!w-240px">
          <el-option
            v-for="item in LabSectionEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          <el-button link type="primary" @click="openDetail(scope.row)">
            {{ scope.row.code }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="工艺路线描述" align="center" prop="name" min-width="200" />
      <el-table-column label="所属工段" align="center" width="120">
        <template #default="scope">
          {{ getLabSectionName(scope.row.sec) }}
        </template>
      </el-table-column>
      <el-table-column label="工序数" align="center" prop="stepCount" width="90">
        <template #default="scope">
          <span class="num">{{ scope.row.stepCount ?? 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190" fixed="right">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <el-button link type="primary" @click="openDetail(scope.row)">明细</el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['lab:route:update']"
            >
              编辑
            </el-button>
            <el-dropdown trigger="click">
              <el-button link type="primary"><Icon icon="ep:d-arrow-right" /> 更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="handleDelete(scope.row.id)"
                    v-if="checkPermi(['lab:route:delete'])"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
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

  <!-- 明细弹窗 -->
  <el-dialog v-model="detailVisible" :title="detailTitle" width="620px" append-to-body>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="工艺路线编号">{{ detailData.code }}</el-descriptions-item>
      <el-descriptions-item label="所属工段">{{ getLabSectionName(detailData.sec) }}</el-descriptions-item>
      <el-descriptions-item label="工艺路线描述" :span="2">{{ detailData.name }}</el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">工序明细（{{ detailData.steps?.length ?? 0 }}）</el-divider>
    <el-table :data="detailData.steps || []" border>
      <el-table-column label="序号" prop="seq" align="center" width="80" />
      <el-table-column label="工序编号" prop="procCode" />
      <el-table-column label="工序描述" prop="procName" />
    </el-table>
  </el-dialog>

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
          <el-form-item label="工艺路线编号" prop="code">
            <el-input v-model="formData.code" placeholder="请输入工艺路线编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工艺路线描述" prop="name">
            <el-input v-model="formData.name" placeholder="请输入工艺路线描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属工段" prop="sec">
        <el-select
          v-model="formData.sec"
          placeholder="请选择所属工段"
          clearable
          class="!w-300px"
          @change="handleSectionChange"
        >
          <el-option
            v-for="item in LabSectionEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 工序明细子表 -->
      <el-divider content-position="left">工序明细</el-divider>
      <el-table :data="formData.steps" border>
        <el-table-column label="序号" prop="seq" align="center" width="90">
          <template #default="{ row }">
            <el-input v-model="row.seq" disabled />
          </template>
        </el-table-column>
        <el-table-column label="工序编号" prop="procCode" min-width="200">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`steps.${$index}.procCode`"
              :rules="formRules.procCode"
              class="mb-0px!"
            >
              <el-select
                v-model="row.procCode"
                placeholder="请选择工序"
                filterable
                class="!w-100%"
                :disabled="!formData.sec"
                @change="handleProcessChange(row)"
              >
                <el-option
                  v-for="item in processOptions"
                  :key="item.procCode"
                  :label="`${item.procCode} | ${item.procName}`"
                  :value="item.procCode"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="工序描述" prop="procName" min-width="180">
          <template #default="{ row }">
            <el-input v-model="row.procName" disabled placeholder="选择工序后自动填充" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="60">
          <template #default="{ $index }">
            <el-button link type="danger" @click="handleDeleteStep($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" plain class="mt-2" @click="handleAddStep">
        <Icon icon="ep:plus" class="mr-5px" /> 添加工序
      </el-button>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  createRoute,
  deleteRoute,
  getRoute,
  getRoutePage,
  RouteStepVO,
  RouteVO,
  updateRoute
} from '@/api/lab/route'
import { LabSectionEnum, getLabSectionName } from '@/api/lab/resource'
import { getProcessListBySection, ProcessVO } from '@/api/lab/process'
import { checkPermi } from '@/utils/permission'

defineOptions({ name: 'LabRoute' })

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

// ==================== 明细弹窗 ====================
const detailVisible = ref(false) // 明细弹窗是否展示
const detailTitle = ref('') // 明细弹窗标题
const detailData = ref<RouteVO>({ code: '', name: '', steps: [] }) // 明细数据

/** 打开明细弹窗：展示主数据 + 工序明细 */
const openDetail = async (row: RouteVO) => {
  detailVisible.value = true
  detailTitle.value = '工艺路线 · ' + row.code
  const data = await getRoute(row.id)
  detailData.value = data
  if (!detailData.value.steps) {
    detailData.value.steps = []
  }
}

// ==================== 表单弹窗 ====================
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
const processOptions = ref<ProcessVO[]>([]) // 当前工段下的工序列表（工序编号下拉）
const formData = ref({
  id: undefined,
  code: '',
  name: '',
  sec: undefined,
  steps: [] as RouteStepVO[]
})
const formRules = reactive({
  code: [{ required: true, message: '工艺路线编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '工艺路线描述不能为空', trigger: 'blur' }],
  procCode: [{ required: true, message: '请选择工序', trigger: 'change' }]
})

/**
 * 工段变更：通过工段 Code 调后端工序接口，加载工序下拉；未选工段前工序下拉为空
 * @param preserveSteps 是否保留已录入的工序明细（编辑回显时使用）
 */
const handleSectionChange = async (preserveSteps = false) => {
  processOptions.value = []
  if (!preserveSteps) {
    formData.value.steps = []
  }
  if (formData.value.sec) {
    processOptions.value = await getProcessListBySection(formData.value.sec)
  }
}

/** 选择工序后，自动填充工序描述 */
const handleProcessChange = (row: RouteStepVO) => {
  const proc = processOptions.value.find((item) => item.procCode === row.procCode)
  row.procName = proc?.procName ?? ''
}

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
      // 编辑时加载对应工段的工序，并保留原工序明细用于回显
      await handleSectionChange(true)
    } finally {
      formLoading.value = false
    }
  }
}

/** 新增工序：序号自动按行递增 */
const handleAddStep = () => {
  formData.value.steps.push({ seq: formData.value.steps.length + 1, procCode: '', procName: '' })
}

/** 删除工序：删除后序号重新排列 */
const handleDeleteStep = (index: number) => {
  formData.value.steps.splice(index, 1)
  formData.value.steps.forEach((step, i) => {
    step.seq = i + 1
  })
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
    sec: undefined,
    steps: []
  }
  processOptions.value = []
  formRef.value?.resetFields()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
