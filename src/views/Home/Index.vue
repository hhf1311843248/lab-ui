<template>
  <div class="tech-home">
    <!-- ===== 顶部展示 ===== -->
    <div class="showcase-top">
      <div>
        <div class="showcase-kicker">AI4S · AUTONOMOUS MATERIAL R&D · 7×24</div>
        <div class="showcase-title">电芯材料智能研发实验中心</div>
        <div class="showcase-sub">AI4S 驱动材料发现 · 虚拟验证筛选 · 自动化实验验证 · 数据持续反哺研发</div>
      </div>
      <div class="showcase-live">
        <span class="live-dot"></span>
        <b>7×24 实验中心在线</b>
        <span>·</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>

    <!-- ===== HERO: SVG R&D LOOP ===== -->
    <section class="hero-stage">
      <div class="hero-grid-bg"></div>
      <div class="hero-corner">R&D LOOP · REAL-TIME</div>
      <div class="hero-svg-wrap">
        <svg viewBox="0 0 960 340">
          <defs>
            <filter id="topoShadow"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,.06)" /></filter>
            <linearGradient id="flowGradO" x1="0" x2="1">
              <stop offset="0" stop-color="#F4A261" stop-opacity=".1" />
              <stop offset=".5" stop-color="#F4A261" stop-opacity=".6" />
              <stop offset="1" stop-color="#F4A261" stop-opacity=".1" />
            </linearGradient>
            <linearGradient id="flowGradB" x1="0" x2="1">
              <stop offset="0" stop-color="#5A82E6" stop-opacity=".1" />
              <stop offset=".5" stop-color="#5A82E6" stop-opacity=".5" />
              <stop offset="1" stop-color="#5A82E6" stop-opacity=".1" />
            </linearGradient>
          </defs>

          <!-- Orbit rings -->
          <ellipse class="orbit-ring orange" cx="480" cy="170" rx="340" ry="120" />
          <ellipse class="orbit-ring blue" cx="480" cy="170" rx="260" ry="88" />

          <!-- Flow paths -->
          <path class="flow-path orange flow-anim" d="M140 170 C240 80, 340 75, 400 140" stroke="url(#flowGradO)" />
          <path class="flow-path blue flow-anim" d="M400 140 C440 180, 520 180, 560 140" stroke="url(#flowGradB)" style="animation-delay:-.8s" />
          <path class="flow-path orange flow-anim" d="M560 140 C620 75, 720 80, 820 170" stroke="url(#flowGradO)" style="animation-delay:-1.6s" />
          <path class="flow-path green flow-anim" d="M820 170 C740 260, 600 280, 480 250 S280 260, 140 170" stroke="rgba(57,169,107,.3)" style="stroke-dasharray:4 10" />

          <!-- Center pulse -->
          <circle class="center-pulse" cx="480" cy="170" r="52" fill="rgba(244,162,97,.04)" stroke="rgba(244,162,97,.12)" stroke-width="1" />
          <circle cx="480" cy="170" r="32" fill="rgba(244,162,97,.03)" stroke="rgba(244,162,97,.08)" stroke-width="1" />

          <!-- Node: AI4S -->
          <g class="float-a" style="cursor:pointer">
            <circle class="node-circle-outer orange" cx="120" cy="170" r="42" filter="url(#topoShadow)" />
            <text class="node-icon" x="120" y="164">🧪</text>
            <text class="node-label" x="120" y="190">AI4S</text>
            <text class="node-sublabel" x="120" y="203">材料设计引擎</text>
            <rect class="node-stat-pill orange" x="82" y="224" width="76" height="22" />
            <text class="node-stat-text orange" x="120" y="238">{{ rdPlan }} 方案</text>
          </g>

          <!-- Node: V&V -->
          <g class="float-b" style="cursor:pointer">
            <circle class="node-circle-outer blue" cx="380" cy="110" r="38" filter="url(#topoShadow)" />
            <text class="node-icon" x="380" y="104">🔬</text>
            <text class="node-label" x="380" y="128">V&amp;V</text>
            <text class="node-sublabel" x="380" y="140">虚拟验证</text>
            <rect class="node-stat-pill blue" x="344" y="158" width="72" height="22" />
            <text class="node-stat-text blue" x="380" y="172">{{ vvPassText }} 通过</text>
          </g>

          <!-- Node: LAB -->
          <g class="float-a" style="cursor:pointer">
            <circle class="node-circle-outer green" cx="580" cy="110" r="38" filter="url(#topoShadow)" />
            <text class="node-icon" x="580" y="104">⚗️</text>
            <text class="node-label" x="580" y="128">LAB</text>
            <text class="node-sublabel" x="580" y="140">自动化实验</text>
            <rect class="node-stat-pill green" x="544" y="158" width="72" height="22" />
            <text class="node-stat-text green" x="580" y="172">{{ labRunning }} 执行中</text>
          </g>

          <!-- Node: DATA -->
          <g class="float-b" style="cursor:pointer">
            <circle class="node-circle-outer purple" cx="840" cy="170" r="42" filter="url(#topoShadow)" />
            <text class="node-icon" x="840" y="164">📊</text>
            <text class="node-label" x="840" y="190">DATA</text>
            <text class="node-sublabel" x="840" y="203">数据回流</text>
            <rect class="node-stat-pill purple" x="802" y="224" width="76" height="22" />
            <text class="node-stat-text purple" x="840" y="238">{{ kpi.storageSize }}</text>
          </g>

          <!-- Flow arrows -->
          <polygon points="268,108 278,104 274,114" fill="rgba(244,162,97,.5)" />
          <polygon points="478,168 488,164 484,174" fill="rgba(90,130,230,.4)" />
          <polygon points="698,108 708,104 704,114" fill="rgba(57,169,107,.4)" />
          <polygon points="480,262 490,258 486,268" fill="rgba(155,127,230,.3)" />
        </svg>
      </div>
      <div class="hero-center">
        <div class="hero-center-kicker">AUTONOMOUS R&amp;D LOOP</div>
        <div class="hero-center-badge">
          <span class="live-dot" style="width:6px;height:6px"></span>
          点击探索研发闭环详情
        </div>
      </div>
      <div class="hero-center-sub">从"提出假设"到"验证假设"，形成持续迭代的研发闭环</div>
    </section>

    <!-- ===== VISUAL KPI STRIP ===== -->
    <div class="kpi-strip">
      <div class="kpi orange">
        <div class="kpi-icon orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="#F4A261" stroke-width="2"><path d="M9 3L9 11L4 21H20L15 11V3" /><path d="M8 3H16" /><circle cx="12" cy="16" r="2" fill="#F4A261" opacity=".3" /></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-label">新材料</div>
          <div class="kpi-num">{{ kpi.newMaterial }}</div>
          <div class="kpi-trend up">+24 年度新增</div>
        </div>
      </div>
      <div class="kpi blue">
        <div class="kpi-icon blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="#5A82E6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 12H17M12 7V17" opacity=".5" /><circle cx="12" cy="12" r="3" fill="#5A82E6" opacity=".2" /></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-label">新配方</div>
          <div class="kpi-num">{{ kpi.newFormula }}</div>
          <div class="kpi-trend up">AI推荐 72 项</div>
        </div>
      </div>
      <div class="kpi green">
        <div class="kpi-icon green">
          <svg viewBox="0 0 24 24" fill="none" stroke="#39A96B" stroke-width="2"><path d="M9 12L11 14L15 10" /><circle cx="12" cy="12" r="9" /></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-label">验证配方</div>
          <div class="kpi-num">{{ kpi.verifyFormula }}</div>
          <div class="kpi-trend up">+18 近30天</div>
        </div>
      </div>
      <div class="kpi purple">
        <div class="kpi-icon purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="#9B7FE6" stroke-width="2"><path d="M12 3V21M3 12H21" /><circle cx="12" cy="12" r="4" fill="#9B7FE6" opacity=".15" /><circle cx="12" cy="12" r="9" /></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-label">虚拟验证通过率</div>
          <div class="kpi-num">{{ kpi.vvPassRate }}%</div>
          <div class="kpi-trend up">+4.8% 较上月</div>
        </div>
      </div>
      <div class="kpi orange">
        <div class="kpi-icon orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="#F4A261" stroke-width="2"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6V18C4 19.66 7.58 21 12 21S20 19.66 20 18V6" /><path d="M4 12C4 13.66 7.58 15 12 15S20 13.66 20 12" opacity=".4" /></svg>
        </div>
        <div class="kpi-info">
          <div class="kpi-label">实验数据</div>
          <div class="kpi-num">{{ kpi.storageSize }}</div>
          <div class="kpi-trend neutral">今日 +18.4 GB</div>
        </div>
      </div>
    </div>

    <!-- ===== MIDDLE: FUNNEL + GAUGES ===== -->
    <div class="show-grid">
      <section class="light-card">
        <div class="light-card-head">
          <h3>研发价值链 · 从 AI 假设到实验结论</h3>
          <span>点击查看详情 ›</span>
        </div>
        <div class="svg-funnel-wrap">
          <svg viewBox="0 0 520 180">
            <defs>
              <linearGradient id="funnelG1" x1="0" x2="1"><stop offset="0" stop-color="#F4A261" /><stop offset="1" stop-color="#F7D0AD" /></linearGradient>
              <linearGradient id="funnelG2" x1="0" x2="1"><stop offset="0" stop-color="#5A82E6" /><stop offset="1" stop-color="#8FADFF" /></linearGradient>
              <linearGradient id="funnelG3" x1="0" x2="1"><stop offset="0" stop-color="#39A96B" /><stop offset="1" stop-color="#6DD3A0" /></linearGradient>
              <linearGradient id="funnelG4" x1="0" x2="1"><stop offset="0" stop-color="#9B7FE6" /><stop offset="1" stop-color="#C4B5F5" /></linearGradient>
            </defs>
            <g v-for="stage in funnel" :key="stage.label">
              <path :d="stage.path" :fill="stage.fill" :opacity="stage.opacity" style="cursor:pointer" />
              <text x="260" :y="stage.y1" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">{{ stage.label }}</text>
              <text x="260" :y="stage.y2" text-anchor="middle" fill="#fff" font-size="10" opacity=".8">{{ stage.valueLine }}</text>
            </g>
            <text x="500" y="30" font-size="9" fill="#b06b35" font-weight="600">100%</text>
            <text x="500" y="78" font-size="9" fill="#4568c4" font-weight="600">82%</text>
            <text x="500" y="126" font-size="9" fill="#2d8555" font-weight="600">58%</text>
            <text x="500" y="166" font-size="9" fill="#7a62c8" font-weight="600">37%</text>
          </svg>
        </div>
      </section>

      <section class="light-card">
        <div class="light-card-head">
          <h3>7×24 实验中心运行态势</h3>
          <span>在线率 98.7% ›</span>
        </div>
        <div class="gauge-grid">
          <div v-for="(g, i) in gauges" :key="i" class="gauge-cell">
            <svg viewBox="0 0 100 100">
              <circle class="gauge-track" cx="50" cy="50" r="38" stroke-dasharray="190 239" transform="rotate(135 50 50)" />
              <circle class="gauge-fill" :class="['orange', 'blue', 'green', 'purple', 'orange'][i]" cx="50" cy="50" r="38" :stroke-dasharray="190 * g.value / 100 + ' 239'" transform="rotate(135 50 50)" />
              <text class="gauge-val" x="50" y="50" text-anchor="middle" dominant-baseline="central">{{ g.value }}%</text>
              <text x="50" y="68" text-anchor="middle" font-size="8" fill="#8ea3bf">{{ g.tasks }}</text>
            </svg>
            <div class="gauge-label">{{ g.label }}</div>
          </div>
        </div>
      </section>
    </div>

    <!-- ===== BOTTOM: TREND + TOPOLOGY + LIVE FEED ===== -->
    <div class="bottom-grid">
      <section class="light-card">
        <div class="light-card-head">
          <h3>近30天研发趋势</h3>
          <span>点击展开 ›</span>
        </div>
        <div class="trend-legend">
          <span><i style="background:#F4A261"></i>实验完成</span>
          <span><i style="background:#5A82E6"></i>配方验证</span>
        </div>
        <div class="trend-wrap">
          <svg viewBox="0 0 420 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trendAO" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#F4A261" stop-opacity=".25" /><stop offset="1" stop-color="#F4A261" stop-opacity="0" /></linearGradient>
              <linearGradient id="trendAB" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5A82E6" stop-opacity=".2" /><stop offset="1" stop-color="#5A82E6" stop-opacity="0" /></linearGradient>
            </defs>
            <line x1="0" y1="20" x2="420" y2="20" stroke="rgba(255,255,255,.08)" stroke-width=".5" />
            <line x1="0" y1="40" x2="420" y2="40" stroke="rgba(255,255,255,.08)" stroke-width=".5" />
            <line x1="0" y1="60" x2="420" y2="60" stroke="rgba(255,255,255,.08)" stroke-width=".5" />
            <polygon class="trend-area" fill="url(#trendAO)" :points="trend.exArea" />
            <polyline class="trend-line" stroke="#F4A261" :points="trend.exLine" />
            <polygon class="trend-area" fill="url(#trendAB)" :points="trend.fmArea" />
            <polyline class="trend-line" stroke="#5A82E6" :points="trend.fmLine" />
            <circle :cx="trend.exLast.x" :cy="trend.exLast.y" r="3" fill="#F4A261" />
            <circle :cx="trend.fmLast.x" :cy="trend.fmLast.y" r="3" fill="#5A82E6" />
          </svg>
        </div>
        <div class="trend-foot">
          <span>实验 <b>{{ trend.exSum }}</b></span>
          <span>配方 <b>{{ trend.fmSum }}</b></span>
          <span v-if="!useRealTrend" style="color:var(--success)">同比 +28%</span>
        </div>
      </section>

      <section class="light-card">
        <div class="light-card-head">
          <h3>{{ topoTitle }}</h3>
          <span>点击探索 ›</span>
        </div>
        <div class="topo-wrap">
          <svg viewBox="0 0 560 200">
            <g v-for="g in topoState.groups" :key="g.name">
              <text class="topo-section-label" :x="g.x" y="16">{{ g.name }}</text>
              <line :x1="g.x + 100" y1="8" :x2="g.x + 100" y2="195" class="topo-link" />
              <g v-for="n in g.nodes" :key="n.name" class="topo-node">
                <rect class="topo-node-bg" :class="n.status" :x="n.x" :y="n.y" width="42" height="32" />
                <text class="topo-icon" :x="n.x + 21" :y="n.y + 14">{{ n.icon }}</text>
                <text class="topo-name" :x="n.x + 21" :y="n.y + 42">{{ n.name }}</text>
              </g>
            </g>
            <!-- Status legend -->
            <circle cx="250" cy="190" r="4" fill="#39A96B" /><text x="258" y="193" font-size="8" fill="#8b949d">运行</text>
            <circle cx="290" cy="190" r="4" fill="#5A82E6" /><text x="298" y="193" font-size="8" fill="#8b949d">空闲</text>
            <circle cx="326" cy="190" r="4" fill="#D95C5C" /><text x="334" y="193" font-size="8" fill="#8b949d">报警</text>
            <circle cx="362" cy="190" r="4" fill="#EFAF3B" /><text x="370" y="193" font-size="8" fill="#8b949d">维保</text>
          </svg>
        </div>
      </section>

      <section class="light-card">
        <div class="light-card-head">
          <h3>实时研发动态</h3>
          <span>最近 24 小时</span>
        </div>
        <div class="insight-list">
          <div v-for="(d, idx) in dynamics" :key="idx" class="insight">
            <div>
              <div class="insight-main">{{ d.title }}</div>
              <div class="insight-sub">{{ d.desc }}</div>
            </div>
            <div class="insight-num">{{ d.time }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ScreenApi } from '@/api/lab/screen'

defineOptions({ name: 'Index' })

const home = reactive<any>({ kpi: {}, funnel: [], gauge: [], trend: [], topology: [], dynamic: [] })
const currentTime = ref('')

// ========== KPI（真实接口 + 原型示例兜底） ==========
const kpi = computed(() => ({
  newMaterial: home.kpi?.newMaterial ?? 86,
  newFormula: home.kpi?.newFormula ?? 214,
  verifyFormula: home.kpi?.verifyFormula ?? 137,
  vvPassRate: home.kpi?.vvPassRate ?? 91.6,
  storageSize: home.kpi?.storageSize ?? '2.86 TB'
}))

// Hero 节点统计
const vvPassText = computed(() => `${kpi.value.vvPassRate}%`)
const labRunning = computed(() => (home.kpi?.verifyFormula ?? 27))

// ========== 漏斗 ==========
const FALLBACK_FUNNEL = [
  { label: 'AI4S 推荐方案', value: 368, extra: null },
  { label: '虚拟验证任务', value: 302, extra: '通过率 82%' },
  { label: '实验室验证', value: 214, extra: '转化率 58%' },
  { label: '验证通过', value: 137, extra: null }
]
const funnel = computed(() => {
  const list = home.funnel && home.funnel.length ? home.funnel : FALLBACK_FUNNEL
  return list.slice(0, 4).map((item: any, idx: number) => {
    const pct = [1, 0.82, 0.58, 0.37][idx] ?? 1
    const yTop = 10 + idx * 48
    const yBot = idx === 3 ? yTop + 20 : yTop + 40
    const w = 460 * pct
    return {
      label: item.label,
      value: item.value ?? 0,
      extra: item.extra,
      valueLine: item.extra ? `${item.value} 项 · ${item.extra}` : `${item.value} 项`,
      yTop,
      y1: yTop + 18,
      y2: yTop + 33,
      opacity: [0.85, 0.8, 0.75, 0.7][idx],
      fill: 'url(#funnelG' + (idx + 1) + ')',
      path: `M ${260 - w / 2} ${yTop} L ${260 + w / 2} ${yTop} L ${260 + w * 0.435} ${yBot} L ${260 - w * 0.435} ${yBot} Z`
    }
  })
})

// Hero 节点统计：AI4S 推荐方案数（漏斗首级）
const rdPlan = computed(() => (funnel.value[0]?.value ?? 368))

// ========== 仪表盘 ==========
const DEFAULT_GAUGES = [
  { label: '材料合成段', value: 92, tasks: '12任务' },
  { label: '配方开发段', value: 88, tasks: '8任务' },
  { label: '模切组装段', value: 81, tasks: '5任务' },
  { label: '热压段', value: 86, tasks: '4任务' },
  { label: '测试段', value: 96, tasks: '9任务' }
]
const gauges = computed(() => {
  const list = home.gauge && home.gauge.length
    ? home.gauge.map((g: any) => ({ label: g.label, value: Math.round(g.value ?? 0), tasks: '' }))
    : []
  for (let i = list.length; i < 5; i++) list.push(DEFAULT_GAUGES[i])
  return list.slice(0, 5)
})

// ========== 趋势 ==========
const useRealTrend = ref(false)
const FALLBACK_TREND = {
  exLine: '0,58 42,52 84,55 126,40 168,44 210,30 252,35 294,20 336,24 378,14 420,16',
  exArea: '0,58 42,52 84,55 126,40 168,44 210,30 252,35 294,20 336,24 378,14 420,16 420,80 0,80',
  fmLine: '0,65 42,62 84,60 126,55 168,58 210,48 252,50 294,42 336,44 378,38 420,35',
  fmArea: '0,65 42,62 84,60 126,55 168,58 210,48 252,50 294,42 336,44 378,38 420,35 420,80 0,80',
  exLast: { x: 378, y: 14 },
  fmLast: { x: 378, y: 38 },
  exSum: 142,
  fmSum: 64
}
const trend = computed(() => {
  const t = home.trend || []
  if (t.length) {
    useRealTrend.value = true
    const n = t.length
    const step = 420 / (n - 1)
    const build = (vals: number[]) => {
      const max = Math.max(...vals, 1)
      const pts = vals.map((v, i) => ({
        x: Math.round(i * step),
        y: Math.round(80 - 20 - (v / max) * (80 - 34))
      }))
      const line = pts.map((p) => `${p.x},${p.y}`).join(' ')
      return {
        line,
        area: `${line} 420,80 0,80`,
        last: pts[pts.length - 1],
        sum: vals.reduce((a, b) => a + b, 0)
      }
    }
    const ex = build(t.map((p: any) => Number(p.result ?? 0)))
    const fm = build(t.map((p: any) => Number(p.formula ?? 0)))
    return { exLine: ex.line, exArea: ex.area, exLast: ex.last, fmLine: fm.line, fmArea: fm.area, fmLast: fm.last, exSum: ex.sum, fmSum: fm.sum }
  }
  useRealTrend.value = false
  return FALLBACK_TREND
})

// ========== 设备拓扑 ==========
const FALLBACK_TOPO: { name: string; section: string; status: string; icon: string }[] = [
  { name: '烧结炉#1', section: '材料合成', status: 'running', icon: '🔥' },
  { name: '烧结炉#2', section: '材料合成', status: 'running', icon: '🔥' },
  { name: '烧结炉#3', section: '材料合成', status: 'alarm', icon: '🔥' },
  { name: '混合机', section: '材料合成', status: 'running', icon: '⚙️' },
  { name: '粉碎机', section: '材料合成', status: 'running', icon: '⚡' },
  { name: 'XRD', section: '材料合成', status: 'idle', icon: '🔍' },
  { name: '手套箱A', section: '配方开发', status: 'running', icon: '🧤' },
  { name: '手套箱B', section: '配方开发', status: 'running', icon: '🧤' },
  { name: '合浆机', section: '配方开发', status: 'running', icon: '🌀' },
  { name: '涂布机#1', section: '配方开发', status: 'running', icon: '🖌️' },
  { name: '涂布机#2', section: '配方开发', status: 'maintenance', icon: '🔧' },
  { name: '烘干机', section: '配方开发', status: 'running', icon: '☀️' },
  { name: '模切机', section: '模切组装', status: 'running', icon: '✂️' },
  { name: '叠片机#1', section: '模切组装', status: 'running', icon: '📚' },
  { name: '叠片机#2', section: '模切组装', status: 'alarm', icon: '📚' },
  { name: '封装机', section: '模切组装', status: 'running', icon: '📦' },
  { name: '热压机#1', section: '热压', status: 'running', icon: '🗜️' },
  { name: '热压机#2', section: '热压', status: 'running', icon: '🗜️' },
  { name: '保压治具', section: '热压', status: 'running', icon: '🔧' },
  { name: '整形机', section: '热压', status: 'idle', icon: '📐' },
  { name: '测试柜#1', section: '测试', status: 'running', icon: '🔋' },
  { name: '测试柜#2', section: '测试', status: 'running', icon: '🔋' },
  { name: '测试柜#3', section: '测试', status: 'alarm', icon: '🔋' },
  { name: 'EIS', section: '测试', status: 'running', icon: '📈' }
]
const iconFor = (name: string) => {
  if (name.includes('烧结') || name.includes('炉')) return '🔥'
  if (name.includes('混合') || name.includes('合浆')) return '🌀'
  if (name.includes('粉碎')) return '⚡'
  if (name.includes('XRD')) return '🔍'
  if (name.includes('手套箱')) return '🧤'
  if (name.includes('涂布')) return '🖌️'
  if (name.includes('烘干')) return '☀️'
  if (name.includes('模切')) return '✂️'
  if (name.includes('叠片')) return '📚'
  if (name.includes('封装')) return '📦'
  if (name.includes('热压')) return '🗜️'
  if (name.includes('保压')) return '🔧'
  if (name.includes('整形')) return '📐'
  if (name.includes('测试') || name.includes('柜')) return '🔋'
  if (name.includes('EIS')) return '📈'
  return '⚙️'
}
const topoState = computed(() => {
  const nodes = home.topology && home.topology.length
    ? home.topology.map((n: any) => ({
        name: n.name,
        section: n.section || '其他',
        status: n.status || 'idle',
        icon: iconFor(n.name)
      }))
    : FALLBACK_TOPO
  // 按工段分组，预计算节点坐标（避免模板内对 v-for 索引做算术）
  const bySection: { name: string; nodes: typeof nodes }[] = []
  const map = new Map<string, typeof nodes>()
  nodes.forEach((n: any) => {
    if (!map.has(n.section)) {
      map.set(n.section, [])
      bySection.push({ name: n.section, nodes: map.get(n.section)! })
    }
    map.get(n.section)!.push(n)
  })
  const groups = bySection.slice(0, 5).map((s, gi) => ({
    name: s.name,
    x: 10 + gi * 110,
    nodes: s.nodes.slice(0, 6).map((n: any, ni: number) => ({
      name: n.name,
      section: n.section,
      status: n.status,
      icon: n.icon,
      x: 10 + gi * 110 + (ni % 2) * 48,
      y: 28 + Math.floor(ni / 2) * 52
    }))
  }))
  return { groups, total: nodes.length }
})
// 拓扑标题：兜底数据时按原型显示 5工段52台
const topoTitle = computed(() => {
  const useFallback = !(home.topology && home.topology.length)
  return useFallback
    ? '设备拓扑总览 · 5工段52台'
    : `设备拓扑总览 · ${topoState.value.groups.length}工段${topoState.value.total}台`
})

// ========== 实时动态 ==========
const FALLBACK_DYNAMIC = [
  { time: '08:42', level: '', title: 'AI4S-0112 进入实验验证', desc: '材料合成 · 称量工序' },
  { time: '08:18', level: '', title: 'VV-026 虚拟验证通过', desc: '推荐进入实验室验证' },
  { time: '07:51', level: '', title: '实验数据回流 AI4S', desc: '新增 1,284 条过程数据' },
  { time: '07:15', level: '', title: '烧结炉 #3 温度报警已恢复', desc: '材料合成段 · 自动恢复' }
]
const dynamics = computed(() => {
  const list = home.dynamic && home.dynamic.length ? home.dynamic : FALLBACK_DYNAMIC
  return list.slice(0, 6)
})

// ========== 数据加载 ==========
const load = async () => {
  try {
    const res = await ScreenApi.getHome()
    if (res) Object.assign(home, res)
  } catch (e) {
    console.error('大屏数据加载失败，使用原型示例数据', e)
  }
}

let timer: any = null
onMounted(() => {
  load()
  const pad = (n: number) => String(n).padStart(2, '0')
  const update = () => {
    const d = new Date()
    currentTime.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  update()
  timer = setInterval(update, 1000)
})
onUnmounted(() => timer && clearInterval(timer))
</script>

<style scoped>
.tech-home {
  --primary: #f4a261;
  --primary-2: #f7c59b;
  --primary-3: rgba(244, 162, 97, .14);
  --bg: #0e1420;
  --card: rgba(255, 255, 255, .04);
  --text: #e8eef7;
  --muted: #8ea3bf;
  --line: rgba(255, 255, 255, .08);
  --success: #39a96b;
  --success-bg: rgba(57, 169, 107, .12);
  --warn: #f4a261;
  --warn-bg: rgba(244, 162, 97, .14);
  --blue: #5a82e6;
  --blue-bg: rgba(90, 130, 230, .14);
  --danger: #e5534b;
  --danger-bg: rgba(229, 83, 75, .14);
  padding: 4px 0 28px;
  min-height: calc(100vh - 120px);
  background: radial-gradient(ellipse at 50% -20%, rgba(90, 130, 230, .12), transparent 60%), #0e1420;
  font-family: Inter, 'Microsoft YaHei', Arial, sans-serif;
  color: var(--text);
}
.showcase-top { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 16px; }
.showcase-kicker { font-size: 10px; letter-spacing: .25em; color: var(--primary); font-weight: 800; }
.showcase-title { font-size: 26px; font-weight: 800; letter-spacing: .02em; margin: 6px 0 4px; background: linear-gradient(90deg, #f4a261, #5a82e6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.showcase-sub { font-size: 12px; color: var(--muted); }
.showcase-live { display: flex; align-items: center; gap: 10px; border: 1px solid var(--line); padding: 8px 14px; border-radius: 999px; background: rgba(255, 255, 255, .05); font-size: 11px; color: #b9c8dc; box-shadow: 0 2px 8px rgba(0, 0, 0, .2); font-variant-numeric: tabular-nums; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #39a96b; box-shadow: 0 0 0 4px rgba(57, 169, 107, .12); animation: livePulse 2s ease-in-out infinite; flex-shrink: 0; }
@keyframes livePulse { 0%, 100% { box-shadow: 0 0 0 4px rgba(57, 169, 107, .12); } 50% { box-shadow: 0 0 0 8px rgba(57, 169, 107, .06); } }

/* ===== HERO ===== */
.hero-stage { position: relative; min-height: 380px; border: 1px solid var(--line); border-radius: 20px; overflow: hidden; background: radial-gradient(circle at 30% 50%, rgba(244, 162, 97, .07), transparent 40%), radial-gradient(circle at 70% 50%, rgba(90, 130, 230, .06), transparent 40%), rgba(255, 255, 255, .02); box-shadow: 0 12px 40px rgba(0, 0, 0, .3); }
.hero-stage::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 50%, rgba(244, 162, 97, .06), transparent 40%), radial-gradient(circle at 70% 50%, rgba(90, 130, 230, .05), transparent 40%); pointer-events: none; }
.hero-grid-bg { position: absolute; inset: 0; opacity: .3; background-image: linear-gradient(rgba(244, 162, 97, .08) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 162, 97, .08) 1px, transparent 1px); background-size: 40px 40px; -webkit-mask-image: radial-gradient(circle at 50% 50%, black 20%, transparent 70%); mask-image: radial-gradient(circle at 50% 50%, black 20%, transparent 70%); pointer-events: none; }
.hero-svg-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.hero-svg-wrap svg { width: 92%; height: 90%; max-width: 960px; }
.hero-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; }
.hero-center-kicker { font-size: 10px; letter-spacing: .24em; color: var(--primary); }
.hero-center-sub { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); font-size: 11px; color: var(--muted); text-align: center; white-space: nowrap; }
.hero-center-badge { display: inline-flex; gap: 7px; align-items: center; margin-top: 10px; padding: 5px 10px; border-radius: 99px; background: rgba(244, 162, 97, .1); border: 1px solid rgba(244, 162, 97, .3); color: #f4a261; font-size: 9px; }
.hero-corner { position: absolute; top: 16px; right: 18px; font-size: 10px; color: #6b7a90; letter-spacing: .08em; }

.node-circle-outer { fill: #1a2433; stroke-width: 2; }
.node-circle-outer.orange { stroke: #f4a261; }
.node-circle-outer.blue { stroke: #5a82e6; }
.node-circle-outer.green { stroke: #39a96b; }
.node-circle-outer.purple { stroke: #9b7fe6; }
.node-icon { font-size: 22px; dominant-baseline: central; text-anchor: middle; }
.node-label { font-size: 13px; font-weight: 700; fill: #dbe6f5; text-anchor: middle; }
.node-sublabel { font-size: 9px; fill: #8ea3bf; text-anchor: middle; }
.node-stat-pill { rx: 10; ry: 10; fill: #141c28; stroke-width: 1; }
.node-stat-pill.orange { stroke: #f4a261; fill: rgba(244, 162, 97, .12); }
.node-stat-pill.blue { stroke: #5a82e6; fill: rgba(90, 130, 230, .12); }
.node-stat-pill.green { stroke: #39a96b; fill: rgba(57, 169, 107, .12); }
.node-stat-pill.purple { stroke: #9b7fe6; fill: rgba(155, 127, 230, .12); }
.node-stat-text { font-size: 9px; font-weight: 700; text-anchor: middle; }
.node-stat-text.orange { fill: #f4a261; }
.node-stat-text.blue { fill: #7d9cf0; }
.node-stat-text.green { fill: #39a96b; }
.node-stat-text.purple { fill: #b39dee; }

.flow-path { fill: none; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 6 8; }
.flow-path.orange { stroke: rgba(244, 162, 97, .55); }
.flow-path.blue { stroke: rgba(90, 130, 230, .5); }
.flow-path.green { stroke: rgba(57, 169, 107, .45); }
.flow-anim { animation: dashFlow 6s linear infinite; }
@keyframes dashFlow { to { stroke-dashoffset: -140; } }

.orbit-ring { fill: none; stroke-dasharray: 3 10; stroke-width: 1; }
.orbit-ring.orange { stroke: rgba(244, 162, 97, .25); }
.orbit-ring.blue { stroke: rgba(90, 130, 230, .2); }
.center-pulse { animation: cPulse 3s ease-in-out infinite; }
@keyframes cPulse { 0%, 100% { opacity: .5; r: 52; } 50% { opacity: .8; r: 58; } }

.float-a { animation: floatA 5s ease-in-out infinite; }
.float-b { animation: floatB 6s ease-in-out infinite reverse; }
@keyframes floatA { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes floatB { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

/* ===== KPI ===== */
.kpi-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 14px; }
.kpi { position: relative; background: rgba(255, 255, 255, .04); border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; box-shadow: 0 4px 16px rgba(0, 0, 0, .25); cursor: pointer; overflow: hidden; transition: .18s; display: flex; align-items: center; gap: 12px; }
.kpi:hover { transform: translateY(-2px); border-color: rgba(244, 162, 97, .4); box-shadow: 0 8px 24px rgba(0, 0, 0, .35); }
.kpi-icon { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; flex-shrink: 0; }
.kpi-icon.orange { background: rgba(244, 162, 97, .14); }
.kpi-icon.blue { background: rgba(90, 130, 230, .16); }
.kpi-icon.green { background: rgba(57, 169, 107, .14); }
.kpi-icon.purple { background: rgba(155, 127, 230, .16); }
.kpi-icon svg { width: 20px; height: 20px; }
.kpi-info { flex: 1; min-width: 0; }
.kpi-label { font-size: 10px; color: var(--muted); letter-spacing: .03em; }
.kpi-num { font-size: 20px; font-weight: 800; margin-top: 2px; color: var(--text); }
.kpi.orange .kpi-num { color: #f4a261; }
.kpi.blue .kpi-num { color: #5a82e6; }
.kpi.green .kpi-num { color: #39a96b; }
.kpi.purple .kpi-num { color: #9b7fe6; }
.kpi-trend { font-size: 9px; margin-top: 2px; }
.kpi-trend.up { color: var(--success); }
.kpi-trend.neutral { color: var(--muted); }

/* ===== 卡片 ===== */
.show-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-top: 14px; }
.bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 12px; }
.light-card { background: rgba(255, 255, 255, .04); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 4px 16px rgba(0, 0, 0, .25); overflow: hidden; cursor: pointer; transition: all .18s; }
.light-card:hover { box-shadow: 0 8px 28px rgba(0, 0, 0, .4); border-color: rgba(244, 162, 97, .4); }
.light-card-head { padding: 13px 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, .06); }
.light-card-head h3 { margin: 0; font-size: 13px; color: #dbe6f5; }
.light-card-head span { font-size: 10px; color: #8ea3bf; }

/* ===== 漏斗 ===== */
.svg-funnel-wrap { padding: 16px 20px; }
.svg-funnel-wrap svg { width: 100%; height: auto; }

/* ===== 仪表盘 ===== */
.gauge-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; padding: 12px 6px 16px; }
.gauge-cell { text-align: center; cursor: pointer; transition: transform .15s; }
.gauge-cell:hover { transform: scale(1.04); }
.gauge-cell svg { width: 100%; max-width: 88px; }
.gauge-label { font-size: 11px; color: var(--muted); margin-top: 4px; }
.gauge-val { font-size: 16px; font-weight: 800; fill: var(--text); }
.gauge-track { fill: none; stroke: rgba(255, 255, 255, .12); stroke-width: 8; stroke-linecap: round; }
.gauge-fill { fill: none; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1.5s ease-out; }
.gauge-fill.orange { stroke: #f4a261; }
.gauge-fill.blue { stroke: #5a82e6; }
.gauge-fill.green { stroke: #39a96b; }
.gauge-fill.purple { stroke: #9b7fe6; }

/* ===== 趋势 ===== */
.trend-wrap { padding: 0 14px 10px; }
.trend-wrap svg { width: 100%; height: 80px; }
.trend-line { fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.trend-area { opacity: .15; }
.trend-legend { display: flex; gap: 16px; padding: 10px 14px 6px; font-size: 10px; color: var(--muted); }
.trend-legend i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; vertical-align: middle; }
.trend-foot { display: flex; justify-content: space-between; padding: 0 14px 10px; font-size: 10px; color: var(--muted); }
.trend-foot b { color: var(--text); }

/* ===== 拓扑 ===== */
.topo-wrap { padding: 12px 16px 16px; }
.topo-wrap svg { width: 100%; height: auto; }
.topo-node { cursor: pointer; transition: transform .15s; }
.topo-node:hover { transform: scale(1.08); }
.topo-node-bg { fill: #1a2433; stroke-width: 1.5; rx: 8; ry: 8; }
.topo-node-bg.running { stroke: #39a96b; }
.topo-node-bg.idle { stroke: #5a82e6; }
.topo-node-bg.alarm { stroke: #e5534b; animation: alarmPulse 1.5s infinite; }
.topo-node-bg.maintenance { stroke: #f4a261; }
@keyframes alarmPulse { 0%, 100% { stroke-opacity: 1; } 50% { stroke-opacity: .4; } }
.topo-icon { font-size: 14px; text-anchor: middle; dominant-baseline: central; }
.topo-name { font-size: 8px; fill: #8ea3bf; text-anchor: middle; }
.topo-section-label { font-size: 10px; fill: #8ea3bf; font-weight: 600; letter-spacing: .04em; }
.topo-link { stroke: rgba(255, 255, 255, .1); stroke-width: 1; stroke-dasharray: 3 4; }

/* ===== 动态 ===== */
.insight-list { padding: 4px 0; }
.insight { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; padding: 10px 14px; border-bottom: 1px solid rgba(255, 255, 255, .06); cursor: pointer; transition: background .15s; }
.insight:hover { background: rgba(244, 162, 97, .06); }
.insight:last-child { border-bottom: 0; }
.insight-main { font-size: 11px; font-weight: 650; color: #dbe6f5; }
.insight-sub { font-size: 9px; color: #8ea3bf; margin-top: 3px; }
.insight-num { font-size: 12px; font-weight: 800; color: #f4a261; }

@media (max-width: 1200px) {
  .kpi-strip { grid-template-columns: repeat(3, 1fr); }
  .show-grid, .bottom-grid { grid-template-columns: 1fr; }
  .gauge-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
