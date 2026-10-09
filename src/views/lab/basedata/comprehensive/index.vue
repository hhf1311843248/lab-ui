<!-- 基础数据-综合判定维护（供应商同步，仅查看） -->
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
      <el-form-item label="所属段" prop="segmentCode">
        <el-select v-model="queryParams.segmentCode" placeholder="请选择所属段" clearable class="!w-200px">
          <el-option
            v-for="item in LabSectionEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="判定方式" prop="mode">
        <el-select v-model="queryParams.mode" placeholder="请选择判定方式" clearable class="!w-200px">
          <el-option
            v-for="item in LabComprehensiveModeEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="规则名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入规则名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="供应商数据ID" align="center" prop="dataId" width="110" />
      <el-table-column label="规则名称" align="center" prop="name" min-width="200" />
      <el-table-column label="所属段" align="center" width="100">
        <template #default="scope">
          {{ formatSyncSegment(scope.row.segmentCode) }}
        </template>
      </el-table-column>
      <el-table-column label="判定方式" align="center" width="120">
        <template #default="scope">
          {{ getLabComprehensiveModeLabel(scope.row.mode) }}
        </template>
      </el-table-column>
      <el-table-column label="参与检测项目" align="center" min-width="200">
        <template #default="scope">
          {{ formatProjectTypes(scope.row.projectTypes) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="dataUpdateTime" width="180" />
      <el-table-column label="操作" align="center" width="90" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openDetail(scope.row.id)">查看</el-button>
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

  <!-- 查看详情弹窗（供应商定义，仅展示：输入框禁用，无编辑按钮） -->
  <el-dialog v-model="detailVisible" :title="detailTitle" width="760px" append-to-body>
    <!-- 判定与处置 -->
    <div class="judge-banner">
      <div class="banner-title">判定与处置</div>
      <div class="banner-desc">{{ modeBannerText }}</div>
    </div>

    <!-- 基本信息 -->
    <div class="form-sec-title">基本信息</div>
    <el-form label-width="90px" class="detail-form">
      <el-form-item label="规则名称">
        <el-input :model-value="detailData.name" disabled placeholder="请输入规则名称" />
      </el-form-item>
      <el-form-item label="参与检测项目">
        <el-checkbox-group :model-value="projectTypeList" disabled>
          <el-checkbox v-for="pt in projectTypeList" :key="pt" :value="pt">
            {{ getLabProjectTypeLabel(pt) }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="判定方式">
        <el-radio-group :model-value="detailData.mode" disabled>
          <el-radio :value="1">按判定项数</el-radio>
          <el-radio :value="2">按项目组合</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 按判定项数：项数处置规则 -->
    <template v-if="detailData.mode === 1">
      <div class="form-sec-title">项数处置规则</div>
      <el-table :data="countRules" border size="small" class="judge-table">
        <el-table-column label="#" type="index" align="center" width="56" />
        <el-table-column label="不合格项数" align="center" min-width="130">
          <template #default="{ row }">
            <el-input-number :model-value="row.failCount" disabled :controls="false" class="rule-input" />
          </template>
        </el-table-column>
        <el-table-column label="预警项数" align="center" min-width="130">
          <template #default="{ row }">
            <el-input-number :model-value="row.warningCount" disabled :controls="false" class="rule-input" />
          </template>
        </el-table-column>
        <el-table-column label="处理方式" align="center" width="150">
          <template #default="{ row }">
            <el-select :model-value="row.disposition" disabled class="!w-130px">
              <el-option :value="row.disposition" :label="getDispositionLabel(row.disposition)" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div class="judge-tip" style="margin-top: 8px">
        按不合格项数和预警项数精确匹配，其余项目为合格。不自动合并两种判定，未匹配时待处置。
      </div>
    </template>

    <!-- 按项目组合：主检测项目 + 组合规则 -->
    <template v-else>
      <el-form label-width="90px" class="detail-form">
        <el-form-item label="主检测项目">
          <el-select :model-value="detailData.mainProjectType" disabled class="!w-200px">
            <el-option
              :value="detailData.mainProjectType"
              :label="getLabProjectTypeLabel(detailData.mainProjectType) || '—'"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="form-sec-title">组合规则</div>
      <el-table :data="combinations" border size="small" class="judge-table">
        <el-table-column label="#" type="index" align="center" width="56" />
        <el-table-column
          v-for="pt in projectTypeList"
          :key="pt"
          :label="getLabProjectTypeLabel(pt)"
          align="center"
          min-width="120"
        >
          <template #default="{ row }">
            <el-select :model-value="resultOf(row, pt)" disabled class="!w-110px">
              <el-option :value="resultOf(row, pt)" :label="getComResultLabel(resultOf(row, pt))" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="处置方式" align="center" width="150">
          <template #default="{ row }">
            <el-select :model-value="row.disposition" disabled class="!w-130px">
              <el-option :value="row.disposition" :label="getDispositionLabel(row.disposition)" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 状态 -->
    <div class="form-sec-title">状态</div>
    <el-form label-width="90px" class="detail-form">
      <el-form-item label="状态">
        <el-radio-group :model-value="detailData.status" disabled>
          <el-radio :value="1">启用</el-radio>
          <el-radio :value="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 其他信息 -->
    <div class="form-sec-title">其他信息</div>
    <el-form label-width="90px" class="detail-form">
      <el-form-item label="备注">
        <el-input :model-value="detailData.remark" type="textarea" :rows="3" disabled placeholder="请输入备注" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getSyncComprehensive,
  getSyncComprehensivePage,
  SyncComprehensiveVO,
  LabComprehensiveModeEnum,
  getLabComprehensiveModeLabel,
  getLabProjectTypeLabel,
  formatSyncSegment
} from '@/api/lab/sync'
import { LabSectionEnum } from '@/api/lab/resource'

defineOptions({ name: 'LabBasedataComprehensive' })

const loading = ref(true) // 列表的加载中
const list = ref<SyncComprehensiveVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  segmentCode: undefined,
  mode: undefined,
  name: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getSyncComprehensivePage(queryParams)
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

/** 参与检测项目（逗号分隔的编号转中文） */
const formatProjectTypes = (types?: string) => {
  if (!types) {
    return '—'
  }
  return types
    .split(',')
    .map((t) => getLabProjectTypeLabel(Number(t)))
    .filter(Boolean)
    .join('、')
}

// ==================== 查看详情 ====================
const detailVisible = ref(false) // 弹窗的是否展示
const detailTitle = ref('') // 弹窗的标题
const detailData = ref<SyncComprehensiveVO>({} as SyncComprehensiveVO) // 详情数据

/** 打开详情弹窗 */
const openDetail = async (id: number) => {
  detailVisible.value = true
  const data = await getSyncComprehensive(id)
  detailData.value = data
  detailTitle.value = '综合判定 · ' + data.name
}

/** 解析 JSON 字符串 */
const parseJson = (json?: string) => {
  if (!json) {
    return {}
  }
  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}

/** 综合判定完整配置（已解析） */
const comprehensiveObject = computed(() => parseJson(detailData.value.comprehensiveJson))

/** 判定与处置说明（按判定方式） */
const modeBannerText = computed(() => {
  if (detailData.value.mode === 2) {
    return '检测全部完成后，先匹配组合规则；未命中时按主检测项处置。单项判定保留，返工暂不可用。'
  }
  return '单项判定与最终处置独立。检测全部完成后匹配规则；缺项或未匹配规则时待处置。正常通过不改变单项判定。'
})

/** 参与检测项目（数字列表） */
const projectTypeList = computed(() => {
  const s = detailData.value.projectTypes
  if (!s) {
    return []
  }
  return s
    .split(',')
    .map((n) => Number(n))
    .filter((n) => !Number.isNaN(n))
})

/** 按判定项数：项数处置规则 */
const countRules = computed(() =>
  Array.isArray(comprehensiveObject.value.countRules) ? comprehensiveObject.value.countRules : []
)

/** 按项目组合：组合规则 */
const combinations = computed(() =>
  Array.isArray(comprehensiveObject.value.combinations) ? comprehensiveObject.value.combinations : []
)

/** 组合规则中指定项目的判定结论 */
const resultOf = (combo: any, projectType: number) => {
  const r = (combo.results || []).find((item) => item.projectType === projectType)
  return r ? r.result : null
}

/** 处置方式标签：1-正常通过、2-不合格拦截 */
const getDispositionLabel = (disposition?: number) => {
  return ({ 1: '正常通过', 2: '不合格拦截' } as Record<number, string>)[disposition ?? -1] ?? '—'
}

/** 项目结论标签：1-合格、2-预警、3-不合格 */
const getComResultLabel = (result?: number) => {
  return ({ 1: '合格', 2: '预警', 3: '不合格' } as Record<number, string>)[result ?? -1] ?? '—'
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
/* 判定与处置信息条 */
.judge-banner {
  padding: 10px 14px;
  margin-bottom: 14px;
  background: rgba(0, 240, 255, 0.06);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
.banner-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-cyan);
  margin-bottom: 4px;
}
.banner-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}
/* 分段标题：青色强调竖线 + 亮色字体，与深色赛博主题一致 */
.form-sec-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 4px 0 12px;
  padding-left: 10px;
  border-left: 3px solid var(--accent-cyan);
}
.form-sec-title:first-child {
  margin-top: 0;
}
.detail-form .el-form-item {
  margin-bottom: 12px;
}
/* 参与检测项目：单行展示，不换行 */
.detail-form :deep(.el-checkbox-group) {
  flex-wrap: nowrap;
  white-space: nowrap;
}
.detail-form :deep(.el-checkbox) {
  margin-right: 14px;
  white-space: nowrap;
}
.detail-form :deep(.el-checkbox__label) {
  white-space: nowrap;
}
/* 规则表格（深色主题适配） */
.judge-table {
  --el-table-border-color: var(--border-color);
  --el-table-header-bg-color: rgba(0, 240, 255, 0.06);
  --el-table-header-text-color: var(--text-primary);
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(0, 240, 255, 0.06);
  --el-table-text-color: var(--text-primary);
  background-color: transparent;
}
.rule-input {
  width: 110px;
}
.judge-tip {
  margin-top: 10px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}
</style>
