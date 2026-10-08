<!-- 供应商配置 JSON 只读递归展示组件 -->
<template>
  <div class="json-view">
    <template v-for="(entry, index) in entries" :key="index">
      <!-- 标量值 -->
      <div v-if="isScalar(entry.value)" class="json-row">
        <span class="json-label">{{ labelOf(entry.key) }}</span>
        <span class="json-value">{{ formatValue(entry.key, entry.value) }}</span>
      </div>
      <!-- 空对象 / 空数组 -->
      <div v-else-if="isEmpty(entry.value)" class="json-row">
        <span class="json-label">{{ labelOf(entry.key) }}</span>
        <span class="json-value muted">—</span>
      </div>
      <!-- 嵌套对象 / 数组 -->
      <div v-else class="json-block">
        <div class="json-block-title">{{ labelOf(entry.key) }}</div>
        <JsonView :value="entry.value" :context="context" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import JsonView from './JsonView.vue'

defineOptions({ name: 'JsonView' })

const props = defineProps<{
  value: any
  context?: 'method' | 'judge' | 'comprehensive'
}>()

// 供应商字段 -> 中文标签
const LABEL_MAP: Record<string, string> = {
  projectSegment: '所属段',
  projectType: '检测类型',
  projectName: '方案名称',
  requiresMethod: '是否指定方法',
  sampleAmount: '取样量',
  sampleUnit: '取样单位',
  supportedResultCodes: '支持结果码',
  remark: '备注',
  standard: '判定标准',
  comprehensive: '综合判定',
  name: '名称',
  // 水分检测
  temperatureTestPoints: '温度测试点',
  targetTemperature: '目标温度',
  tolerance: '允许偏差',
  // 细度检测
  scrapingSpeed: '涂布速度',
  readingDelay: '延迟读数时间',
  // 流变测试 / 离子电导率
  methodName: '方法名称',
  // 脱泡检测
  programStages: '程序阶段',
  sortOrder: '执行顺序',
  restDurationMinutes: '停留时长',
  maxRestCycles: '最大循环次数',
  judgmentStandardId: '判定标准ID',
  // XRD
  scanStartAngle: '扫描起始角',
  scanEndAngle: '扫描结束角',
  scanStepSize: '扫描步长',
  timePerStep: '每步计数时间',
  // 离子电导率
  temperature: '测试温度',
  pressure: '压力',
  holdingTime: '保压时间',
  // 判定标准
  resultCode: '结果码',
  unit: '单位',
  mode: '判定方式',
  standardValue: '标准值',
  intervals: '判定区间',
  result: '判定结论',
  lower: '下限',
  lowerInclusive: '包含下限',
  upper: '上限',
  upperInclusive: '包含上限',
  direction: '方向',
  percent: '浮动比例',
  // 综合判定
  projectTypes: '参与检测项目',
  mainProjectType: '主检测项目',
  countRules: '项数处置规则',
  failCount: '不合格项数',
  warningCount: '预警项数',
  disposition: '处置方式',
  combinations: '组合规则',
  results: '项目结论',
  type: '阶段类型'
}

// 枚举值 -> 中文
const VALUE_MAP: Record<string, (v: number) => string> = {
  projectType: (v) =>
    ({ 1: '水分检测', 2: '细度检测', 3: '流变测试', 4: '脱泡检测', 5: 'XRD检测', 6: '离子电导率' }[v] ?? String(v)),
  result: (v) => ({ 1: '合格', 2: '预警', 3: '不合格' }[v] ?? String(v)),
  direction: (v) => ({ 1: '高于', 2: '低于', 3: '全部' }[v] ?? String(v)),
  disposition: (v) => ({ 1: '正常通过', 2: '不合格拦截' }[v] ?? String(v)),
  type: (v) => ({ 1: '数据', 2: '停留', 3: '循环' }[v] ?? String(v)),
  mode: (v) => {
    if (props.context === 'judge') {
      return ({ 1: '具体值', 2: '上下浮动区间' } as Record<number, string>)[v] ?? String(v)
    }
    if (props.context === 'comprehensive') {
      return ({ 1: '按判定项数', 2: '按项目组合' } as Record<number, string>)[v] ?? String(v)
    }
    return String(v)
  }
}

const entries = computed(() => {
  if (!props.value || typeof props.value !== 'object') {
    return []
  }
  if (Array.isArray(props.value)) {
    return props.value.map((item, index) => ({ key: '第' + (index + 1) + '项', value: item }))
  }
  return Object.entries(props.value).map(([key, val]) => ({ key, value: val }))
})

const isScalar = (v: any) => {
  return v === null || v === undefined || typeof v !== 'object'
}

const isEmpty = (v: any) => {
  if (Array.isArray(v)) return v.length === 0
  return Object.keys(v || {}).length === 0
}

const labelOf = (key: string) => {
  return LABEL_MAP[key] ?? key
}

const formatValue = (key: string, v: any) => {
  if (v === null || v === undefined || v === '') {
    return '—'
  }
  if (typeof v === 'boolean') {
    return v ? '是' : '否'
  }
  if (typeof v === 'number' && VALUE_MAP[key]) {
    return VALUE_MAP[key](v)
  }
  if (typeof v === 'number') {
    return String(v)
  }
  // 数组（标量数组，如支持结果码）
  if (Array.isArray(v)) {
    return v.join(', ')
  }
  return String(v)
}
</script>

<style scoped>
.json-view {
  display: flex;
  flex-direction: column;
}
.json-row {
  display: flex;
  align-items: baseline;
  padding: 7px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
}
.json-label {
  flex: 0 0 150px;
  color: var(--text-secondary);
}
.json-value {
  flex: 1;
  color: var(--text-primary);
  word-break: break-all;
}
.json-value.muted {
  color: var(--text-muted);
}
.json-block {
  padding: 6px 0;
}
.json-block-title {
  font-weight: 600;
  color: var(--text-primary);
  margin: 6px 0;
  padding-left: 8px;
  border-left: 3px solid var(--accent-cyan);
}
</style>
