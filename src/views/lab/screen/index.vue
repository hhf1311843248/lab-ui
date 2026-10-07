<template>
  <div class="lab-screen">
    <!-- 顶部标题栏 -->
    <div class="screen-header">
      <div class="header-left">
        <div class="header-title">电芯材料智能研发实验中心</div>
        <div class="header-sub">AI4S 驱动材料发现 · 虚拟验证筛选 · 自动化实验验证 · 数据持续反哺研发</div>
      </div>
      <div class="header-right">
        <span class="live-dot"></span>
        <b>7×24 实验中心在线</b>
        <span>·</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>

    <!-- KPI 条 -->
    <div class="kpi-strip">
      <div class="kpi-card orange">
        <div class="kpi-label">新材料</div>
        <div class="kpi-num">{{ home.kpi?.newMaterial ?? '--' }}</div>
        <div class="kpi-trend up">研发分类·材料开发</div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-label">新配方</div>
        <div class="kpi-num">{{ home.kpi?.newFormula ?? '--' }}</div>
        <div class="kpi-trend up">配方总数</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-label">验证配方</div>
        <div class="kpi-num">{{ home.kpi?.verifyFormula ?? '--' }}</div>
        <div class="kpi-trend up">已下达/生产中</div>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-label">综合合格率</div>
        <div class="kpi-num">{{ home.kpi?.vvPassRate ?? '--' }}%</div>
        <div class="kpi-trend up">实验结果判定</div>
      </div>
      <div class="kpi-card orange">
        <div class="kpi-label">实验数据</div>
        <div class="kpi-num">{{ home.kpi?.storageSize ?? '--' }}</div>
        <div class="kpi-trend neutral">累计数据量</div>
      </div>
    </div>

    <!-- 中部：研发闭环 + 漏斗 -->
    <div class="screen-mid">
      <div class="light-card loop-card">
        <div class="card-head">
          <h3>研发闭环 · 从 AI 假设到实验结论</h3>
          <span class="corner">R&D LOOP · REAL-TIME</span>
        </div>
        <svg viewBox="0 0 960 300" class="loop-svg">
          <defs>
            <linearGradient id="loopGradO" x1="0" x2="1"><stop offset="0" stop-color="#F4A261" stop-opacity=".1"/><stop offset=".5" stop-color="#F4A261" stop-opacity=".6"/><stop offset="1" stop-color="#F4A261" stop-opacity=".1"/></linearGradient>
            <linearGradient id="loopGradB" x1="0" x2="1"><stop offset="0" stop-color="#5A82E6" stop-opacity=".1"/><stop offset=".5" stop-color="#5A82E6" stop-opacity=".5"/><stop offset="1" stop-color="#5A82E6" stop-opacity=".1"/></linearGradient>
          </defs>
          <ellipse class="orbit-ring orange" cx="480" cy="150" rx="340" ry="105"/>
          <ellipse class="orbit-ring blue" cx="480" cy="150" rx="260" ry="76"/>
          <path class="flow-path orange" d="M140 150 C240 65, 340 60, 400 125" stroke="url(#loopGradO)"/>
          <path class="flow-path blue" d="M400 125 C440 165, 520 165, 560 125" stroke="url(#loopGradB)"/>
          <path class="flow-path orange" d="M560 125 C620 60, 720 65, 820 150" stroke="url(#loopGradO)"/>
          <path class="flow-path green" d="M820 150 C740 240, 600 255, 480 225 S280 240, 140 150" stroke="rgba(57,169,107,.3)"/>
          <!-- AI4S -->
          <circle cx="120" cy="150" r="40" class="node-outer orange"/>
          <text x="120" y="147" class="node-icon" text-anchor="middle">🧪</text>
          <text x="120" y="172" class="node-label" text-anchor="middle">AI4S</text>
          <text x="120" y="188" class="node-sublabel" text-anchor="middle">材料设计引擎</text>
          <text x="120" y="212" class="node-stat orange" text-anchor="middle">{{ rdTotal }} 方案</text>
          <!-- V&V -->
          <circle cx="380" cy="95" r="36" class="node-outer blue"/>
          <text x="380" y="92" class="node-icon" text-anchor="middle">🔬</text>
          <text x="380" y="115" class="node-label" text-anchor="middle">V&V</text>
          <text x="380" y="131" class="node-sublabel" text-anchor="middle">虚拟验证</text>
          <text x="380" y="155" class="node-stat blue" text-anchor="middle">{{ passRate }}% 通过</text>
          <!-- LAB -->
          <circle cx="580" cy="95" r="36" class="node-outer green"/>
          <text x="580" y="92" class="node-icon" text-anchor="middle">⚗️</text>
          <text x="580" y="115" class="node-label" text-anchor="middle">LAB</text>
          <text x="580" y="131" class="node-sublabel" text-anchor="middle">自动化实验</text>
          <text x="580" y="155" class="node-stat green" text-anchor="middle">{{ runningTask }} 执行中</text>
          <!-- DATA -->
          <circle cx="840" cy="150" r="40" class="node-outer purple"/>
          <text x="840" y="147" class="node-icon" text-anchor="middle">📊</text>
          <text x="840" y="172" class="node-label" text-anchor="middle">DATA</text>
          <text x="840" y="188" class="node-sublabel" text-anchor="middle">数据回流</text>
          <text x="840" y="212" class="node-stat purple" text-anchor="middle">{{ home.kpi?.storageSize }}</text>
        </svg>
      </div>

      <div class="light-card funnel-card">
        <div class="card-head">
          <h3>研发价值链 · 从 AI 假设到实验结论</h3>
        </div>
        <div class="funnel-wrap">
          <div v-for="(item, idx) in home.funnel" :key="idx" class="funnel-stage" :style="{ width: (100 - idx * 14) + '%' }">
            <div class="funnel-bar" :class="'bar-' + idx">
              <span class="funnel-label">{{ item.label }}</span>
              <span class="funnel-value">{{ item.value }} 项 <em v-if="item.extra">{{ item.extra }}</em></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部：仪表盘 + 趋势 + 拓扑 + 动态 -->
    <div class="screen-bottom">
      <div class="light-card gauge-card">
        <div class="card-head"><h3>运营仪表盘</h3></div>
        <EChart :options="gaugeOptions" height="180px" />
      </div>

      <div class="light-card trend-card">
        <div class="card-head"><h3>近 7 天研发趋势</h3></div>
        <EChart :options="trendOptions" height="180px" />
      </div>

      <div class="light-card topo-card">
        <div class="card-head"><h3>设备状态监控</h3></div>
        <div class="topo-grid">
          <div v-for="node in home.topology" :key="node.name" class="topo-node" :class="node.status">
            <span class="dot"></span>
            <span class="name">{{ node.name }}</span>
            <span class="sec">{{ node.section }}</span>
          </div>
        </div>
      </div>

      <div class="light-card dynamic-card">
        <div class="card-head"><h3>实时动态</h3></div>
        <div class="dynamic-list">
          <div v-for="(d, idx) in home.dynamic" :key="idx" class="dynamic-item">
            <span class="d-time">{{ d.time }}</span>
            <span class="d-level" :class="d.level">{{ levelText(d.level) }}</span>
            <div class="d-body">
              <div class="d-title">{{ d.title }}</div>
              <div class="d-desc">{{ d.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ScreenApi } from '@/api/lab/screen'
import EChart from '@/components/Echart/src/Echart.vue'

const home = reactive<any>({ kpi: {}, funnel: [], gauge: [], trend: [], topology: [], dynamic: [] })
const currentTime = ref('')

const rdTotal = computed(() => home.kpi?.newFormula ?? 0)
const passRate = computed(() => home.kpi?.vvPassRate ?? 0)
const runningTask = computed(() => home.funnel?.length ? (home.funnel[1]?.value ?? 0) : 0)

// 仪表盘
const gaugeOptions = computed(() => {
  const gauge = home.gauge || []
  const series = gauge.map((g: any, i: number) => ({
    name: g.label,
    type: 'gauge',
    radius: '90%',
    center: [['18%', '50%'], ['50%', '50%'], ['82%', '50%']][i % 3] || ['50%', '50%'],
    startAngle: 220, endAngle: -40,
    min: 0, max: 100,
    progress: { show: true, width: 10, itemStyle: { color: ['#F4A261', '#5A82E6', '#39A96B'][i % 3] } },
    axisLine: { lineStyle: { width: 10, color: [[1, 'rgba(255,255,255,.08)']] } },
    axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
    pointer: { show: false },
    title: { fontSize: 11, color: '#8ea3bf', offsetCenter: [0, '70%'] },
    detail: { valueAnimation: true, fontSize: 20, fontWeight: 'bold', color: '#fff', offsetCenter: [0, '20%'], formatter: '{value}%' },
    data: [{ value: g.value }]
  }))
  return { series }
})

// 趋势
const trendOptions = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['新配方', '实验结果'], textStyle: { color: '#8ea3bf' } },
  grid: { left: 30, right: 15, top: 30, bottom: 20 },
  xAxis: { type: 'category', data: home.trend.map((t: any) => t.date), axisLabel: { color: '#8ea3bf' } },
  yAxis: { type: 'value', axisLabel: { color: '#8ea3bf' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.06)' } } },
  series: [
    { name: '新配方', type: 'bar', barWidth: 10, itemStyle: { color: '#5A82E6', borderRadius: 3 }, data: home.trend.map((t: any) => t.formula) },
    { name: '实验结果', type: 'line', smooth: true, itemStyle: { color: '#39A96B' }, areaStyle: { opacity: .15 }, data: home.trend.map((t: any) => t.result) }
  ]
}))

const levelText = (level: string) => {
  const map: any = { 紧急: '紧急', 重要: '重要', 一般: '一般', task: '任务' }
  return map[level] || level || '信息'
}

const load = async () => {
  try {
    const res = await ScreenApi.getHome()
    Object.assign(home, res || {})
  } catch (e) {
    console.error('大屏数据加载失败', e)
  }
}

let timer: any = null
onMounted(() => {
  load()
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleString('zh-CN', { hour12: false })
  }, 1000)
})
onUnmounted(() => timer && clearInterval(timer))
</script>

<style scoped>
.lab-screen {
  min-height: 100%;
  padding: 16px;
  background: radial-gradient(ellipse at 50% -20%, rgba(90,130,230,.12), transparent 60%), #0e1420;
  color: #e8eef7;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.screen-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, rgba(90,130,230,.15), rgba(244,162,97,.1));
  border: 1px solid rgba(90,130,230,.3);
  border-radius: 10px;
}
.header-title { font-size: 22px; font-weight: 700; letter-spacing: 2px; background: linear-gradient(90deg, #F4A261, #5A82E6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.header-sub { font-size: 12px; color: #8ea3bf; margin-top: 4px; }
.header-right { display: flex; gap: 10px; align-items: center; font-size: 13px; color: #b9c8dc; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #39A96B; animation: pulse 1.6s infinite; }
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .3 } }

.kpi-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.kpi-card { padding: 14px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.04); }
.kpi-card.orange { border-top: 3px solid #F4A261 } .kpi-card.blue { border-top: 3px solid #5A82E6 }
.kpi-card.green { border-top: 3px solid #39A96B } .kpi-card.purple { border-top: 3px solid #9B7FE6 }
.kpi-label { font-size: 12px; color: #8ea3bf; }
.kpi-num { font-size: 26px; font-weight: 700; margin: 4px 0; }
.kpi-card.orange .kpi-num { color: #F4A261 } .kpi-card.blue .kpi-num { color: #5A82E6 }
.kpi-card.green .kpi-num { color: #39A96B } .kpi-card.purple .kpi-num { color: #9B7FE6 }
.kpi-trend { font-size: 11px; color: #39A96B }
.kpi-trend.neutral { color: #8ea3bf }

.screen-mid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 14px; }
.light-card { border-radius: 10px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.04); padding: 12px 14px; }
.card-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
.card-head h3 { font-size: 14px; margin: 0; color: #dbe6f5; }
.corner { font-size: 10px; color: #8ea3bf; letter-spacing: 1px; }
.loop-svg { width: 100%; height: auto; }
.orbit-ring { fill: none; stroke-width: 1; }
.orbit-ring.orange { stroke: rgba(244,162,97,.25) } .orbit-ring.blue { stroke: rgba(90,130,230,.2) }
.flow-path { fill: none; stroke-width: 2; animation: dash 6s linear infinite; }
@keyframes dash { to { stroke-dashoffset: -40 } }
.node-outer { stroke-width: 1; }
.node-outer.orange { fill: rgba(244,162,97,.08); stroke: rgba(244,162,97,.5) }
.node-outer.blue { fill: rgba(90,130,230,.08); stroke: rgba(90,130,230,.5) }
.node-outer.green { fill: rgba(57,169,107,.08); stroke: rgba(57,169,107,.5) }
.node-outer.purple { fill: rgba(155,127,230,.08); stroke: rgba(155,127,230,.5) }
.node-icon { font-size: 16px; } .node-label { font-size: 12px; fill: #dbe6f5; font-weight: 700; }
.node-sublabel { font-size: 9px; fill: #8ea3bf; }
.node-stat { font-size: 11px; font-weight: 700; }
.node-stat.orange { fill: #F4A261 } .node-stat.blue { fill: #5A82E6 } .node-stat.green { fill: #39A96B } .node-stat.purple { fill: #9B7FE6 }

.funnel-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 6px; }
.funnel-stage { display: flex; justify-content: center; }
.funnel-bar { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-radius: 4px; font-size: 12px; color: #fff; min-width: 180px; }
.funnel-bar.bar-0 { background: linear-gradient(90deg, #F4A261, #F7D0AD) } .funnel-bar.bar-1 { background: linear-gradient(90deg, #5A82E6, #8FADFF) }
.funnel-bar.bar-2 { background: linear-gradient(90deg, #39A96B, #6DD3A0) } .funnel-bar.bar-3 { background: linear-gradient(90deg, #9B7FE6, #C4B5F5) }
.funnel-value em { font-style: normal; opacity: .85; font-size: 11px; margin-left: 6px; }

.screen-bottom { display: grid; grid-template-columns: 1.1fr 1.3fr 1.2fr 1.1fr; gap: 14px; }
.topo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-height: 200px; overflow: auto; }
.topo-node { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); font-size: 11px; }
.topo-node .dot { width: 7px; height: 7px; border-radius: 50%; background: #8ea3bf; }
.topo-node.running .dot { background: #39A96B; box-shadow: 0 0 6px #39A96B }
.topo-node.alarm .dot { background: #e5534b; box-shadow: 0 0 6px #e5534b }
.topo-node.maintenance .dot { background: #F4A261; box-shadow: 0 0 6px #F4A261 }
.topo-node .name { color: #dbe6f5; }
.topo-node .sec { color: #8ea3bf; margin-left: auto; font-size: 10px; }

.dynamic-list { max-height: 200px; overflow: auto; display: flex; flex-direction: column; gap: 8px; }
.dynamic-item { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; border-bottom: 1px dashed rgba(255,255,255,.06); padding-bottom: 6px; }
.d-time { color: #8ea3bf; white-space: nowrap; }
.d-level { padding: 0 6px; border-radius: 3px; font-size: 10px; color: #fff; white-space: nowrap; }
.d-level.紧急 { background: #e5534b } .d-level.重要 { background: #F4A261 } .d-level.一般 { background: #5A82E6 } .d-level.task { background: #39A96B }
.d-title { color: #dbe6f5; } .d-desc { color: #8ea3bf; font-size: 11px; }
</style>
