<!-- 实验策划-实验任务调度（排产队列 + 生产排程甘特图） -->
<template>
  <div class="sched-page">
    <!-- 顶部第一行：按钮区（排产规则 + 创建排产任务 + 一键自动排产） -->
    <ContentWrap>
      <div class="sched-toolbar-cols">
        <div class="sched-actions-row">
          <div class="page-title-block">
            <span class="page-title">实验任务调度</span>
            <span class="page-sub">生产排产 · 按配方优先级一键排程，主线连续流转、合成段独立断开，工序级产能甘特</span>
          </div>
          <div class="tb-actions">
            <el-button @click="rulesVisible = true">
              <Icon icon="ep:set-up" class="mr-5px" /> 排产规则
            </el-button>
            <el-button @click="openCreate">
              <Icon icon="ep:plus" class="mr-5px" /> 创建排产任务
            </el-button>
            <el-button type="primary" :loading="autoLoading" @click="handleAuto">
              <Icon icon="ep:magic-stick" class="mr-5px" /> 一键自动排产
            </el-button>
          </div>
        </div>
        <!-- 第二行：筛选工具条（搜索 + 优先级 + 状态 + 线路分段） -->
        <div class="sched-filters-row">
          <div class="tb-filters">
            <el-input
              v-model="filterKeyword"
              placeholder="搜索任务组编号 / 描述"
              clearable
              class="!w-240px"
            >
              <template #prefix><Icon icon="ep:search" /></template>
            </el-input>
            <el-select v-model="filterPrio" placeholder="优先级" clearable class="!w-120px">
              <el-option
                v-for="p in LabTaskGroupPriorityEnum"
                :key="p.value"
                :label="p.label"
                :value="p.label"
              />
            </el-select>
            <el-select v-model="filterStatus" placeholder="状态" clearable class="!w-120px">
              <el-option label="已下达" value="已下达" />
              <el-option label="生产中" value="生产中" />
            </el-select>
            <div class="line-seg">
              <button :class="{ active: filterLine === '' }" @click="filterLine = ''">
                全部线别
              </button>
              <button :class="{ active: filterLine === 'main' }" @click="filterLine = 'main'">
                主线 配方→组装→热压→测试
              </button>
              <button :class="{ active: filterLine === 'synth' }" @click="filterLine = 'synth'">
                合成段（独立）
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>

    <!-- 排产仿真（前端模拟） -->
    <ContentWrap>
      <div class="sim-panel">
        <div class="sim-main">
          <div class="sim-title-line">
            <span class="sim-title">排产仿真</span>
            <span class="sim-state" :class="'sim-' + simStateClass">{{ simStateText }}</span>
          </div>
          <div class="sim-meta">
            <span>当前排产时点 <b>{{ simCursorText }}</b></span>
            <span>步长 <b>{{ SIM_STEP }} h</b></span>
            <span class="keep">正式排产结果保持不变</span>
          </div>
          <div class="sim-progress"><span :style="{ width: simSnapshot.progress + '%' }"></span></div>
          <div class="sim-stats">
            <div class="sim-stat"><b>{{ simSnapshot.active.length }}</b><span>执行中工序</span></div>
            <div class="sim-stat"><b>{{ simSnapshot.done.length }}</b><span>已完成工序</span></div>
            <div class="sim-stat"><b>{{ simSnapshot.queued.length }}</b><span>待执行工序</span></div>
            <div class="sim-stat"><b>{{ simSnapshot.progress }}%</b><span>时间线进度</span></div>
          </div>
          <div class="sim-queue"><b>资源排队</b>{{ simQueueText }}</div>
        </div>
        <div class="sim-controls">
          <el-button type="primary" @click="toggleSim">{{ simActionLabel }}</el-button>
          <el-button @click="stepSim">单步 +{{ SIM_STEP }}h</el-button>
          <el-button @click="replaySim">重播</el-button>
        </div>
      </div>
    </ContentWrap>

    <!-- 排产队列 -->
    <ContentWrap>
      <div class="board-head">
        <div class="sec-head">
          <span>排产队列 · 按优先级</span>
          <span class="sec-sub">已下达 / 生产中的实验任务进入排产队列；已下达任务点击卡片可编辑任务组</span>
        </div>
        <el-button type="primary" plain :loading="loading" @click="loadQueue">
          <Icon icon="ep:refresh" class="mr-5px" /> 刷新
        </el-button>
      </div>
      <div v-loading="loading" class="queue-list">
        <template v-if="filteredQueue.length">
          <div
            v-for="(item, idx) in filteredQueue"
            :key="item.id"
            class="queue-card"
            :class="['qa-' + statusClass(item.status), { clickable: item.status === TaskGroupStatus.RELEASED }]"
            @click="openEdit(item)"
          >
            <div class="qc-top">
              <span class="qc-ord">{{ idx + 1 }}</span>
              <span class="qc-code">{{ item.code }}</span>
              <span class="tag line" :class="'line-' + groupline(item)">{{ grouplineLabel(groupline(item)) }}</span>
              <span class="tag st" :class="'st-' + statusClass(item.status)">{{ statusLabel(item.status) }}</span>
              <span class="tag pr" :class="'pr-' + prioClass(item.prio)">{{ prioLabel(item.prio) }}</span>
              <span
                class="tag sim"
                :class="'sim-' + cardSimLabel(item).cls"
                :title="cardSimLabel(item).label"
              >{{ cardSimLabel(item).label }}</span>
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
            <div class="qc-tip">{{ item.status === TaskGroupStatus.RELEASED ? '点击卡片编辑任务组' : '' }}</div>
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
          <!-- 行（线路分组 + 工序行） -->
          <template v-for="row in ganttRows" :key="row.key">
            <template v-if="row.kind === 'group'">
              <div class="g-grp-name">{{ row.name }}</div>
              <div class="g-grp-r"></div>
            </template>
            <template v-else>
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
                    :class="['gb-' + bar.status, bar.sim]"
                    :style="{ left: bar.left + 'px', width: bar.width + 'px' }"
                    :title="bar.title"
                  >
                    <span class="gb-code">{{ bar.code }}</span>
                  </div>
                </template>
              </div>
            </template>
          </template>
          <!-- 当前时间竖线 -->
          <div v-if="nowX" class="g-cursor now" :style="{ left: nowX }"></div>
          <!-- 仿真游标竖线 -->
          <div v-if="simCursorX" class="g-cursor sim" :style="{ left: simCursorX }"></div>
        </div>
        <el-empty
          v-if="!ganttLoading && ganttRows.length === 0"
          style="padding-top: 40px"
          description="暂无排产任务数据（可在排产任务维护中创建）"
        />
      </div>
    </ContentWrap>

    <!-- 任务组编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" append-to-body>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
        v-loading="formLoading"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务组编号" prop="code">
              <el-input v-model="formData.code" placeholder="请输入任务组编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="prio">
              <el-select v-model="formData.prio" placeholder="请选择优先级" class="!w-100%">
                <el-option
                  v-for="p in LabTaskGroupPriorityEnum"
                  :key="p.value"
                  :label="p.label"
                  :value="p.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="planStart">
              <el-date-picker
                v-model="formData.planStart"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择计划开始时间"
                class="!w-100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="planEnd">
              <el-date-picker
                v-model="formData.planEnd"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择计划完成时间"
                class="!w-100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="任务组描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="2"
            placeholder="请输入任务组描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" class="!w-100%">
            <el-option
              v-for="s in LabTaskGroupStatusEnum"
              :key="s.value"
              :label="s.label"
              :value="s.value"
            />
          </el-select>
        </el-form-item>

        <!-- 配方关联子表 -->
        <el-divider content-position="left">配方关联</el-divider>
        <el-table :data="formData.linkList" border>
          <el-table-column label="明细序号" type="index" align="center" width="60" />
          <el-table-column label="配方编号" prop="formulaCode" min-width="260">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`linkList.${$index}.formulaCode`"
                :rules="formRules.formulaCode"
                class="mb-0px!"
              >
                <el-select
                  v-model="row.formulaCode"
                  placeholder="请选择已下达的配方"
                  filterable
                  clearable
                  class="!w-100%"
                  @change="handleFormulaChange(row, $event)"
                >
                  <el-option
                    v-for="f in formulaOptions"
                    :key="f.id"
                    :label="`${f.code}｜${f.section || ''}｜${f.description || ''}`"
                    :value="f.code"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="配方描述" prop="negFormula" min-width="200">
            <template #default="{ row }">
              <el-form-item class="mb-0px!">
                <el-input v-model="row.negFormula" placeholder="选择配方后自动带出" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="60">
            <template #default="{ $index }">
              <el-button link type="danger" @click="handleDeleteLink($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" plain class="mt-2" @click="handleAddLink">
          <Icon icon="ep:plus" class="mr-5px" /> 新增配方
        </el-button>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm" :disabled="formLoading">保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 创建排产任务弹窗 -->
    <el-dialog v-model="createVisible" title="创建排产任务" width="800px" append-to-body>
      <el-form
        ref="createFormRef"
        :model="createFormData"
        :rules="createFormRules"
        label-width="110px"
        v-loading="createFormLoading"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务组编号" prop="code">
              <el-input v-model="createFormData.code" placeholder="请输入任务组编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="prio">
              <el-select v-model="createFormData.prio" placeholder="请选择优先级" class="!w-100%">
                <el-option
                  v-for="p in LabTaskGroupPriorityEnum"
                  :key="p.value"
                  :label="p.label"
                  :value="p.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="planStart">
              <el-date-picker
                v-model="createFormData.planStart"
                type="datetime"
                placeholder="选择计划开始时间"
                class="!w-100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="planEnd">
              <el-date-picker
                v-model="createFormData.planEnd"
                type="datetime"
                placeholder="选择计划完成时间"
                class="!w-100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="任务组描述" prop="description">
          <el-input
            v-model="createFormData.description"
            type="textarea"
            :rows="2"
            placeholder="请输入任务组描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="createFormData.status" placeholder="请选择状态" class="!w-100%">
            <el-option
              v-for="s in LabTaskGroupStatusEnum"
              :key="s.value"
              :label="s.label"
              :value="s.value"
            />
          </el-select>
        </el-form-item>

        <!-- 配方关联子表 -->
        <el-divider content-position="left">配方关联</el-divider>
        <el-table :data="createFormData.linkList" border>
          <el-table-column label="明细序号" type="index" align="center" width="60" />
          <el-table-column label="配方编号" prop="formulaCode" min-width="260">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`linkList.${$index}.formulaCode`"
                :rules="createFormRules.formulaCode"
                class="mb-0px!"
              >
                <el-select
                  v-model="row.formulaCode"
                  placeholder="请选择已下达的配方"
                  filterable
                  clearable
                  class="!w-100%"
                  @change="handleCreateFormulaChange(row, $event)"
                >
                  <el-option
                    v-for="f in formulaOptions"
                    :key="f.id"
                    :label="`${f.code}｜${f.section || ''}｜${f.description || ''}`"
                    :value="f.code"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="配方描述" prop="negFormula" min-width="200">
            <template #default="{ row }">
              <el-form-item class="mb-0px!">
                <el-input v-model="row.negFormula" placeholder="选择配方后自动带出" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="60">
            <template #default="{ $index }">
              <el-button link type="danger" @click="handleDeleteLinkCreate($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" plain class="mt-2" @click="handleAddLinkCreate">
          <Icon icon="ep:plus" class="mr-5px" /> 新增配方
        </el-button>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitCreate" :disabled="createFormLoading">确 定</el-button>
        <el-button @click="createVisible = false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 排产规则说明弹窗（只读） -->
    <el-dialog v-model="rulesVisible" title="排产规则" width="640px" append-to-body>
      <div class="rule-sec-title">排产日历</div>
      <div class="rule-calendar">
        <div class="rule-field">
          <span class="rf-label">起排日期</span>
          <span class="rf-value">{{ rulesStartDate }}</span>
        </div>
        <div class="rule-field">
          <span class="rf-label">班次</span>
          <span class="rf-value">{{ rulesShiftFrom }} ~ {{ rulesShiftTo }}</span>
        </div>
      </div>
      <div class="rule-sec-title">排产策略（固定规则）</div>
      <div class="rule-body">
        <div class="rule-item"><b>排序</b>：按任务组优先级（高→中→低），同级新建任务优先；高者先占用工序产能。</div>
        <div class="rule-item"><b>产能</b>：每道工序同一时刻仅 1 个任务，做完即可连续投料；工序节拍在「工序维护」配置。</div>
        <div class="rule-item"><b>流转</b>：主线 配方段→组装段→热压段→测试段 连续流转；<b>合成段与主线断开</b>，独立排程。</div>
        <div class="rule-item"><b>入口</b>：任务从其所属工段进入主线贯通后续工段；合成段仅在合成段内排程。</div>
      </div>
      <template #footer>
        <el-button @click="rulesVisible = false">关 闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { autoSchedule, getSchedulePage, ScheduleTaskVO } from '@/api/lab/schedule'
import {
  createTaskGroup,
  getLabTaskGroupPriorityLabel,
  getLabTaskGroupStatusLabel,
  getTaskGroup,
  getTaskGroupQueue,
  LabTaskGroupPriorityEnum,
  LabTaskGroupStatusEnum,
  TaskGroupLinkVO,
  TaskGroupQueueVO,
  TaskGroupVO,
  updateTaskGroup
} from '@/api/lab/taskGroup'
import { getReleasedFormulaList, FormulaSimpleVO } from '@/api/lab/formula'

defineOptions({ name: 'LabPlanSchedule' })

const message = useMessage()

// ============ 排产队列 ============
const loading = ref(false)
const queueList = ref<TaskGroupQueueVO[]>([])

// ============ 筛选（作用于 排产队列 + 甘特图） ============
const filterKeyword = ref('')
const filterPrio = ref('')
const filterStatus = ref('')
// 线路筛选：'' 全部 / main 主线 / synth 合成段
const filterLine = ref('')

// 任务组卡片线路判定：全部工段均为「合成段」→ synth，否则 main
const groupline = (card: any) => {
  const s = card?.sections
  return s && s.length && s.every((x: any) => x === '合成段') ? 'synth' : 'main'
}
const grouplineLabel = (line: string) => (line === 'synth' ? '合成段' : '主线')

// groupCode → 线路 映射（供甘特任务反查）
const lineOf = new Map<string, string>()
const refreshLineMap = () => {
  lineOf.clear()
  queueList.value.forEach((c) => lineOf.set(c.code, groupline(c)))
}
// 无对应卡片的 schedule task 归 main
const lineOfTask = (t: ScheduleTaskVO) => lineOf.get(t.groupCode || '') || 'main'

const filteredQueue = computed(() => {
  let list = queueList.value
  const kw = filterKeyword.value.trim().toLowerCase()
  if (kw) {
    list = list.filter(
      (i) =>
        (i.code || '').toLowerCase().includes(kw) ||
        (i.description || '').toLowerCase().includes(kw)
    )
  }
  if (filterPrio.value) {
    list = list.filter((i) => prioLabel(i.prio) === filterPrio.value)
  }
  if (filterStatus.value) {
    list = list.filter((i) => statusLabel(i.status) === filterStatus.value)
  }
  if (filterLine.value) {
    list = list.filter((i) => groupline(i) === filterLine.value)
  }
  return list
})

const filteredScheduleTasks = computed(() => {
  let list = scheduleTasks.value
  const kw = filterKeyword.value.trim().toLowerCase()
  if (kw) {
    list = list.filter(
      (t) =>
        (t.groupCode || '').toLowerCase().includes(kw) ||
        (t.formulaCode || '').toLowerCase().includes(kw) ||
        (t.procName || '').toLowerCase().includes(kw)
    )
  }
  if (filterPrio.value) {
    list = list.filter((t) => (t.priority || '') === filterPrio.value)
  }
  // 状态筛选仅作用于排产队列卡片（甘特图按需求仅按关键字/优先级过滤）
  if (filterLine.value) {
    list = list.filter((t) => lineOfTask(t) === filterLine.value)
  }
  return list
})

const simClass = (s?: string) => {
  if (s === '仿真运行中') return 'run'
  if (s === '仿真完成') return 'done'
  return 'wait'
}

// 优先级数字 → 名称 / 卡片标签样式
const prioLabel = (p?: number) => getLabTaskGroupPriorityLabel(p)
const prioClass = (p?: number) => prioLabel(p) || '低'

const loadQueue = async () => {
  loading.value = true
  try {
    queueList.value = await getTaskGroupQueue()
    refreshLineMap()
  } finally {
    loading.value = false
  }
}

// 任务组状态数字枚举（与后端 TaskGroupStatusEnum 对齐：1-新建、2-已下达、3-生产中、4-已完工、5-取消）
const TaskGroupStatus = {
  NEW: 1,
  RELEASED: 2,
  PRODUCING: 3,
  COMPLETED: 4,
  CANCELED: 5
} as const

// ============ 任务组编辑（点击排产队列卡片） ============
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formRef = ref()
const formData = ref<TaskGroupVO>({
  id: undefined,
  code: '',
  description: '',
  prio: undefined,
  planStart: '',
  planEnd: '',
  status: TaskGroupStatus.NEW,
  linkList: [] as TaskGroupLinkVO[]
})
const formRules = reactive({
  code: [{ required: true, message: '任务组编号不能为空', trigger: 'blur' }],
  formulaCode: [{ required: true, message: '配方编号不能为空', trigger: 'blur' }]
})
// 状态数字 → 名称 / 卡片标签样式
const statusLabel = (s?: number) => getLabTaskGroupStatusLabel(s)
const statusClass = (s?: number) => statusLabel(s) || '已下达'

// 已下达状态的配方下拉数据源
const formulaOptions = ref<FormulaSimpleVO[]>([])
const getFormulaOptions = async () => {
  formulaOptions.value = await getReleasedFormulaList()
}

const openEdit = async (item: TaskGroupQueueVO) => {
  if (item.status !== TaskGroupStatus.RELEASED) return
  dialogVisible.value = true
  dialogTitle.value = '编辑实验任务组'
  formRef.value?.resetFields()
  formLoading.value = true
  try {
    const data = await getTaskGroup(item.id)
    formData.value = data
    if (!formData.value.linkList) {
      formData.value.linkList = []
    }
  } finally {
    formLoading.value = false
  }
}

/** 选择配方后自动带出配方描述 */
const handleFormulaChange = (row: TaskGroupLinkVO, code?: string) => {
  const formula = formulaOptions.value.find((f) => f.code === code)
  row.negFormula = formula?.description ?? ''
}

/** 新增配方 */
const handleAddLink = () => {
  formData.value.linkList.push({ formulaCode: '', negFormula: '' })
}

/** 删除配方 */
const handleDeleteLink = (index: number) => {
  formData.value.linkList.splice(index, 1)
}

/** 保存任务组并重新排产 */
const submitForm = async () => {
  if (!formData.value.id) return
  await formRef.value.validate()
  formLoading.value = true
  try {
    await updateTaskGroup({ ...formData.value })
    message.success('任务组已更新，已重新排产')
    dialogVisible.value = false
    await loadQueue()
    await loadGantt()
  } finally {
    formLoading.value = false
  }
}

// ============ 创建排产任务（新建任务组） ============
const createVisible = ref(false)
const createFormLoading = ref(false)
const createFormRef = ref()
const createFormData = ref<TaskGroupVO>({
  id: undefined,
  code: '',
  description: '',
  prio: undefined,
  planStart: '',
  planEnd: '',
  status: TaskGroupStatus.NEW,
  linkList: [] as TaskGroupLinkVO[]
})
const createFormRules = reactive({
  code: [{ required: true, message: '任务组编号不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '任务组描述不能为空', trigger: 'blur' }],
  prio: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  planStart: [{ required: true, message: '请选择计划开始时间', trigger: 'blur' }],
  planEnd: [{ required: true, message: '请选择计划完成时间', trigger: 'blur' }],
  formulaCode: [{ required: true, message: '配方编号不能为空', trigger: 'blur' }]
})

const openCreate = () => {
  createFormData.value = {
    id: undefined,
    code: '',
    description: '',
    prio: undefined,
    planStart: '',
    planEnd: '',
    status: TaskGroupStatus.NEW,
    linkList: [] as TaskGroupLinkVO[]
  }
  nextTick(() => createFormRef.value?.clearValidate?.())
  createVisible.value = true
}

const handleAddLinkCreate = () => {
  createFormData.value.linkList.push({ formulaCode: '', negFormula: '' })
}
const handleDeleteLinkCreate = (index: number) => {
  createFormData.value.linkList.splice(index, 1)
}
const handleCreateFormulaChange = (row: TaskGroupLinkVO, code?: string) => {
  const formula = formulaOptions.value.find((f) => f.code === code)
  row.negFormula = formula?.description ?? ''
}

const submitCreate = async () => {
  // 校验：至少关联一个配方，且配方编号不能为空
  if (!createFormData.value.linkList || !createFormData.value.linkList.some((l) => l.formulaCode)) {
    message.error('请至少关联一个配方')
    return
  }
  await createFormRef.value.validate()
  createFormLoading.value = true
  try {
    const data = { ...createFormData.value }
    data.planStart = toMs(data.planStart)
    data.planEnd = toMs(data.planEnd)
    await createTaskGroup(data)
    message.success('排产任务已创建')
    createVisible.value = false
    await loadQueue()
    await loadGantt()
  } finally {
    createFormLoading.value = false
  }
}

// ============ 排产规则（只读） ============
const rulesVisible = ref(false)
const rulesStartDate = ref(dayjs().format('YYYY-MM-DD'))
const rulesShiftFrom = ref('08:00')
const rulesShiftTo = ref('20:00')

// ============ 一键自动排产 ============
const autoLoading = ref(false)
const handleAuto = async () => {
  autoLoading.value = true
  try {
    const count = await autoSchedule()
    message.success(`已按优先级自动排产 ${count ?? 0} 道工序`)
    await loadQueue()
    await loadGantt()
  } finally {
    autoLoading.value = false
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
  filteredScheduleTasks.value.forEach((t) => {
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

type GanttRow = {
  key: string
  proc: string
  resource: string
  alternate: boolean
  bars: {
    id: any
    code: string
    status: string
    sim: string // 仿真状态类后缀：''/sim-done/sim-active
    left: number
    width: number
    title: string
  }[]
}
type GanttUnit = { kind: 'group'; key: string; name: string } | { kind: 'row'; key: string } & GanttRow

const ganttRows = computed<GanttUnit[]>(() => {
  const r = chartRange.value
  if (!r) return []
  // 按线路 → 工序 分组，先主线再合成段
  const buildLine = (line: string): GanttRow[] => {
    const tasks = filteredScheduleTasks.value.filter((t) => lineOfTask(t) === line)
    const byProc = new Map<string, ScheduleTaskVO[]>()
    tasks.forEach((t) => {
      const key = t.procName || '未命名工序'
      if (!byProc.has(key)) byProc.set(key, [])
      byProc.get(key)!.push(t)
    })
    const rows: GanttRow[] = []
    let idx = 0
    byProc.forEach((groupTasks, proc) => {
      const bars: GanttRow['bars'] = []
      groupTasks.forEach((t) => {
        const s = toMs(t.planStart)
        const e = toMs(t.planEnd)
        if (s == null || e == null) return
        const left = (s - r.start) / (3600 * 1000) * PX_PER_HOUR
        const width = Math.max(((e - s) / (3600 * 1000)) * PX_PER_HOUR, 14)
        bars.push({
          id: t.id,
          code: t.groupCode || t.formulaCode || '-',
          status: stKey(t.status),
          sim: simClassForTask(t.id),
          left,
          width,
          title: `${t.groupCode || ''} · ${t.procName || ''} · ${t.resource || ''}\n${dayjs(s).format('MM/DD HH:mm')} → ${dayjs(e).format('MM/DD HH:mm')} · ${t.status || '待排产'}`
        })
      })
      rows.push({
        key: proc + idx,
        proc,
        resource: uniq(groupTasks.map((x) => x.resource).filter(Boolean)).join(' / '),
        alternate: idx % 2 === 1,
        bars
      })
      idx++
    })
    return rows
  }
  const units: GanttUnit[] = []
  const main = buildLine('main')
  const synth = buildLine('synth')
  if (main.length) units.push({ kind: 'group', key: 'g-main', name: '主线' }, ...main)
  if (synth.length) units.push({ kind: 'group', key: 'g-synth', name: '合成段线' }, ...synth)
  return units
})

// 当前时间红色竖线（时间轴范围内才显示）
const nowX = computed(() => {
  const r = chartRange.value
  if (!r) return null
  const x = (Date.now() - r.start) / (3600 * 1000) * PX_PER_HOUR
  if (x < 0 || x > timelineW.value) return null
  return LABEL_W + x + 'px'
})

// ============ 排产仿真（前端模拟，无后台） ============
const SIM_STEP = 2 // 单步 2 小时
const simState = reactive({ cursor: 0, playing: false, started: false, timer: null as any })

// 仿真模型：对每个有时间任务计算偏移（相对全局最早 planStart）
const simModel = computed(() => {
  const tasks = scheduleTasks.value.filter((t) => toMs(t.planStart) != null && toMs(t.planEnd) != null)
  if (!tasks.length) return { tasks: [] as any[], minStart: 0, maxOff: 0 }
  const minStart = Math.min(...tasks.map((t) => toMs(t.planStart)!))
  const list = tasks.map((t) => {
    const startMs = toMs(t.planStart)!
    const endMs = toMs(t.planEnd)!
    return {
      id: t.id,
      section: t.procName || '未命名工序',
      resource: t.resource || '未分配',
      startOff: (startMs - minStart) / (3600 * 1000),
      endOff: (endMs - minStart) / (3600 * 1000)
    }
  })
  const maxOff = Math.max(...list.map((t) => t.endOff))
  return { tasks: list, minStart, maxOff }
})

const simComplete = computed(
  () => simModel.value.tasks.length > 0 && simSnapshot.value.done.length === simModel.value.tasks.length
)

const simSnapshot = computed(() => {
  const at = Math.max(0, Math.min(simState.cursor, simModel.value.maxOff))
  const ts = simModel.value.tasks
  const active = ts.filter((t) => t.startOff <= at && t.endOff > at)
  const done = ts.filter((t) => t.endOff <= at)
  const queued = ts.filter((t) => t.startOff > at)
  // 按资源聚合 active，统计其后排队工序
  const byRes = new Map<string, any[]>()
  active.forEach((t) => {
    if (!byRes.has(t.resource)) byRes.set(t.resource, [])
    byRes.get(t.resource)!.push(t)
  })
  const queues: { section: string; resource: string; taskCount: number }[] = []
  byRes.forEach((running, res) => {
    const waiting = queued.filter((t) => t.resource === res)
    if (!waiting.length) return
    queues.push({ section: running[0].section, resource: res, taskCount: waiting.length })
  })
  const progress = simModel.value.maxOff ? Math.round((at / simModel.value.maxOff) * 100) : 0
  return { at, active, done, queued, queues, progress }
})

// 仿真状态徽标
const simStateClass = computed(() =>
  !simState.started ? 'plan' : simComplete.value ? 'done' : simState.playing ? 'run' : 'pause'
)
const simStateText = computed(() =>
  !simState.started ? '准备就绪' : simComplete.value ? '仿真完成' : simState.playing ? '仿真运行中' : '仿真已暂停'
)
const simCursorText = computed(() =>
  simModel.value.tasks.length
    ? dayjs(simModel.value.minStart).add(simState.cursor, 'hour').format('MM/DD HH:mm')
    : '—'
)
const simActionLabel = computed(() =>
  !simState.started ? '开始仿真' : simState.playing ? '暂停' : '继续播放'
)
const simQueueText = computed(() => {
  const snap = simSnapshot.value
  if (!simState.started) return '点击「开始仿真」后，按 2 小时步长展示资源占用与排队。'
  if (!snap.queues.length) return '当前无资源排队，资源可按计划流转。'
  const head = snap.queues
    .slice(0, 2)
    .map((q) => `${q.section} · ${q.resource} 后有 ${q.taskCount} 道工序待用`)
    .join('；')
  return snap.queues.length > 2 ? `${head}；另有 ${snap.queues.length - 2} 项资源排队` : head
})

const stopSim = () => {
  if (simState.timer) clearInterval(simState.timer)
  simState.timer = null
  simState.playing = false
}
const resetSim = () => {
  stopSim()
  simState.cursor = 0
  simState.started = false
}
const playSim = () => {
  if (!simModel.value.tasks.length) return
  if (simState.cursor >= simModel.value.maxOff) resetSim()
  simState.started = true
  simState.playing = true
  if (simState.timer) clearInterval(simState.timer)
  simState.timer = setInterval(() => {
    simState.cursor = Math.min(simModel.value.maxOff, simState.cursor + SIM_STEP)
    if (simState.cursor >= simModel.value.maxOff) stopSim()
  }, 700)
}
const toggleSim = () => (simState.playing ? stopSim() : playSim())
const stepSim = () => {
  stopSim()
  if (!simModel.value.tasks.length) return
  if (simState.cursor >= simModel.value.maxOff) resetSim()
  simState.started = true
  simState.cursor = Math.min(simModel.value.maxOff, simState.cursor + SIM_STEP)
}
const replaySim = () => {
  resetSim()
  playSim()
}

// 由 task id 反查仿真状态类（未开始仿真返回空）
const simClassForTask = (id: any): string => {
  if (!simState.started) return ''
  const m = simModel.value.tasks.find((t) => t.id === id)
  if (!m) return ''
  if (m.endOff <= simState.cursor) return 'sim-done'
  if (m.startOff <= simState.cursor) return 'sim-active'
  return ''
}
// 仿真 cursor 竖线（甘特对应 x）
const simCursorX = computed(() => {
  if (!simState.started) return null
  const r = chartRange.value
  if (!r) return null
  const crMs = simModel.value.minStart + simState.cursor * 3600 * 1000
  const x = (crMs - r.start) / (3600 * 1000) * PX_PER_HOUR
  if (x < 0) return null
  return (LABEL_W + x) + 'px'
})

// 队列卡片 simStatus 跟随仿真实时切换（未开始保持后端值）
const cardSimLabel = (card: any) => {
  if (!simState.started) return { label: card.simStatus || '待仿真', cls: simClass(card.simStatus) }
  const code = card.code
  const ts = simModel.value.tasks.filter(
    (t) => scheduleTasks.value.find((x) => x.id === t.id)?.groupCode === code
  )
  if (ts.length && ts.every((t) => t.endOff <= simState.cursor)) return { label: '已完成', cls: 'done' }
  if (ts.some((t) => t.startOff <= simState.cursor && t.endOff > simState.cursor))
    return { label: '执行中', cls: 'run' }
  return { label: '待仿真', cls: 'wait' }
}

onUnmounted(stopSim)

// ============ 工具 ============
const toMs = (v?: any): number | null => {
  if (v == null || v === '') return null
  if (typeof v === 'number') return v
  // Date 对象直接取时间戳（勿走 String 路径，避免时区括号导致解析失败）
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.getTime()
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
  getFormulaOptions()
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

/* ---- 工具条（第一行按钮区 / 第二行筛选） ---- */
.sched-toolbar-cols {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* 第一行：按钮区靠右对齐，按钮间距统一 8px */
.sched-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
/* 顶部页面版头：左标题 + 右按钮 */
.page-title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-title {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}
.page-sub {
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--text-muted);
}
.tb-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
/* 第二行：筛选工具条垂直居中、横向 12px 间距 */
.sched-filters-row {
  display: flex;
  align-items: center;
}
.tb-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* ---- 排产规则弹窗 ---- */
.rule-sec-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  border-left: 3px solid var(--accent-blue);
  padding-left: 10px;
  margin-bottom: 10px;
}
.rule-calendar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  margin-bottom: 18px;
}
.rule-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.rule-field .rf-label {
  color: var(--text-secondary);
}
.rule-field .rf-value {
  font-weight: 600;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}
.rule-body {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 2;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 14px;
}
.rule-item b {
  color: var(--accent-blue);
  font-weight: 700;
}

/* ---- 线路分段按钮组 ---- */
.line-seg {
  display: inline-flex;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  overflow: hidden;
}
.line-seg button {
  border: 0;
  background: var(--bg-card);
  padding: 6px 14px;
  font-size: 12.5px;
  color: var(--text-secondary);
  cursor: pointer;
  border-right: 1px solid var(--border-color);
  transition: background 0.15s, color 0.15s;
}
.line-seg button:last-child {
  border-right: 0;
}
.line-seg button:hover {
  color: var(--text-primary);
  background: var(--bg-card-hover);
}
.line-seg button.active {
  background: color-mix(in srgb, var(--accent-blue) 16%, transparent);
  color: var(--accent-blue);
  font-weight: 700;
}

/* ---- 卡片线路标签 ---- */
.tag.line.line-main {
  color: var(--accent-blue);
  background: color-mix(in srgb, var(--accent-blue) 14%, transparent);
}
.tag.line.line-synth {
  color: var(--accent-purple);
  background: color-mix(in srgb, var(--accent-purple) 14%, transparent);
}

/* ---- 甘特线路分组标题行 ---- */
.g-grp-name,
.g-grp-r {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}
.g-grp-name {
  position: sticky;
  left: 0;
  z-index: 3;
  border-right: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--text-primary);
  min-height: 34px;
}
.g-grp-r {
  min-height: 34px;
  position: relative;
}

/* ---- 竖线（当前时间 / 仿真游标） ---- */
.g-cursor {
  position: absolute;
  top: 40px;
  bottom: 0;
  width: 2px;
  pointer-events: none;
  z-index: 2;
}
.g-cursor.now {
  background: var(--accent-red, var(--accent-orange));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent-red, var(--accent-orange)) 30%, transparent);
}
.g-cursor.sim {
  background: var(--accent-cyan);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent-cyan) 40%, transparent);
}

/* ---- 甘特条 hover / 仿真状态 / 行高亮 ---- */
.g-row:hover {
  background-color: color-mix(in srgb, var(--accent-blue) 6%, transparent);
}
.g-block.sim-done {
  opacity: 0.4;
}
.g-block.sim-active {
  box-shadow:
    0 0 0 2px var(--accent-cyan),
    0 0 12px 2px color-mix(in srgb, var(--accent-cyan) 55%, transparent);
  z-index: 3;
}

/* ---- 排产仿真面板 ---- */
.sim-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: var(--shadow-card);
}
.sim-main {
  flex: 1 1 480px;
}
.sim-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.sim-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}
.sim-state {
  padding: 1px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
}
.sim-state.sim-plan {
  color: var(--text-muted);
  background: var(--border-color);
}
.sim-state.sim-run {
  color: var(--accent-cyan);
  background: color-mix(in srgb, var(--accent-cyan) 15%, transparent);
}
.sim-state.sim-pause {
  color: var(--accent-orange);
  background: color-mix(in srgb, var(--accent-orange) 16%, transparent);
}
.sim-state.sim-done {
  color: var(--accent-green);
  background: color-mix(in srgb, var(--accent-green) 14%, transparent);
}
.sim-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: var(--text-secondary);
}
.sim-meta b {
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}
.sim-meta .keep {
  color: var(--text-muted);
}
.sim-progress {
  height: 6px;
  border-radius: 99px;
  background: var(--border-color);
  margin: 12px 0;
  overflow: hidden;
}
.sim-progress > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-orange), var(--accent-blue));
  transition: width 0.2s ease;
}
.sim-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.sim-stat b {
  display: block;
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.2;
}
.sim-stat span {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
}
.sim-queue {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.7;
}
.sim-queue b {
  color: var(--text-primary);
  margin-right: 6px;
}
.sim-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}
</style>