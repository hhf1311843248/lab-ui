<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="85px"
    >
      <el-form-item label="资源编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入资源编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入资源名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="item in LabResourceStatusEnum"
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
          v-hasPermi="['lab:resource:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="资源编号" align="center" prop="code" width="120" fixed="left">
        <template #default="scope">
          <el-link type="primary" @click="openForm('update', scope.row.id)">
            {{ scope.row.code }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="资源名称" align="center" prop="name" min-width="140" />
      <el-table-column label="资源类型" align="center" prop="type" width="100" />
      <el-table-column label="所属工段" align="center" width="120">
        <template #default="scope">
          {{ getLabSectionName(scope.row.sectionCode) }}
        </template>
      </el-table-column>
      <el-table-column label="班次" align="center" prop="shift" width="120" />
      <el-table-column label="设备节拍" align="center" width="150">
        <template #default="scope">
          {{ scope.row.beatTime != null ? `${scope.row.beatTime} ${formatBeatUnit(scope.row.beatUnit)}` : '—' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === 0 ? 'success' : scope.row.status === 1 ? 'primary' : 'warning'"
          >
            {{ getLabResourceStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['lab:resource:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['lab:resource:delete']"
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

  <!-- 表单弹窗：添加/修改 -->
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="700px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="资源编号" prop="code">
            <el-input v-model="formData.code" placeholder="请输入资源编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入资源名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资源类型" prop="type">
            <el-input v-model="formData.type" placeholder="请输入资源类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属工段" prop="sectionCode">
            <el-select
              v-model="formData.sectionCode"
              placeholder="请选择所属工段"
              class="!w-1/1"
            >
              <el-option
                v-for="item in LabSectionEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班次" prop="shift">
            <el-input v-model="formData.shift" placeholder="请输入班次/可用时段" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备节拍" prop="beatTime">
            <el-input-number v-model="formData.beatTime" :min="0" :precision="4" class="!w-1/1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="节拍单位" prop="beatUnit">
            <div class="flex items-center !w-1/1">
              <el-select v-model="formData.beatUnit" class="!flex-1">
                <el-option
                  v-for="u in beatUnitOptions"
                  :key="u.value"
                  :label="u.label"
                  :value="u.value"
                />
              </el-select>
              <span class="ml-8px text-gray-500">/件</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" class="!w-1/1">
              <el-option
                v-for="item in LabResourceStatusEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {
  createResource,
  deleteResource,
  getResource,
  getResourcePage,
  updateResource,
  LabSectionEnum,
  LabResourceStatusEnum,
  getLabSectionName,
  getLabResourceStatusLabel,
  ResourceVO
} from '@/api/lab/resource'

defineOptions({ name: 'LabBasedataResource' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ResourceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getResourcePage(queryParams)
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

/** 添加/修改操作 */
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  type: undefined,
  sectionCode: undefined,
  shift: undefined,
  beatTime: undefined,
  beatUnit: 'h', // 默认小时
  status: 1 // 空闲
})
// 节拍单位选项：h-小时、m-分钟、s-秒
const beatUnitOptions = [
  { value: 'h', label: 'h（小时）' },
  { value: 'm', label: 'm（分钟）' },
  { value: 's', label: 's（秒）' }
]
/** 节拍单位展示：h/m/s + /件（兼容旧数据已存 h/件） */
const formatBeatUnit = (unit?: string): string => {
  const u = unit || 'h'
  return u.includes('/') ? u : `${u}/件`
}
const formRules = reactive({
  code: [{ required: true, message: '资源编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '资源名称不能为空', trigger: 'blur' }],
  sectionCode: [{ required: true, message: '请选择所属工段', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增资源' : '修改资源'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await getResource(id)
    } finally {
      formLoading.value = false
    }
  }
}

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ResourceVO
    if (formType.value === 'create') {
      await createResource(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateResource(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 刷新列表
    await getList()
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    code: undefined,
    name: undefined,
    type: undefined,
    sectionCode: undefined,
    shift: undefined,
    beatTime: undefined,
    beatUnit: 'h', // 默认小时
    status: 1 // 空闲
  }
  formRef.value?.resetFields()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await deleteResource(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>