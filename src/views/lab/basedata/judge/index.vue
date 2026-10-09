<!-- 基础数据-检测判定维护（供应商同步，仅查看） -->
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
      <el-form-item label="检测类型" prop="projectType">
        <el-select v-model="queryParams.projectType" placeholder="请选择检测类型" clearable class="!w-200px">
          <el-option
            v-for="item in LabProjectTypeEnum"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标准名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入标准名称"
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
      <el-table-column label="标准名称" align="center" prop="name" min-width="200" />
      <el-table-column label="所属段" align="center" width="100">
        <template #default="scope">
          {{ formatSyncSegment(scope.row.segmentCode) }}
        </template>
      </el-table-column>
      <el-table-column label="检测类型" align="center" width="110">
        <template #default="scope">
          {{ getLabProjectTypeLabel(scope.row.projectType) }}
        </template>
      </el-table-column>
      <el-table-column label="结果值" align="center" min-width="160">
        <template #default="scope">
          {{ getResultCodeLabel(scope.row.resultCode) }}
        </template>
      </el-table-column>
      <el-table-column label="判定准则" align="center" width="120">
        <template #default="scope">
          {{ getLabJudgeModeLabel(scope.row.mode) }}
        </template>
      </el-table-column>
      <el-table-column label="结果单位" align="center" prop="unit" width="110" />
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
    <!-- 基本信息 -->
    <div class="form-sec-title">基本信息</div>
    <el-form label-width="90px" class="detail-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="标准名称">
            <el-input :model-value="detailData.name" disabled placeholder="请输入项目名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测类型">
            <el-select :model-value="detailData.projectType" disabled class="!w-100%">
              <el-option
                :value="detailData.projectType"
                :label="getLabProjectTypeLabel(detailData.projectType)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 合格判定 -->
    <div class="form-sec-title">合格判定</div>
    <el-form label-width="90px" class="detail-form">
      <el-form-item label="结果值选择">
        <el-select :model-value="detailData.resultCode" disabled class="!w-100%">
          <el-option
            :value="detailData.resultCode"
            :label="getResultCodeLabel(detailData.resultCode)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="判定准则">
        <el-radio-group :model-value="detailData.mode" disabled>
          <el-radio :value="1">具体值</el-radio>
          <el-radio :value="2">上下浮动区间</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 上下浮动区间：标准值 + 说明 -->
      <template v-if="detailData.mode === 2">
        <el-form-item label="标准值">
          <el-input-number
            :model-value="detailData.standardValue"
            disabled
            :controls="false"
            class="!w-200px"
          />
          <span class="judge-unit">{{ detailData.unit || '' }}</span>
        </el-form-item>
        <div class="judge-tip">偏差率 =（检测结果 - 标准值）/ 标准值 × 100%。任务引用此判定标准时自动使用该标准值。</div>
      </template>
    </el-form>

    <!-- 判定区间 -->
    <div class="form-sec-title">判定区间</div>
    <el-table :data="intervals" border size="small" class="judge-table">
      <el-table-column label="判定" align="center" width="140">
        <template #default="{ row }">
          <el-select :model-value="row.result" disabled class="!w-120px">
            <el-option :value="row.result" :label="getResultLabel(row.result)" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="数值区间" min-width="360">
        <template #default="{ row }">
          <!-- 具体值：左运算符 + 左值 至 右运算符 + 右值（严格按原型控件组合） -->
          <template v-if="detailData.mode === 1">
            <div class="judge-range">
              <el-select :model-value="row.lowerInclusive ? '≥' : '>'" disabled class="op-select">
                <el-option :value="row.lowerInclusive ? '≥' : '>'" :label="row.lowerInclusive ? '≥' : '>'" />
              </el-select>
              <el-input-number :model-value="row.lower" disabled :controls="false" class="val-input" />
              <span class="judge-expr">至</span>
              <el-select :model-value="row.upperInclusive ? '≤' : '<'" disabled class="op-select">
                <el-option :value="row.upperInclusive ? '≤' : '<'" :label="row.upperInclusive ? '≤' : '<'" />
              </el-select>
              <el-input-number :model-value="row.upper" disabled :controls="false" class="val-input" />
            </div>
          </template>
          <!-- 上下浮动区间：方向 + 百分比 -->
          <template v-else>
            <div class="judge-range">
              <el-select :model-value="row.direction" disabled class="dir-select">
                <el-option :value="row.direction" :label="directionLabel(row.direction)" />
              </el-select>
              <el-input-number :model-value="row.percent" disabled :controls="false" class="val-input" />
              <span class="judge-unit">%</span>
            </div>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="judge-tip" style="margin-top: 8px">
      单项仅判定合格、不合格或预警，最终处置由综合规则决定，未覆盖的数值待判定。
    </div>

    <!-- 结果单位（具体值模式） -->
    <template v-if="detailData.mode === 1">
      <div class="form-sec-title">结果单位</div>
      <el-form label-width="90px" class="detail-form">
        <el-form-item label="结果单位">
          <el-select :model-value="detailData.unit" disabled class="!w-200px">
            <el-option :value="detailData.unit" :label="detailData.unit" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

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
  getSyncJudge,
  getSyncJudgePage,
  SyncJudgeVO,
  LabProjectTypeEnum,
  getLabProjectTypeLabel,
  getLabJudgeModeLabel,
  formatSyncSegment
} from '@/api/lab/sync'
import { LabSectionEnum } from '@/api/lab/resource'

defineOptions({ name: 'LabBasedataJudge' })

const loading = ref(true) // 列表的加载中
const list = ref<SyncJudgeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  segmentCode: undefined,
  projectType: undefined,
  name: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getSyncJudgePage(queryParams)
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

// ==================== 查看详情 ====================
const detailVisible = ref(false) // 弹窗的是否展示
const detailTitle = ref('') // 弹窗的标题
const detailData = ref<SyncJudgeVO>({} as SyncJudgeVO) // 详情数据

/** 打开详情弹窗 */
const openDetail = async (id: number) => {
  detailVisible.value = true
  const data = await getSyncJudge(id)
  detailData.value = data
  detailTitle.value = '检测判定 · ' + data.name
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

/** 判定区间列表（解析自 standardJson） */
const intervals = computed(() => {
  const standard = parseJson(detailData.value.standardJson)
  const list = standard.intervals
  return Array.isArray(list) ? list : []
})

/** 结果值选择标签（常见结果码映射，未知原样展示） */
const getResultCodeLabel = (code?: string) => {
  if (!code) {
    return '—'
  }
  const map: Record<string, string> = {
    DryContent: '固含量（干物质含量）',
    FinenessMethodA: '细度（刮板法A）',
    FinenessMethodB: '细度（刮板法B）',
    Eta: 'Eta（黏度/表观黏度）',
    Temperature: '温度',
    IonicConductivity: '离子电导率'
  }
  return map[code] ?? code
}

/** 判定结论标签：1-合格、2-预警、3-不合格 */
const getResultLabel = (result?: number) => {
  return ({ 1: '合格', 2: '预警', 3: '不合格' } as Record<number, string>)[result ?? -1] ?? '—'
}

/** 上下浮动区间方向：1-高于、2-低于、3-全部(±) */
const directionLabel = (direction?: number) => {
  return ({ 1: '高于', 2: '低于', 3: '±' } as Record<number, string>)[direction ?? -1] ?? '—'
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
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
/* 判定区间表格（深色主题适配） */
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
.judge-expr {
  color: var(--accent-cyan);
  font-weight: 600;
  font-size: 13px;
  margin: 0 4px;
}
.judge-val {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 13px;
}
.judge-unit {
  color: var(--text-secondary);
  font-size: 13px;
  margin-left: 4px;
}
/* 数值区间控件组合 */
.judge-range {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.op-select {
  width: 62px;
}
.dir-select {
  width: 96px;
}
.val-input {
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
