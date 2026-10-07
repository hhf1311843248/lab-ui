<!-- 实验策划-配方 -->
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
      <el-form-item label="配方编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入配方编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="工段" prop="section">
        <el-input
          v-model="queryParams.section"
          placeholder="请输入工段"
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
          v-hasPermi="['lab:formula:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="配方编号" align="center" prop="code" min-width="140">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">
            {{ scope.row.code }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="工段" align="center" prop="section" min-width="120" />
      <el-table-column label="版本" align="center" prop="version" min-width="80" />
      <el-table-column label="当前版本" align="center" prop="current" min-width="90" />
      <el-table-column label="研发分类" align="center" prop="rdClass" min-width="110" />
      <el-table-column label="正负极" align="center" prop="pole" min-width="80" />
      <el-table-column label="优先级" align="center" prop="prio" min-width="80" />
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
            v-hasPermi="['lab:formula:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['lab:formula:delete']"
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
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="900px" append-to-body>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-tabs v-model="activeTab">
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="base">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="配方编号" prop="code">
                <el-input v-model="formData.code" placeholder="请输入配方编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工段" prop="section">
                <el-input v-model="formData.section" placeholder="请输入工段" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版本" prop="version">
                <el-input v-model="formData.version" placeholder="请输入版本" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前版本" prop="current">
                <el-input v-model="formData.current" placeholder="是/否" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体系编号" prop="sysCode">
                <el-input v-model="formData.sysCode" placeholder="请输入体系编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="研发分类" prop="rdClass">
                <el-input v-model="formData.rdClass" placeholder="请输入研发分类" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="正负极" prop="pole">
                <el-input v-model="formData.pole" placeholder="请输入正负极" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代次" prop="gen">
                <el-input v-model="formData.gen" placeholder="请输入代次" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标称比容量" prop="cap">
                <el-input v-model="formData.cap" placeholder="请输入标称比容量(mAh/g)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="材料化学式" prop="formula">
                <el-input v-model="formData.formula" placeholder="请输入材料化学式" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工艺路线" prop="route">
                <el-input v-model="formData.route" placeholder="请输入工艺路线" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="优先级" prop="prio">
                <el-input v-model="formData.prio" placeholder="请输入优先级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验证背景一级" prop="bg1">
                <el-input v-model="formData.bg1" placeholder="请输入验证背景一级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验证背景二级" prop="bg2">
                <el-input v-model="formData.bg2" placeholder="请输入验证背景二级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="攻坚点一级" prop="atk1">
                <el-input v-model="formData.atk1" placeholder="请输入攻坚点一级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="攻坚点二级" prop="atk2">
                <el-input v-model="formData.atk2" placeholder="请输入攻坚点二级" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="变量因子" prop="factor">
                <el-input v-model="formData.factor" placeholder="请输入变量因子" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验证目的" prop="purpose">
                <el-input v-model="formData.purpose" placeholder="请输入验证目的" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="formData.status" placeholder="请选择状态" class="!w-100%">
                  <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <!-- 投料信息 -->
        <el-tab-pane label="投料信息" name="feed">
          <el-table :data="formData.feedList" border>
            <el-table-column label="明细序号" type="index" align="center" width="60" />
            <el-table-column label="投料工序" prop="feedProc" min-width="110">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.feedProc" placeholder="投料工序" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="序号" prop="seq" min-width="80">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.seq" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投料顺序" prop="feedSeq" min-width="90">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.feedSeq" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="物料编号" prop="materialCode" min-width="120">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.materialCode" placeholder="物料编号" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="一级分类" prop="cat1" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.cat1" placeholder="一级分类" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="二级分类" prop="cat2" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.cat2" placeholder="二级分类" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="投料量" prop="quantity" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.quantity" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="unit" min-width="80">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.unit" placeholder="单位" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="称量偏差%" prop="deviation" min-width="100">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input-number v-model="row.deviation" :min="0" controls-position="right" class="!w-100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="60">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleDeleteFeed($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" plain class="mt-2" @click="handleAddFeed">
            <Icon icon="ep:plus" class="mr-5px" /> 新增投料
          </el-button>
        </el-tab-pane>

        <!-- 实验方案 -->
        <el-tab-pane label="实验方案" name="scheme">
          <el-table :data="formData.schemeList" border>
            <el-table-column label="明细序号" type="index" align="center" width="60" />
            <el-table-column label="工序名称" prop="procName" min-width="160">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`schemeList.${$index}.procName`"
                  :rules="formRules.procName"
                  class="mb-0px!"
                >
                  <el-input v-model="row.procName" placeholder="请输入工序名称" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="参数名" prop="paramKey" min-width="160">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`schemeList.${$index}.paramKey`"
                  :rules="formRules.paramKey"
                  class="mb-0px!"
                >
                  <el-input v-model="row.paramKey" placeholder="请输入参数名" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="参数值" prop="paramValue" min-width="160">
              <template #default="{ row }">
                <el-form-item class="mb-0px!">
                  <el-input v-model="row.paramValue" placeholder="请输入参数值" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="60">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleDeleteScheme($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" plain class="mt-2" @click="handleAddScheme">
            <Icon icon="ep:plus" class="mr-5px" /> 新增方案
          </el-button>
        </el-tab-pane>
      </el-tabs>
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
  createFormula,
  deleteFormula,
  FormulaFeedVO,
  FormulaSchemeVO,
  FormulaVO,
  getFormula,
  getFormulaPage,
  updateFormula
} from '@/api/lab/formula'

defineOptions({ name: 'LabPlanFormula' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FormulaVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  section: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

// 状态选项
const statusOptions = ['新建', '评审中', '已下达', '取消']

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getFormulaPage(queryParams)
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
    await deleteFormula(id)
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
const activeTab = ref('base') // 当前激活的 Tab
const formData = ref({
  id: undefined,
  section: '',
  code: '',
  version: '',
  current: '',
  sysCode: '',
  rdClass: '',
  pole: '',
  gen: '',
  cap: '',
  formula: '',
  route: '',
  prio: '',
  bg1: '',
  bg2: '',
  atk1: '',
  atk2: '',
  factor: '',
  purpose: '',
  status: '',
  feedList: [] as FormulaFeedVO[],
  schemeList: [] as FormulaSchemeVO[]
})
const formRules = reactive({
  code: [{ required: true, message: '配方编号不能为空', trigger: 'blur' }],
  procName: [{ required: true, message: '工序名称不能为空', trigger: 'blur' }],
  paramKey: [{ required: true, message: '参数名不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增配方' : '编辑配方'
  formType.value = type
  activeTab.value = 'base'
  resetForm()
  // 修改时，加载数据
  if (id) {
    formLoading.value = true
    try {
      const data = await getFormula(id)
      formData.value = data
      if (!formData.value.feedList) {
        formData.value.feedList = []
      }
      if (!formData.value.schemeList) {
        formData.value.schemeList = []
      }
    } finally {
      formLoading.value = false
    }
  }
}

/** 新增投料 */
const handleAddFeed = () => {
  formData.value.feedList.push({
    seq: undefined,
    feedSeq: undefined,
    feedProc: '',
    materialCode: '',
    cat1: '',
    cat2: '',
    quantity: undefined,
    unit: '',
    deviation: undefined
  })
}

/** 删除投料 */
const handleDeleteFeed = (index: number) => {
  formData.value.feedList.splice(index, 1)
}

/** 新增方案 */
const handleAddScheme = () => {
  formData.value.schemeList.push({ procName: '', paramKey: '', paramValue: '' })
}

/** 删除方案 */
const handleDeleteScheme = (index: number) => {
  formData.value.schemeList.splice(index, 1)
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = { ...formData.value }
    if (formType.value === 'create') {
      await createFormula(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateFormula(data)
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
    section: '',
    code: '',
    version: '',
    current: '',
    sysCode: '',
    rdClass: '',
    pole: '',
    gen: '',
    cap: '',
    formula: '',
    route: '',
    prio: '',
    bg1: '',
    bg2: '',
    atk1: '',
    atk2: '',
    factor: '',
    purpose: '',
    status: '',
    feedList: [],
    schemeList: []
  }
  formRef.value?.resetFields()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>