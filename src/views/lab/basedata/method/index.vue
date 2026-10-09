<!-- 基础数据-检测方法维护（供应商同步，仅查看） -->
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
      <el-form-item label="方案名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入方案名称"
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
      <el-table-column label="检测类型" align="center" width="110">
        <template #default="scope">
          {{ getLabProjectTypeLabel(scope.row.projectType) }}
        </template>
      </el-table-column>
      <el-table-column label="方案名称" align="center" prop="projectName" min-width="200" />
      <el-table-column label="所属段" align="center" width="100">
        <template #default="scope">
          {{ formatSyncSegment(scope.row.segmentCode) }}
        </template>
      </el-table-column>
      <el-table-column label="取样量" align="center" width="90">
        <template #default="scope">
          {{ scope.row.sampleAmount ? scope.row.sampleAmount + ' ' + (scope.row.sampleUnit || '') : '—' }}
        </template>
      </el-table-column>
      <el-table-column label="是否指定方法" align="center" width="110">
        <template #default="scope">
          {{ scope.row.requiresMethod ? '是' : '否' }}
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
    <!-- 基本信息 -->
    <div class="form-sec-title">基本信息</div>
    <el-form label-width="90px" class="detail-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="方案名称">
            <el-input :model-value="detailData.projectName" disabled placeholder="请输入项目名称" />
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

    <!-- 检测配置 -->
    <div class="form-sec-title">检测配置</div>
    <div class="param-card">
      <div v-if="detailData.projectType !== 6" class="param-title">P 检测参数</div>
      <!-- 水分检测：温度测试设置（严格按原型布局，禁用展示） -->
      <template v-if="detailData.projectType === 1">
        <div class="param-sub-title">温度测试设置</div>
        <div v-for="(point, index) in temperaturePoints" :key="index" class="temp-row">
          <span class="temp-tag">T{{ index + 1 }}</span>
          <div class="temp-field">
            <span class="temp-label">目标温度</span>
            <el-input-number
              :model-value="point.targetTemperature"
              disabled
              :controls="false"
              class="temp-input"
            />
            <span class="temp-unit">℃</span>
          </div>
          <div class="temp-field">
            <span class="temp-label">允许偏差</span>
            <el-input-number
              :model-value="point.tolerance"
              disabled
              :controls="false"
              class="temp-input"
            />
            <span class="temp-unit">± ℃</span>
          </div>
        </div>
        <div class="param-tip">用于核查加热模块，不参与固含量（干物质含量）判定</div>
      </template>
      <!-- 细度分析：刮涂参数 / 颗粒相关参数（严格按原型布局，禁用展示） -->
      <template v-else-if="detailData.projectType === 2">
        <div class="param-sub-title">刮涂参数</div>
        <div class="param-field">
          <span class="field-label">刮涂速度</span>
          <el-input-number
            :model-value="configObject.scrapingSpeed"
            disabled
            :controls="false"
            class="field-input"
          />
          <span class="field-unit">mm/s</span>
        </div>
        <div class="param-field">
          <span class="field-label">刮涂后停留时间</span>
          <el-input-number
            :model-value="configObject.readingDelay"
            disabled
            :controls="false"
            class="field-input"
          />
          <span class="field-unit">s</span>
        </div>
        <div class="param-sub-title">颗粒相关参数</div>
        <div class="param-field">
          <span class="field-label">颗粒最小面积</span>
          <el-input-number
            :model-value="configObject.minParticleArea"
            disabled
            :controls="false"
            class="field-input"
          />
          <span class="field-unit">mm²</span>
        </div>
      </template>
      <!-- 脱泡检测：程序段表格（严格按原型布局，禁用展示） -->
      <template v-else-if="detailData.projectType === 4">
        <div class="param-sub-title">程序段按顺序执行，可重复添加脱泡、静置和测温程序。</div>
        <el-table :data="programStages" border size="small" class="stage-table">
          <el-table-column label="#" align="center" width="56">
            <template #default="{ row, $index }">
              {{ row.sortOrder ?? $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="程序段类型" align="center" width="130">
            <template #default="{ row }">
              <el-select :model-value="row.type" disabled class="!w-110px">
                <el-option :value="row.type" :label="getProgramStageTypeLabel(row.type)" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="程序参数" min-width="320">
            <template #default="{ row }">
              <div class="stage-params">
                <!-- 脱泡程序 -->
                <template v-if="row.type === 1">
                  <span class="stage-param-item">
                    <span class="stage-key">方法名称</span>
                    <el-input :model-value="row.methodName" disabled placeholder="方法名称" class="stage-input" />
                  </span>
                </template>
                <!-- 静置程序 -->
                <template v-if="row.type === 2">
                  <span class="stage-param-item">
                    <span class="stage-key">静置时间</span>
                    <el-input-number
                      :model-value="row.restDurationMinutes"
                      disabled
                      :controls="false"
                      class="stage-input"
                    />
                    <span class="stage-unit">分钟</span>
                  </span>
                </template>
                <!-- 测温程序 -->
                <template v-if="row.type === 3">
                  <span class="stage-param-item">
                    <span class="stage-key">标准名称</span>
                    <el-input
                      :model-value="row.judgmentStandardId"
                      disabled
                      placeholder="标准名称"
                      class="stage-input"
                    />
                  </span>
                  <span class="stage-param-item">
                    <span class="stage-key">不合格后静置</span>
                    <el-input-number
                      :model-value="row.restDurationMinutes"
                      disabled
                      :controls="false"
                      class="stage-input"
                    />
                    <span class="stage-unit">分钟</span>
                  </span>
                  <span class="stage-param-item">
                    <span class="stage-key">最大循环次数</span>
                    <el-input-number
                      :model-value="row.maxRestCycles"
                      disabled
                      :controls="false"
                      class="stage-input"
                    />
                    <span class="stage-unit">次</span>
                  </span>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 流变测试：方法名称（只读展示，自动换行显示全名） -->
      <template v-else-if="detailData.projectType === 3">
        <div class="param-field">
          <span class="field-label">方法名称</span>
          <span class="method-name-text" :title="configObject.methodName">{{ configObject.methodName || '—' }}</span>
        </div>
      </template>
      <!-- XRD检测：扫描角度 / 扫描步长 / 每步计数时间（严格按原型布局，禁用展示） -->
      <template v-else-if="detailData.projectType === 5">
        <div class="param-field">
          <span class="field-label">扫描角度</span>
          <el-input-number
            :model-value="configObject.scanStartAngle"
            disabled
            :controls="false"
            class="xrd-input"
          />
          <span class="xrd-sep">至</span>
          <el-input-number
            :model-value="configObject.scanEndAngle"
            disabled
            :controls="false"
            class="xrd-input"
          />
          <span class="field-unit">°2θ</span>
        </div>
        <div class="param-field">
          <span class="field-label">扫描步长</span>
          <el-input-number
            :model-value="configObject.scanStepSize"
            disabled
            :controls="false"
            class="field-input"
          />
          <span class="field-unit">°2θ</span>
        </div>
        <div class="param-field">
          <span class="field-label">每步计数时间</span>
          <el-input-number
            :model-value="configObject.timePerStep"
            disabled
            :controls="false"
            class="field-input"
          />
          <span class="field-unit">s</span>
        </div>
        <div class="param-tip">常规物相分析可参考 0.02° 步长；计数时间越长，通常信噪比越高。扫描速度和预计耗时以设备软件返回为准，不进行本地换算。</div>
      </template>
      <!-- 离子电导率：检测方法 / 检测参数（严格按原型布局，禁用展示） -->
      <template v-else-if="detailData.projectType === 6">
        <div class="mp-card">
          <div class="mp-title"><span class="mp-badge">M</span>检测方法</div>
          <div class="param-field">
            <span class="field-label wide">检测方法（离子电导率）</span>
            <span class="method-name-text" :title="configObject.methodName">{{ configObject.methodName || '—' }}</span>
          </div>
        </div>
        <div class="mp-card">
          <div class="mp-title"><span class="mp-badge">P</span>检测参数</div>
          <div class="param-field">
            <span class="field-label">检测温度</span>
            <el-input-number
              :model-value="configObject.temperature"
              disabled
              :controls="false"
              class="field-input"
            />
            <span class="field-unit">℃</span>
          </div>
          <div class="param-field">
            <span class="field-label">压力调节</span>
            <el-input-number
              :model-value="configObject.pressure"
              disabled
              :controls="false"
              class="field-input"
            />
            <span class="field-unit">T</span>
          </div>
          <div class="param-field">
            <span class="field-label">保压时间</span>
            <el-input-number
              :model-value="configObject.holdingTime"
              disabled
              :controls="false"
              class="field-input"
            />
            <span class="field-unit">s</span>
          </div>
        </div>
      </template>
      <!-- 其它检测类型：通用配置展示 -->
      <div v-else class="param-json">
        <JsonView :value="configObject" context="method" />
      </div>
    </div>

    <!-- 其他信息 -->
    <div class="form-sec-title">其他信息</div>
    <el-form label-width="90px" class="detail-form">
      <el-form-item label="备注">
        <el-input
          :model-value="detailData.remark"
          type="textarea"
          :rows="3"
          disabled
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getSyncMethod,
  getSyncMethodPage,
  SyncMethodVO,
  LabProjectTypeEnum,
  getLabProjectTypeLabel,
  formatSyncSegment
} from '@/api/lab/sync'
import { LabSectionEnum } from '@/api/lab/resource'
import JsonView from '@/views/lab/basedata/sync/components/JsonView.vue'

defineOptions({ name: 'LabBasedataMethod' })

const loading = ref(true) // 列表的加载中
const list = ref<SyncMethodVO[]>([]) // 列表的数据
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
    const data = await getSyncMethodPage(queryParams)
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
const detailData = ref<SyncMethodVO>({} as SyncMethodVO) // 详情数据

/** 打开详情弹窗 */
const openDetail = async (id: number) => {
  detailVisible.value = true
  const data = await getSyncMethod(id)
  detailData.value = data
  detailTitle.value = '检测方法 · ' + data.projectName
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

/** 检测配置对象（已解析） */
const configObject = computed(() => parseJson(detailData.value.configJson))

/** 水分检测：温度测试点列表 */
const temperaturePoints = computed(() => {
  if (detailData.value.projectType !== 1) {
    return []
  }
  return configObject.value.temperatureTestPoints || []
})

/** 脱泡检测：程序段类型标签（1-脱泡程序、2-静置程序、3-测温程序） */
const getProgramStageTypeLabel = (type?: number) => {
  return ({ 1: '脱泡程序', 2: '静置程序', 3: '测温程序' } as Record<number, string>)[type ?? -1] ?? '—'
}

/** 脱泡检测：程序段列表（type 匹配已知类型 1/2/3 才展示，按执行顺序排序） */
const programStages = computed(() => {
  if (detailData.value.projectType !== 4) {
    return []
  }
  const stages = configObject.value.programStages
  if (!Array.isArray(stages)) {
    return []
  }
  return stages
    .filter((s) => s && [1, 2, 3].includes(s.type)) // 程序段类型字段匹配才展示，否则不展示
    .map((s) => ({ ...s }))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
})

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
/* 检测参数卡片：半透明深色底 + 青色描边，非白色 */
.param-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
}
.param-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
  margin-bottom: 10px;
}
.param-sub-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.temp-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 6px 0;
}
.temp-tag {
  flex: 0 0 44px;
  font-weight: 600;
  color: var(--accent-cyan);
}
.temp-field {
  display: flex;
  align-items: center;
  gap: 8px;
}
.temp-label {
  color: var(--text-secondary);
  font-size: 13px;
}
.temp-input {
  width: 120px;
}
.temp-unit {
  color: var(--text-secondary);
  font-size: 13px;
}
.param-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}
.field-label {
  flex: 0 0 110px;
  color: var(--text-secondary);
  font-size: 13px;
}
.field-label.wide {
  flex-basis: 150px;
}
.field-input {
  width: 130px;
}
.field-unit {
  color: var(--text-secondary);
  font-size: 13px;
}
/* 方法名称：供应商推送值只读展示，自动换行保证全名可见 */
.method-name-text {
  flex: 1;
  min-width: 200px;
  padding: 5px 10px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  word-break: break-all;
  white-space: normal;
}
/* 离子电导率：M/P 子模块卡片 */
.mp-card {
  background: rgba(0, 240, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 10px;
}
.mp-title {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.mp-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 4px;
  background: rgba(0, 240, 255, 0.15);
  color: var(--accent-cyan);
  font-weight: 700;
  font-size: 12px;
}
/* XRD检测：扫描角度区间 */
.xrd-input {
  width: 100px;
}
.xrd-sep {
  color: var(--text-secondary);
  font-size: 13px;
}
/* 脱泡检测：程序段表格（深色主题适配） */
.stage-table {
  --el-table-border-color: var(--border-color);
  --el-table-header-bg-color: rgba(0, 240, 255, 0.06);
  --el-table-header-text-color: var(--text-primary);
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(0, 240, 255, 0.06);
  --el-table-text-color: var(--text-primary);
  background-color: transparent;
}
.stage-params {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
}
.stage-param-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.stage-key {
  color: var(--text-secondary);
  font-size: 13px;
}
.stage-input {
  width: 120px;
}
.stage-unit {
  color: var(--text-secondary);
  font-size: 13px;
}
.param-tip {
  margin-top: 10px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}
.param-json {
  max-height: 260px;
  overflow-y: auto;
}
</style>
