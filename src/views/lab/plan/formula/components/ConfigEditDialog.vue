<!--
  供应商检测配置-查看/编辑弹窗（可编辑版本）
  支持：检测方法（method，按 projectType 分支）、检测判定（judge，按 mode 分支）、综合判定（comprehensive，按 mode 分支）
  保存：暂存到浏览器缓存（configCache.ts），由配方页面统一入库
-->
<template>
  <el-drawer
    :model-value="modelValue"
    :title="dialogTitle"
    size="720px"
    append-to-body
    @update:model-value="handleVisibleChange"
    @open="handleOpen"
  >
    <div v-if="form" class="config-edit-body">
      <!-- ============ 检测方法 ============ -->
      <template v-if="type === 'method'">
        <div class="form-sec-title">基本信息</div>
        <el-form label-width="110px" class="detail-form">
          <el-form-item label="方案名称">
            <el-input :model-value="sourceName()" disabled placeholder="方案名称" />
          </el-form-item>
          <el-form-item label="检测类型">
            <el-input :model-value="getLabProjectTypeLabel(sourceProjectType())" disabled />
          </el-form-item>
        </el-form>

        <!-- 脱泡检测：程序段表格 -->
        <template v-if="sourceProjectType() === 4">
          <div class="form-sec-title">程序段按顺序执行，可重复添加脱泡、静置和测温程序。</div>
          <el-table :data="form.programStages || []" border size="small" class="edit-table">
            <el-table-column label="#" align="center" width="56">
              <template #default="{ row, $index }">{{ row.sortOrder ?? $index + 1 }}</template>
            </el-table-column>
            <el-table-column label="程序段类型" align="center" width="130">
              <template #default="{ row }">
                <el-select v-model="row.type" class="!w-110px">
                  <el-option v-for="(v, i) in [1, 2, 3]" :key="i" :value="v" :label="getProgramStageTypeLabel(v)" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="程序参数" min-width="320">
              <template #default="{ row }">
                <div class="stage-params">
                  <template v-if="row.type === 1">
                    <span class="stage-param-item">
                      <span class="stage-key">方法名称</span>
                      <el-input v-model="row.methodName" placeholder="方法名称" class="stage-input" />
                    </span>
                  </template>
                  <template v-if="row.type === 2">
                    <span class="stage-param-item">
                      <span class="stage-key">静置时间</span>
                      <el-input-number v-model="row.restDurationMinutes" :controls="false" :min="0" class="stage-input" />
                      <span class="stage-unit">分钟</span>
                    </span>
                  </template>
                  <template v-if="row.type === 3">
                    <span class="stage-param-item">
                      <span class="stage-key">标准名称</span>
                      <el-select v-model="row.judgmentStandardId" placeholder="请选择标准名称" class="stage-input" clearable>
                        <el-option v-for="j in defoamJudgeOptions" :key="j.id" :label="j.name" :value="j.name" />
                      </el-select>
                    </span>
                    <span class="stage-param-item">
                      <span class="stage-key">不合格后静置</span>
                      <el-input-number v-model="row.restDurationMinutes" :controls="false" :min="0" class="stage-input" />
                      <span class="stage-unit">分钟</span>
                    </span>
                    <span class="stage-param-item">
                      <span class="stage-key">最大循环次数</span>
                      <el-input-number v-model="row.maxRestCycles" :controls="false" :min="0" class="stage-input" />
                      <span class="stage-unit">次</span>
                    </span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="" align="center" width="56">
              <template #default="{ $index }">
                <el-button link type="danger" @click="removeStage($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button link type="primary" class="mt-8px" @click="addStage">+ 添加程序段</el-button>
        </template>

        <!-- 细度分析：刮涂参数 / 颗粒相关参数 -->
        <template v-else-if="sourceProjectType() === 2">
          <div class="form-sec-title">刮涂参数</div>
          <div class="param-field">
            <span class="field-label">刮涂速度</span>
            <el-input-number v-model="form.scrapingSpeed" :controls="false" class="field-input" />
            <span class="field-unit">mm/s</span>
          </div>
          <div class="param-field">
            <span class="field-label">刮涂后停留时间</span>
            <el-input-number v-model="form.readingDelay" :controls="false" class="field-input" />
            <span class="field-unit">s</span>
          </div>
          <div class="form-sec-title">颗粒相关参数</div>
          <div class="param-field">
            <span class="field-label">颗粒最小面积</span>
            <el-input-number v-model="form.minParticleArea" :controls="false" class="field-input" />
            <span class="field-unit">mm²</span>
          </div>
        </template>

        <!-- 流变测试：方法名称 -->
        <template v-else-if="sourceProjectType() === 3">
          <div class="form-sec-title">方法名称</div>
          <div class="param-field">
            <span class="field-label">方法名称</span>
            <el-input v-model="form.methodName" placeholder="请输入方法名称" class="field-input" />
          </div>
        </template>

        <!-- XRD检测：扫描角度 / 扫描步长 / 每步计数时间 -->
        <template v-else-if="sourceProjectType() === 5">
          <div class="form-sec-title">XRD 检测参数</div>
          <div class="param-field">
            <span class="field-label">起始角</span>
            <el-input-number v-model="form.scanStartAngle" :controls="false" class="field-input" />
            <span class="field-unit">°2θ</span>
          </div>
          <div class="param-field">
            <span class="field-label">结束角</span>
            <el-input-number v-model="form.scanEndAngle" :controls="false" class="field-input" />
            <span class="field-unit">°2θ</span>
          </div>
          <div class="param-field">
            <span class="field-label">扫描步长</span>
            <el-input-number v-model="form.scanStepSize" :controls="false" :step="0.01" class="field-input" />
            <span class="field-unit">°2θ</span>
          </div>
          <div class="param-field">
            <span class="field-label">每步计数时间</span>
            <el-input-number v-model="form.timePerStep" :controls="false" :min="0" class="field-input" />
            <span class="field-unit">s</span>
          </div>
          <div class="param-tip">常规物相分析可参考 0.02° 步长；计数时间越长，通常信噪比越高。扫描速度和预计耗时以设备软件返回为准，不进行本地换算。</div>
        </template>

        <!-- 离子电导率：M 检测方法 + P 检测参数 -->
        <template v-else-if="sourceProjectType() === 6">
          <div class="form-sec-title">M 检测方法</div>
          <div class="param-field">
            <span class="field-label">方法名称</span>
            <el-input v-model="form.methodName" placeholder="请输入方法名称" class="field-input" />
          </div>
          <div class="form-sec-title">P 检测参数</div>
          <div class="param-field">
            <span class="field-label">检测温度</span>
            <el-input-number v-model="form.temperature" :controls="false" class="field-input" />
            <span class="field-unit">℃</span>
          </div>
          <div class="param-field">
            <span class="field-label">压力调节</span>
            <el-input-number v-model="form.pressure" :controls="false" class="field-input" />
            <span class="field-unit">T</span>
          </div>
          <div class="param-field">
            <span class="field-label">保压时间</span>
            <el-input-number v-model="form.holdingTime" :controls="false" :min="0" class="field-input" />
            <span class="field-unit">s</span>
          </div>
        </template>

        <!-- 水分检测：温度测试设置 -->
        <template v-else-if="sourceProjectType() === 1">
          <div class="form-sec-title">温度测试设置</div>
          <div v-for="(point, index) in tempPoints" :key="index" class="temp-row">
            <span class="temp-tag">T{{ index + 1 }}</span>
            <div class="temp-field">
              <span class="temp-label">目标温度</span>
              <el-input-number v-model="point.targetTemperature" :controls="false" class="temp-input" />
              <span class="temp-unit">℃</span>
            </div>
            <div class="temp-field">
              <span class="temp-label">允许偏差</span>
              <el-input-number v-model="point.tolerance" :controls="false" class="temp-input" />
              <span class="temp-unit">± ℃</span>
            </div>
            <el-button link type="danger" class="ml-8px" @click="removeTempPoint(index)">删除</el-button>
          </div>
          <el-button link type="primary" class="mt-8px" @click="addTempPoint">+ 添加温度测试点</el-button>
          <div class="param-tip">用于核查加热模块，不参与固含量（干物质含量）判定</div>
        </template>
      </template>

      <!-- ============ 检测判定 ============ -->
      <template v-else-if="type === 'judge'">
        <div class="form-sec-title">基本信息</div>
        <el-form label-width="110px" class="detail-form">
          <el-form-item label="标准名称">
            <el-input :model-value="sourceName()" disabled />
          </el-form-item>
          <el-form-item label="检测类型">
            <el-input :model-value="getLabProjectTypeLabel(sourceProjectType())" disabled />
          </el-form-item>
          <el-form-item label="判定准则">
            <el-radio-group :model-value="form.mode" disabled>
              <el-radio :value="1">具体值</el-radio>
              <el-radio :value="2">上下浮动区间</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="结果单位">
            <el-input v-model="form.unit" placeholder="请输入结果单位" class="!w-220px" />
          </el-form-item>
          <el-form-item v-if="form.mode === 2" label="标准值">
            <el-input-number v-model="form.standardValue" :controls="false" class="!w-200px" />
            <span class="judge-unit">{{ form.unit || '' }}</span>
          </el-form-item>
        </el-form>

        <div class="form-sec-title">判定区间</div>
        <el-table :data="form.intervals || []" border size="small" class="edit-table">
          <el-table-column label="判定" align="center" width="140">
            <template #default="{ row }">
              <el-select v-model="row.result" class="!w-120px">
                <el-option v-for="(v, i) in [1, 2, 3]" :key="i" :value="v" :label="getResultLabel(v)" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数值区间" min-width="360">
            <template #default="{ row }">
              <!-- 具体值：左运算符 + 左值 至 右运算符 + 右值 -->
              <div v-if="form.mode === 1" class="judge-range">
                <el-select v-model="row.lowerInclusive" class="op-select">
                  <el-option :value="true" label="≥" />
                  <el-option :value="false" label=">" />
                </el-select>
                <el-input-number v-model="row.lower" :controls="false" class="val-input" />
                <span class="judge-expr">至</span>
                <el-select v-model="row.upperInclusive" class="op-select">
                  <el-option :value="true" label="≤" />
                  <el-option :value="false" label="<" />
                </el-select>
                <el-input-number v-model="row.upper" :controls="false" class="val-input" />
              </div>
              <!-- 上下浮动区间：方向 + 百分比 -->
              <div v-else class="judge-range">
                <el-select v-model="row.direction" class="dir-select">
                  <el-option v-for="(v, i) in [1, 2, 3]" :key="i" :value="v" :label="directionLabel(v)" />
                </el-select>
                <el-input-number v-model="row.percent" :controls="false" :min="0" class="val-input" />
                <span class="judge-unit">%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="" align="center" width="56">
            <template #default="{ $index }">
              <el-button link type="danger" @click="removeInterval($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button link type="primary" class="mt-8px" @click="addInterval">+ 添加判定区间</el-button>
        <div class="judge-tip" style="margin-top: 8px">
          单项仅判定合格、不合格或预警，最终处置由综合规则决定，未覆盖的数值待判定。
        </div>
      </template>

      <!-- ============ 综合判定 ============ -->
      <template v-else>
        <div class="judge-banner">
          <div class="banner-title">判定与处置</div>
          <div class="banner-desc">{{ modeBannerText }}</div>
        </div>
        <div class="form-sec-title">基本信息</div>
        <el-form label-width="110px" class="detail-form">
          <el-form-item label="规则名称">
            <el-input :model-value="sourceName()" disabled />
          </el-form-item>
          <el-form-item label="参与检测项目">
            <el-checkbox-group :model-value="projectTypeList" disabled>
              <el-checkbox v-for="pt in projectTypeList" :key="pt" :value="pt">
                {{ getLabProjectTypeLabel(pt) }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="判定方式">
            <el-radio-group :model-value="form.mode" disabled>
              <el-radio :value="1">按判定项数</el-radio>
              <el-radio :value="2">按项目组合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <!-- 按判定项数：项数处置规则 -->
        <template v-if="form.mode === 1">
          <div class="form-sec-title">项数处置规则</div>
          <el-table :data="form.countRules || []" border size="small" class="edit-table">
            <el-table-column label="#" type="index" align="center" width="56" />
            <el-table-column label="不合格项数" align="center" min-width="130">
              <template #default="{ row }">
                <el-input-number v-model="row.failCount" :controls="false" :min="0" class="rule-input" />
              </template>
            </el-table-column>
            <el-table-column label="预警项数" align="center" min-width="130">
              <template #default="{ row }">
                <el-input-number v-model="row.warningCount" :controls="false" :min="0" class="rule-input" />
              </template>
            </el-table-column>
            <el-table-column label="处理方式" align="center" width="160">
              <template #default="{ row }">
                <el-select v-model="row.disposition" class="!w-130px">
                  <el-option v-for="(v, i) in [1, 2]" :key="i" :value="v" :label="getDispositionLabel(v)" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="" align="center" width="56">
              <template #default="{ $index }">
                <el-button link type="danger" @click="removeCountRule($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button link type="primary" class="mt-8px" @click="addCountRule">+ 添加规则</el-button>
          <div class="judge-tip" style="margin-top: 8px">
            按不合格项数和预警项数精确匹配，其余项目为合格。不自动合并两种判定，未匹配时待处置。
          </div>
        </template>

        <!-- 按项目组合：主检测项目 + 组合规则 -->
        <template v-else>
          <el-form label-width="110px" class="detail-form">
            <el-form-item label="主检测项目">
              <el-select v-model="form.mainProjectType" class="!w-220px">
                <el-option v-for="pt in projectTypeList" :key="pt" :value="pt" :label="getLabProjectTypeLabel(pt)" />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="form-sec-title">组合规则</div>
          <el-table :data="form.combinations || []" border size="small" class="edit-table">
            <el-table-column label="#" type="index" align="center" width="56" />
            <el-table-column v-for="pt in projectTypeList" :key="pt" :label="getLabProjectTypeLabel(pt)" align="center" min-width="120">
              <template #default="{ row }">
                <el-select v-model="row.results[resultIndex(row, pt)].result" class="!w-110px">
                  <el-option v-for="(v, i) in [1, 2, 3]" :key="i" :value="v" :label="getComResultLabel(v)" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="处置方式" align="center" width="160">
              <template #default="{ row }">
                <el-select v-model="row.disposition" class="!w-130px">
                  <el-option v-for="(v, i) in [1, 2]" :key="i" :value="v" :label="getDispositionLabel(v)" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="" align="center" width="56">
              <template #default="{ $index }">
                <el-button link type="danger" @click="removeCombination($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button link type="primary" class="mt-8px" @click="addCombination">+ 添加组合规则</el-button>
        </template>
      </template>

      <div class="edit-tip">
        当前为暂存编辑：保存后先写入浏览器缓存，点击配方的「确定」后随配方一并入库。
      </div>
    </div>

    <template #footer>
      <el-button @click="handleVisibleChange(false)">取 消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">保 存</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  getLabProjectTypeLabel,
  getSyncJudgePage,
  SyncComprehensiveVO,
  SyncJudgeVO,
  SyncMethodVO
} from '@/api/lab/sync'
import { ConfigEditType, getConfigCache, setConfigCache } from './configCache'

const props = defineProps<{
  modelValue: boolean
  type: ConfigEditType
  source: SyncMethodVO | SyncJudgeVO | SyncComprehensiveVO | null
  /** 当前配方工段编码（如 S01 合成段、S02 配方段），用于加载脱泡检测判定下拉 */
  segmentCode?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', payload: { type: ConfigEditType; dataId: string }): void
}>()

const saving = ref(false)
/** 可编辑配置对象（已解析） */
const form = ref<any>(null)
/** 原始配置 JSON 字符串 */
const originalJson = ref('')
/** 脱泡检测判定下拉（标准名称选项，来自检测判定接口 projectType=4） */
const defoamJudgeOptions = ref<SyncJudgeVO[]>([])

/** 加载脱泡检测判定下拉 */
const loadDefoamJudges = async () => {
  if (props.type !== 'method' || sourceProjectType() !== 4) {
    return
  }
  try {
    const data = await getSyncJudgePage({
      segmentCode: props.segmentCode,
      projectType: 4,
      status: 1,
      pageSize: 200
    })
    defoamJudgeOptions.value = data?.list || []
  } catch {
    defoamJudgeOptions.value = []
  }
}

/** 当前编辑对象名称（judge/comprehensive 取 name，method 取 projectName） */
const sourceName = (): string => {
  const s = props.source as any
  return s ? (s.name || s.projectName || '') : ''
}

/** 当前编辑对象项目类型（method 才有） */
const sourceProjectType = (): number => {
  const s = props.source as any
  return s ? (s.projectType as number | undefined) ?? -1 : -1
}

const dialogTitle = computed(() => {
  const name = sourceName()
  if (props.type === 'method') return '检测参数 · ' + name
  if (props.type === 'judge') return '检测判定 · ' + name
  return '综合判定 · ' + name
})

/** 综合判定：判定与处置说明 */
const modeBannerText = computed(() => {
  if (form.value?.mode === 2) {
    return '检测全部完成后，先匹配组合规则；未命中时按主检测项处置。单项判定保留，返工暂不可用。'
  }
  return '单项判定与最终处置独立。检测全部完成后匹配规则；缺项或未匹配规则时待处置。正常通过不改变单项判定。'
})

/** 综合判定：参与检测项目（数字列表） */
const projectTypeList = computed(() => {
  const s = (props.source as SyncComprehensiveVO | undefined)?.projectTypes
  if (!s) {
    return []
  }
  return s.split(',').map((n) => Number(n)).filter((n) => !Number.isNaN(n))
})

/** 水分检测：温度测试点列表（可编辑） */
const tempPoints = computed(() => {
  const list = form.value?.temperatureTestPoints
  return Array.isArray(list) ? (list as any[]) : []
})

const parseJson = (json?: string): Record<string, any> => {
  if (!json) {
    return {}
  }
  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

/** 打开弹窗时初始化 */
const handleOpen = () => {
  if (!props.source) {
    form.value = null
    return
  }
  // 脱泡检测编辑：加载标准名称下拉（检测判定 projectType=4）
  loadDefoamJudges()
  const type = props.type
  const dataId = (props.source as any).dataId as string
  // 配置 JSON 字段
  const configField =
    type === 'method'
      ? 'configJson'
      : type === 'judge'
        ? 'standardJson'
        : 'comprehensiveJson'
  const original = parseJson((props.source as any)[configField])
  originalJson.value = JSON.stringify(original)
  // 优先使用缓存中的编辑结果，否则使用原始配置
  const cached = getConfigCache(type, dataId)
  form.value = cached ? parseJson(cached.configJson) : deepClone(original)
  // 补充缺省字段：mode/unit/standardValue（judge、comprehensive 的顶层字段来自 VO，编辑时并入 form 统一保存）
  if (type === 'judge') {
    form.value.mode = form.value.mode ?? (props.source as SyncJudgeVO).mode
    form.value.unit = form.value.unit ?? (props.source as SyncJudgeVO).unit
    form.value.standardValue = form.value.standardValue ?? (props.source as SyncJudgeVO).standardValue
  }
  if (type === 'comprehensive') {
    form.value.mode = form.value.mode ?? (props.source as SyncComprehensiveVO).mode
    form.value.mainProjectType = form.value.mainProjectType ?? (props.source as SyncComprehensiveVO).mainProjectType
    // 归一化组合规则：确保每条组合的 results 覆盖所有参与检测项目（缺失项补空，保证 v-model 下标有效）
    if (Array.isArray(form.value.combinations)) {
      form.value.combinations.forEach((combo: any) => {
        const map: Record<number, any> = {}
        ;(combo.results || []).forEach((r: any) => {
          if (r && r.projectType != null) {
            map[r.projectType] = r
          }
        })
        combo.results = projectTypeList.value.map((pt) => map[pt] || { projectType: pt, result: null })
      })
    }
  }
}

const handleVisibleChange = (value: boolean) => {
  emit('update:modelValue', value)
}

// ========== 脱泡程序段 ==========
const addStage = () => {
  if (!form.value) return
  if (!Array.isArray(form.value.programStages)) form.value.programStages = []
  form.value.programStages.push({ type: 1, sortOrder: form.value.programStages.length + 1, methodName: '' })
}
const removeStage = (index: number) => {
  form.value?.programStages?.splice(index, 1)
  // 重排序号
  form.value?.programStages?.forEach((s: any, i: number) => (s.sortOrder = i + 1))
}

// ========== 水分温度测试点 ==========
const addTempPoint = () => {
  if (!form.value) return
  if (!Array.isArray(form.value.temperatureTestPoints)) form.value.temperatureTestPoints = []
  form.value.temperatureTestPoints.push({ targetTemperature: undefined, tolerance: undefined })
}
const removeTempPoint = (index: number) => {
  form.value?.temperatureTestPoints?.splice(index, 1)
}

// ========== 判定区间 ==========
const addInterval = () => {
  if (!form.value) return
  if (!Array.isArray(form.value.intervals)) form.value.intervals = []
  if (form.value.mode === 1) {
    form.value.intervals.push({ result: 1, lower: undefined, lowerInclusive: true, upper: undefined, upperInclusive: true })
  } else {
    form.value.intervals.push({ result: 1, direction: 3, percent: undefined })
  }
}
const removeInterval = (index: number) => {
  form.value?.intervals?.splice(index, 1)
}

// ========== 综合判定：项数处置规则 ==========
const addCountRule = () => {
  if (!form.value) return
  if (!Array.isArray(form.value.countRules)) form.value.countRules = []
  form.value.countRules.push({ failCount: undefined, warningCount: undefined, disposition: 1 })
}
const removeCountRule = (index: number) => {
  form.value?.countRules?.splice(index, 1)
}

// ========== 综合判定：组合规则 ==========
const addCombination = () => {
  if (!form.value) return
  if (!Array.isArray(form.value.combinations)) form.value.combinations = []
  form.value.combinations.push({
    results: projectTypeList.value.map((pt) => ({ projectType: pt, result: null })),
    disposition: 1
  })
}
const removeCombination = (index: number) => {
  form.value?.combinations?.splice(index, 1)
}

/** 组合规则中指定项目在 results 数组中的下标（打开弹窗时已归一化，必定存在） */
const resultIndex = (combo: any, projectType: number): number => {
  return (combo.results || []).findIndex((item: any) => item.projectType === projectType)
}

// ========== 标签映射 ==========
const getProgramStageTypeLabel = (type?: number) => {
  return ({ 1: '脱泡程序', 2: '静置程序', 3: '测温程序' } as Record<number, string>)[type ?? -1] ?? '—'
}
const getResultLabel = (result?: number) => {
  return ({ 1: '合格', 2: '预警', 3: '不合格' } as Record<number, string>)[result ?? -1] ?? '—'
}
const directionLabel = (direction?: number) => {
  return ({ 1: '高于', 2: '低于', 3: '±' } as Record<number, string>)[direction ?? -1] ?? '—'
}
const getDispositionLabel = (disposition?: number) => {
  return ({ 1: '正常通过', 2: '不合格拦截' } as Record<number, string>)[disposition ?? -1] ?? '—'
}
const getComResultLabel = (result?: number) => {
  return ({ 1: '合格', 2: '预警', 3: '不合格' } as Record<number, string>)[result ?? -1] ?? '—'
}

/** 保存：写入浏览器缓存 */
const handleSave = () => {
  if (!form.value || !props.source) return
  const type = props.type
  const dataId = (props.source as any).dataId as string
  const configJson = JSON.stringify(form.value)
  setConfigCache(type, dataId, configJson, originalJson.value)
  emit('saved', { type, dataId })
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) handleOpen()
  }
)
</script>

<style scoped>
/* ===== 与既有深色赛博主题一致：无白底 ===== */
.config-edit-body {
  color: var(--text-primary);
}
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
.param-field,
.temp-field,
.stage-param-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  margin-right: 24px;
}
.field-label,
.stage-key,
.temp-label {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}
.field-input,
.stage-input,
.temp-input {
  width: 180px;
}
.field-unit,
.stage-unit,
.temp-unit,
.judge-unit {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
}
.temp-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.temp-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 24px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-cyan);
  border: 1px solid var(--border-glow);
  border-radius: 4px;
  background: rgba(0, 240, 255, 0.06);
}
.param-tip,
.judge-tip {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 4px;
}
.edit-table {
  --el-table-border-color: var(--border-color);
  --el-table-header-bg-color: rgba(0, 240, 255, 0.06);
  --el-table-header-text-color: var(--text-primary);
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(0, 240, 255, 0.04);
}
.judge-range {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.op-select,
.dir-select {
  width: 76px;
}
.val-input {
  width: 120px;
}
.rule-input {
  width: 120px;
}
.judge-expr {
  color: var(--text-secondary);
  font-size: 13px;
}
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
.edit-tip {
  margin-top: 16px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--text-muted);
  border: 1px dashed var(--border-color);
  border-radius: 6px;
}
</style>
