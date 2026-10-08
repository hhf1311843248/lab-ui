<!-- 实验策划-实验任务调度（排产队列 + 生产排程甘特图） -->
<template>
  <div class="sched-page">
    <!-- 排产队列 -->
    <ContentWrap>
      <div class="board-head">
        <div class="sec-head">
          <span>排产队列 · 按优先级</span>
          <span class="sec-sub">已下达 / 生产中的实验任务进入排产队列；已下达任务点击卡片可编辑优先级</span>
        </div>
        <el-button type="primary" plain :loading="loading" @click="loadQueue">
          <Icon icon="ep:refresh" class="mr-5px" /> 刷新
        </el-button>
      </div>
      <div v-loading="loading" class="queue-list">
        <template v-if="queueList.length">
          <div
            v-for="(item, idx) in queueList"
            :key="item.id"
            class="queue-card"
            :class="['qa-' + item.status, { clickable: item.status === '已下达' }]"
            @click="openPriority(item)"
          >
            <div class="qc-top">
              <span class="qc-ord">{{ idx + 1 }}</span>
              <span class="qc-code">{{ item.code }}</span>
              <span class="tag st" :class="'st-' + item.status">{{ item.status }}</span>
              <span class="tag pr" :class="'pr-' + item.prio">{{ item.prio }}</span>
              <span
                class="tag sim"
                :class="'sim-' + simClass(item.simStatus)"
                :title="item.simStatus"
              >{{ item.simStatus }}</span>
            </div>
            <div class="qc-desc">{{ item.description || '—' }}</div>
            <div class="qc-sections">
              <el-tooltip v-if="!item.sections || !item.sections.length" content="未关联配方，无工段信息">
                <span class="sec-tag empty">未分段</span>
              </el-tooltip>
              <template v-for="(s, si) in item.sections" :key="s">
                <span class="sec-tag" :class="'sec-' + (si % 3)">{{ s }}</span>
              </template>
              <span class="proc-cnt">{{ item.processCount }} 道工序 · {{ item.formulaCount }} 个配方</span>
            </div>
            <div class="qc-time">
              <span>计划开始 <b>{{ fmtDT(item.planStart) }}</b></span>
              <span class="arrow">→</span>
              <span>计划完成 <b>{{ fmtDT(item.planEnd) }}</b></span>
            </div>
            <div class="qc-tip">{{ item.status === '已下达' ? '点击卡片编辑优先级' : '' }}</div>
          </div>
        </template>
        <el-empty v-else :description="loading ? '' : '暂无已下达/生产中的排产任务'" />
      </div>
    </ContentWrap>

    <!-- 生产排程甘特图 -->
    <ContentWrap>
      <div class="board-head">
        <div class="sec-head">
          <span>生产排程甘特图</span>
          <span class="sec-sub">按工序分行的产能甘特，条色按排产状态区分</span>
        </div>
        <div class="legend">
          <span v-for="(c, s) in statusLegend" :key="s" class="lg"><i :class="['dot','dot-' + s]"></i>{{ c }}</span>
        </div>
      </div>
      <div v-loading="ganttLoading" class="gantt-scroll">
        <div class="gantt-inner" :style="{ width: ganttWidth + 'px' }">
          <!-- 时间轴 -->
          <div class="g-corner">工序 / 资源</div>
          <div class="g-axis" :style="{ width: timelineW + 'px' }">
            <template v-for="d in axisDays" :key="d.key">
              <div class="g-day" :style="{ left: d.left + 'px', width: dayW + 'px' }">
                <b>{{ d.label }}</b><span>{{ d.wk }}</span>
              </div>
            </template>
          </div>
          <!-- 行 -->
          <template v-for="row in ganttRows" :key="row.key">
            <div class="g-st-name">
              <span class="g-st-n">{{ row.proc }}</span>
              <span class="g-st-r">{{ row.resource || '—' }}</span>
            </div>
            <div
              class="g-row"
              :style="{ width: timelineW + 'px', '--day-stripe': dayW + 'px' }"
              :class="row.alternate ? 'even' : ''"
            >
              <template v-for="bar in row.bars" :key="bar.id">
                <div
                  class="g-block"
                  :class="'gb-' + bar.status"
                  :style="{ left: bar.left + 'px', width: bar.width + 'px' }"
                  :title="bar.title"
                >
                  <span class="gb-code">{{ bar.code }}</span>
                </div>
              </template>
            </div>
          </template>
        </div>
        <el-empty
          v-if="!ganttLoading && ganttRows.length === 0"
          style="padding-top: 40px"
          description="暂无排产任务数据（可在排产任务维护中创建）"
        />
      </div>
    </ContentWrap>

    <!-- 优先级编辑弹窗 -->
    <el-dialog v-model="prioVisible" title="调整排产优先级" width="420px" append-to-body>
      <div v-if="editing" class="prio-body">
        <div class="prio-row">
          <span class="prio-label">任务组</span>
          <b>{{ editing.code }}</b>
          <span class="prio-note">{{ editing.description }}</span>
        </div>
        <el-form label-width="80px" label-position="left">
          <el-form-item label="优先级">
            <el-select v-model="editingPriority" class="!w-full" placeholder="请选择优先级">
              <el-option v-for="p in prioOptions" :key="p" :label="p" :value="p" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" :loading="saving" @click="savePriority">保 存</el-button>
        <el-button @click="prioVisible = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { getSchedulePage, ScheduleTaskVO } from '@/api/lab/schedule'
import {
  getTaskGroupQueue,
  TaskGroupQueueVO,
  updateTaskGroupPriority
} from '@/api/lab/taskGroup'

defineOptions({ name: 'LabPlanSchedule' })

const message = useMessage()

// ============ 排产队列 ============
const loading = ref(false)
const queueList = ref<TaskGroupQueueVO[]>([])
const prioOptions = ['高', '中', '低']

const simClass = (s?: string) => {
  if (s === '仿真运行中') return 'run'
  if (s === '仿真完成') return 'done'
  return 'wait'
}

const loadQueue = async () => {
  loading.value = true
  try {
    queueList.value = await getTaskGroupQueue()
  } finally {
    loading.value = false
  }
}

// 优先级编辑
const prioVisible = ref(false)
const saving = ref(false)
const editing = ref<TaskGroupQueueVO>()
const editingPriority = ref('')

const openPriority = (item: TaskGroupQueueVO) => {
  if (item.status !== '已下达') return
  editing.value = item
  editingPriority.value = item.prio || '中'
  prioVisible.value = true
}

const savePriority = async () => {
  if (!editing.value) return
  saving.value = true
  try {
    await updateTaskGroupPriority(editing.value.id, editingPriority.value)
    message.success('优先级已更新为「' + editingPriority.value + '」，已重新排产')
    prioVisible.value = false
    await loadQueue()
  } finally {
    saving.value = false
  }
}

// ============ 甘特图 ============
const ganttLoading = ref(false)
const PX_PER_HOUR = 16 // 每小时间距(px)
const LABEL_W = 172 // 左侧标签列宽

const statusLegend: Record<string, string> = {
  '已排产': '已排产',
  待排产: '待排产',
  执行中: '执行中',
  已完成: '已完成'
}

const scheduleTasks = ref<ScheduleTaskVO[]>([])

const loadGantt = async () => {
  ganttLoading.value = true
  try {
    const data = await getSchedulePage({ pageNo: 1, pageSize: 200 })
    scheduleTasks.value = data.list || []
  } finally {
    ganttLoading.value = false
  }
}

// 时间范围
const range = computed(() => {
  const ms: number[] = []
  scheduleTasks.value.forEach((t) => {
    const s = toMs(t.planStart)
    const e = toMs(t.planEnd)
    if (s != null) ms.push(s)
    if (e != null) ms.push(e)
  })
  if (!ms.length) return null
  const min = Math.min(...ms)
  const max = Math.max(...ms)
  // 左右留白 8 小时
  const pad = 8 * 3600 * 1000
  return { min: min - pad, max: max + pad }
})

const chartRange = computed(() => {
  const r = range.value
  if (!r) return null
  const duration = Math.max(r.max - r.min, 4 * 3600 * 1000)
  const dayW = 24 * PX_PER_HOUR
  const maxEnd = r.min + duration
  const start = dayjs(r.min).startOf('day').valueOf()
  const end = dayjs(maxEnd).startOf('day').add(1, 'day').valueOf()
  const totalDays = Math.max(1, Math.ceil((end - start) / (24 * 3600 * 1000)))
  return { start, end, totalDays, dayW }
})

const dayW = computed(() => chartRange.value?.dayW ?? 0)
const timelineW = computed(() => (chartRange.value?.totalDays ?? 0) * dayW.value)
const ganttWidth = computed(() => LABEL_W + timelineW.value)

const axisDays = computed(() => {
  const r = chartRange.value
  if (!r) return []
  const days: { key: string; left: number; label: string; wk: string }[] = []
  for (let i = 0; i < r.totalDays; i++) {
    const d = dayjs(r.start).add(i, 'day')
    days.push({
      key: d.format('YYYY-MM-DD'),
      left: i * r.dayW,
      label: d.format('MM/DD'),
      wk: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.day()]
    })
  }
  return days
})

const ganttRows = computed(() => {
  const r = chartRange.value
  if (!r) return []
  const byProc = new Map<string, ScheduleTaskVO[]>()
  scheduleTasks.value.forEach((t) => {
    const key = t.procName || '未命名工序'
    if (!byProc.has(key)) byProc.set(key, [])
    byProc.get(key)!.push(t)
  })
  const rows: {
    key: string
    proc: string
    resource: string
    alternate: boolean
    bars: { id: any; code: string; status: string; left: number; width: number; title: string }[]
  }[] = []
  let idx = 0
  byProc.forEach((tasks, proc) => {
    const bars: any[] = []
    tasks.forEach((t) => {
      const s = toMs(t.planStart)
      const e = toMs(t.planEnd)
      if (s == null || e == null) return
      const left = (s - r.start) / (3600 * 1000) * PX_PER_HOUR
      const width = Math.max(((e - s) / (3600 * 1000)) * PX_PER_HOUR, 14)
      bars.push({
        id: t.id,
        code: t.groupCode || t.formulaCode || '-',
        status: stKey(t.status),
        left,
        width,
        title: `${t.groupCode || ''} · ${t.procName || ''} · ${t.resource || ''}\n${dayjs(s).format('MM/DD HH:mm')} → ${dayjs(e).format('MM/DD HH:mm')} · ${t.status || '待排产'}`
      })
    })
    rows.push({
      key: proc + idx,
      proc,
      resource: uniq(tasks.map((x) => x.resource).filter(Boolean)).join(' / '),
      alternate: idx % 2 === 1,
      bars
    })
    idx++
  })
  return rows
})

// ============ 工具 ============
const toMs = (v?: any): number | null => {
  if (v == null || v === '') return null
  if (typeof v === 'number') return v
  const d = dayjs(String(v).replace('T', ' '))
  return d.isValid() ? d.valueOf() : null
}

const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr))

const fmtDT = (v?: any) => (toMs(v) == null ? '—' : dayjs(toMs(v)).format('YYYY-MM-DD HH:mm'))

// 状态归一到甘特颜色键
const stKey = (s?: string) => {
  if (s === '执行中') return '执行中'
  if (s === '已完成') return '已完成'
  if (s === '已排产') return '已排产'
  return '待排产'
}

onMounted(() => {
  loadQueue()
  loadGantt()
})
</script>

<style scoped>
.sched-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sec-head {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}
.sec-sub {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
}

/* ---- 排产队列 ---- */
.queue-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  gap: 14px;
  margin-top: 4px;
  min-height: 80px;
}
.queue-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px 14px 12px;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  box-shadow: var(--shadow-card);
}
.queue-card.clickable {
  cursor: pointer;
}
.queue-card.clickable:hover {
  transform: translateY(-3px);
  border-color: var(--border-glow);
  box-shadow: var(--shadow-glow);
}
.qc-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.qc-ord {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: var(--gradient-primary);
  flex-shrink: 0;
}
.qc-code {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
}
.qc-desc {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
  min-height: 34px;
}
.tag {
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.6;
}
.tag.st {
  color: var(--text-primary);
  background: var(--border-color);
}
.tag.st-已下达 { color: var(--accent-blue); background: color-mix(in srgb, var(--accent-blue) 14%, transparent); }
.tag.st-生产中 { color: var(--accent-orange); background: color-mix(in srgb, var(--accent-orange) 16%, transparent); }
.tag.pr { color: var(--text-primary); background: var(--left-menu-hover-bg-color); }
.tag.pr-高 { color: var(--accent-orange); background: color-mix(in srgb, var(--accent-orange) 16%, transparent); }
.tag.pr-中 { color: var(--accent-blue); background: color-mix(in srgb, var(--accent-blue) 14%, transparent); }
.tag.pr-低 { color: var(--text-muted); background: var(--border-color); }
.tag.sim { color: var(--accent-purple); background: color-mix(in srgb, var(--accent-purple) 14%, transparent); }
.tag.sim.sim-run { color: var(--accent-cyan); background: color-mix(in srgb, var(--accent-cyan) 15%, transparent); }
.tag.sim.sim-done { color: var(--accent-green); background: color-mix(in srgb, var(--accent-green) 14%, transparent); }
.qc-sections {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.sec-tag {
  padding: 2px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: var(--border-color);
  color: var(--text-secondary);
}
.sec-tag.sec-0 { color: var(--accent-purple); }
.sec-tag.sec-1 { color: var(--accent-blue); }
.sec-tag.sec-2 { color: var(--accent-green); }
.sec-tag.empty { color: var(--text-muted); }
.proc-cnt {
  margin-left: auto;
  font-size: 11.5px;
  color: var(--text-muted);
  white-space: nowrap;
}
.qc-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  flex-wrap: wrap;
}
.qc-time b {
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}
.qc-time .arrow { color: var(--text-muted); }
.qc-tip {
  text-align: center;
  font-size: 11px;
  color: var(--accent-cyan);
  height: 14px;
}

/* ---- 标题行 ---- */
.board-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

/* ---- 甘特图 ---- */
.legend {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
}
.lg {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-secondary);
}
.lg .dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}
.dot-待排产 { background: var(--text-muted); }
.dot-已排产 { background: var(--accent-blue); }
.dot-执行中 { background: var(--accent-cyan); }
.dot-已完成 { background: var(--accent-green); }

.gantt-scroll {
  overflow: auto;
  margin-top: 6px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  max-height: 520px;
}
.gantt-inner {
  display: grid;
  grid-template-columns: 172px minmax(0, 1fr);
  position: relative;
  min-height: 120px;
}
.g-corner,
.g-st-name {
  position: sticky;
  left: 0;
  z-index: 3;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12px;
}
.g-corner {
  top: 0;
  min-height: 40px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  z-index: 4;
}
.g-axis {
  position: sticky;
  top: 0;
  height: 40px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  overflow: hidden;
  z-index: 4;
}
.g-day {
  position: absolute;
  top: 0;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--border-color);
  font-size: 11px;
  color: var(--text-secondary);
}
.g-day b {
  font-weight: 700;
  color: var(--text-primary);
}
.g-st-name {
  min-height: 56px;
  align-items: flex-start;
}
.g-st-n {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}
.g-st-r {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.g-row {
  position: relative;
  min-height: 56px;
  border-bottom: 1px solid var(--border-color);
  background-image: repeating-linear-gradient(
    90deg,
    var(--border-color) 0 1px,
    transparent 1px var(--day-stripe, 336px)
  );
  background-size: auto;
}
.g-row.even {
  background-color: var(--bg-card-hover);
}
.g-block {
  position: absolute;
  top: 12px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  cursor: default;
  overflow: hidden;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}
.gb-code {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.gb-待排产 { background: var(--text-muted); }
.gb-已排产 { background: var(--accent-blue); }
.gb-执行中 {
  background: var(--accent-cyan);
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.18) 0 6px, transparent 6px 12px);
}
.gb-已完成 { background: var(--accent-green); }

/* ---- 优先级弹窗 ---- */
.prio-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.prio-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.prio-label {
  font-size: 12px;
  color: var(--text-muted);
}
.prio-note {
  width: 100%;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>