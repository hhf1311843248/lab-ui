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
      <el-form-item label="工序编号" prop="procCode">
        <el-input
          v-model="queryParams.procCode"
          placeholder="请输入工序编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="工序描述" prop="procName">
        <el-input
          v-model="queryParams.procName"
          placeholder="请输入工序描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          v-hasPermi="['lab:process:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="工段编号" align="center" prop="secCode" width="120" />
      <el-table-column label="工段描述" align="center" prop="secName" min-width="140" />
      <el-table-column label="工序编号" align="center" prop="procCode" width="120" />
      <el-table-column label="工序描述" align="center" prop="procName" min-width="180" />
      <el-table-column label="标准节拍" align="center" prop="takt" width="100" />
      <el-table-column label="默认资源" align="center" prop="resName" min-width="120" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['lab:process:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['lab:process:delete']"
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
          <el-form-item label="工序编号" prop="procCode">
            <el-input v-model="formData.procCode" placeholder="请输入工序编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工序描述" prop="procName">
            <el-input v-model="formData.procName" placeholder="请输入工序描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工段" prop="secCode">
            <el-select
              v-model="formData.secCode"
              placeholder="请选择工段"
              class="!w-1/1"
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准节拍" prop="takt">
            <el-input-number v-model="formData.takt" :min="0" :precision="2" class="!w-1/1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认资源" prop="resName">
            <el-select
              v-model="formData.resName"
              placeholder="请选择默认资源"
              clearable
              class="!w-1/1"
              :disabled="!formData.secCode"
            >
              <el-option
                v-for="item in resourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :value="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {
  createProcess,
  deleteProcess,
  getProcess,
  getProcessPage,
  updateProcess,
  ProcessVO
} from '@/api/lab/process'
import {
  LabSectionEnum,
  getResourceListBySection,
  ResourceVO
} from '@/api/lab/resource'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'LabBasedataProcess' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProcessVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  procCode: undefined,
  procName: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getProcessPage(queryParams)
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
const resourceOptions = ref<ResourceVO[]>([]) // 默认资源下拉的可选资源（按工段加载）
const formData = ref({
  id: undefined,
  secCode: undefined,
  procCode: undefined,
  procName: undefined,
  takt: undefined,
  resName: undefined,
  status: CommonStatusEnum.ENABLE
})
const formRules = reactive({
  secCode: [{ required: true, message: '请选择工段', trigger: 'blur' }],
  procCode: [{ required: true, message: '工序编号不能为空', trigger: 'blur' }],
  procName: [{ required: true, message: '工序描述不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/**
 * 工段变更：通过工段 Code 调后端资源接口，加载对应工段的默认资源下拉
 * @param preserveResName 是否保留已选择的默认资源（编辑回显时使用）
 */
const handleSectionChange = async (preserveResName = false) => {
  resourceOptions.value = []
  if (!preserveResName) {
    formData.value.resName = undefined
  }
  if (formData.value.secCode) {
    resourceOptions.value = await getResourceListBySection(formData.value.secCode)
  }
}

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增工序' : '修改工序'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await getProcess(id)
      // 编辑时加载对应工段的资源，并保留原默认资源用于回显
      await handleSectionChange(true)
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
    const data = formData.value as unknown as ProcessVO
    if (formType.value === 'create') {
      await createProcess(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateProcess(data)
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
    secCode: undefined,
    procCode: undefined,
    procName: undefined,
    takt: undefined,
    resName: undefined,
    status: CommonStatusEnum.ENABLE
  }
  resourceOptions.value = []
  formRef.value?.resetFields()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await deleteProcess(id)
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