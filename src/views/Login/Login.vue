<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px"
  >
    <!-- 双主题自适应背景：浅色=暖橙实验室风，深色=科技暗蓝风 -->
    <div class="login-bg" aria-hidden="true">
      <!-- 主题渐变底层 -->
      <div class="login-bg__base"></div>
      <!-- 微纹理（碳纹/网格，随主题） -->
      <div class="login-bg__grid"></div>
      <!-- 光束切角 -->
      <div class="login-bg__sheen"></div>
      <!-- 环境光晕 -->
      <div class="login-bg__glow login-bg__glow-a"></div>
      <div class="login-bg__glow login-bg__glow-b"></div>
      <div class="login-bg__glow login-bg__glow-c"></div>

      <!-- 研发闭环主题插图：AI4S → V&V → LAB → DATA -->
      <svg class="login-bg__svg" viewBox="0 0 760 660" fill="none">
        <defs>
          <linearGradient id="rdFlowO" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="var(--rd-o)" stop-opacity=".12" />
            <stop offset=".5" stop-color="var(--rd-o)" stop-opacity=".72" />
            <stop offset="1" stop-color="var(--rd-o)" stop-opacity=".12" />
          </linearGradient>
          <linearGradient id="rdFlowB" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="var(--rd-b)" stop-opacity=".12" />
            <stop offset=".5" stop-color="var(--rd-b)" stop-opacity=".6" />
            <stop offset="1" stop-color="var(--rd-b)" stop-opacity=".12" />
          </linearGradient>
          <radialGradient id="rdCoreGlow">
            <stop offset="0%" stop-color="var(--rd-core)" stop-opacity=".8" />
            <stop offset="100%" stop-color="var(--rd-core)" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- 核心辉光 -->
        <circle class="rd-halo" cx="300" cy="330" r="190" />
        <circle class="rd-halo rd-halo-sm" cx="300" cy="330" r="120" />

        <!-- 轨道 -->
        <ellipse class="rd-orbit rd-orbit-o" cx="300" cy="330" rx="232" ry="150" />
        <ellipse class="rd-orbit rd-orbit-b" cx="300" cy="330" rx="158" ry="100" />

        <!-- 流动路径（研发闭环） -->
        <path class="rd-flow" d="M140 186 C 245 120, 355 118, 462 162" stroke="url(#rdFlowO)" />
        <path class="rd-flow rd-flow-b" d="M462 162 C 520 262, 524 396, 470 502" stroke="url(#rdFlowB)" />
        <path class="rd-flow" d="M470 502 C 362 552, 238 552, 140 502" stroke="url(#rdFlowO)" style="animation-delay:-3s" />
        <path class="rd-flow rd-flow-b" d="M140 502 C 88 396, 88 262, 140 186" stroke="url(#rdFlowB)" style="animation-delay:-6s" />

        <!-- 流动粒子 -->
        <circle class="rd-flow-dot" cx="300" cy="128" r="3.5" />
        <circle class="rd-flow-dot rt" cx="300" cy="545" r="3.5" />

        <!-- 中心分子（脉冲） -->
        <g class="rd-core">
          <circle class="rd-core__pulse" cx="300" cy="330" r="34" fill="url(#rdCoreGlow)" />
          <circle class="rd-core__ring" cx="300" cy="330" r="19" />
          <line class="rd-core__bond" x1="300" y1="312" x2="300" y2="348" />
          <line class="rd-core__bond" x1="300" y1="330" x2="333" y2="313" />
          <line class="rd-core__bond" x1="300" y1="330" x2="267" y2="313" />
          <line class="rd-core__bond" x1="300" y1="330" x2="300" y2="306" />
          <line class="rd-core__bond" x1="300" y1="330" x2="322" y2="350" />
          <line class="rd-core__bond" x1="300" y1="330" x2="278" y2="350" />
          <circle class="rd-core__dot" cx="300" cy="312" r="3.4" />
          <circle class="rd-core__dot" cx="333" cy="313" r="3.4" />
          <circle class="rd-core__dot" cx="267" cy="313" r="3.4" />
          <circle class="rd-core__dot" cx="300" cy="306" r="3.4" />
          <circle class="rd-core__dot" cx="322" cy="350" r="3.4" />
          <circle class="rd-core__dot" cx="278" cy="350" r="3.4" />
        </g>

        <!-- 节点：AI4S -->
        <g class="rd-node rd-float-a" transform="translate(150 186)">
          <circle class="rd-node__ring o" r="43" />
          <circle class="rd-node__dot o" cx="43" cy="0" r="3" />
          <text class="rd-node__emoji" y="-5">🧪</text>
          <text class="rd-node__name" y="26">AI4S</text>
          <text class="rd-node__sub" y="42">材料设计引擎</text>
        </g>

        <!-- 节点：V&V -->
        <g class="rd-node rd-float-b" transform="translate(462 162)">
          <circle class="rd-node__ring b" r="38" />
          <circle class="rd-node__dot b" cy="-30" r="3" />
          <text class="rd-node__emoji" y="-5">🔬</text>
          <text class="rd-node__name" y="25">V&amp;V</text>
          <text class="rd-node__sub" y="41">虚拟验证</text>
        </g>

        <!-- 节点：LAB -->
        <g class="rd-node rd-float-b" transform="translate(470 502)">
          <circle class="rd-node__ring g" r="38" />
          <circle class="rd-node__dot g" cy="-30" r="3" />
          <text class="rd-node__emoji" y="-5">⚗️</text>
          <text class="rd-node__name" y="25">LAB</text>
          <text class="rd-node__sub" y="41">自动化实验</text>
        </g>

        <!-- 节点：DATA -->
        <g class="rd-node rd-float-a" transform="translate(140 502)">
          <circle class="rd-node__ring p" r="43" />
          <circle class="rd-node__dot p" cx="43" cy="0" r="3" />
          <text class="rd-node__emoji" y="-5">📊</text>
          <text class="rd-node__name" y="26">DATA</text>
          <text class="rd-node__sub" y="42">数据回流</text>
        </g>

        <!-- 支线节点：配方库 / 数据湖 -->
        <g class="rd-node rd-mini rd-float-b" transform="translate(310 128)">
          <circle class="rd-node__ring b" r="24" />
          <text class="rd-mini__name" y="2">配方库</text>
        </g>
        <g class="rd-node rd-mini rd-float-a" transform="translate(310 545)">
          <circle class="rd-node__ring o" r="24" />
          <text class="rd-mini__name" y="2">数据湖</text>
        </g>

        <!-- 环境粒子 -->
        <circle class="rd-particle" cx="250" cy="150" r="3" />
        <circle class="rd-particle" cx="436" cy="300" r="2.5" />
        <circle class="rd-particle" cx="200" cy="428" r="2" />
        <circle class="rd-particle" cx="372" cy="470" r="3" />
        <circle class="rd-particle" cx="150" cy="330" r="2.5" />
        <circle class="rd-particle" cx="450" cy="150" r="2" />
        <circle class="rd-particle" cx="452" cy="472" r="2.5" />
        <circle class="rd-particle" cx="150" cy="472" r="2" />
      </svg>
    </div>

    <div class="relative mx-auto h-full flex">
      <!-- 左上角品牌（图标 + 分隔线 + 系统名） -->
      <div class="absolute left-10 top-7 z-20 flex items-center gap-3">
        <img class="h-10 w-auto" src="@/assets/imgs/logo.png" alt="logo" />
        <div class="h-5 w-px" :style="{ background: 'var(--rd-side)', opacity: .6 }"></div>
        <span
          class="text-lg font-bold tracking-wide text-[#222] dark:text-white"
          style="letter-spacing: 0.5px"
        >
          {{ appStore.getTitle }}
        </span>
      </div>

      <!-- 右上角主题、语言选择 -->
      <div class="absolute right-8 top-6 z-20 flex h-40px items-center space-x-10px">
        <ThemeSwitch />
        <LocaleDropdown />
      </div>

      <!-- 右侧登录区（悬浮在背景插图上，lg 起固定在右半侧） -->
      <div
        class="relative z-10 flex w-full items-center justify-center px-5 py-10 overflow-x-hidden overflow-y-auto sm:px-8 lg:ml-auto lg:w-1/2"
      >
        <div class="w-full max-w-[440px]">
          <!-- 移动端品牌标识 -->
          <div class="mb-6 flex items-center gap-2.5 lg:hidden">
            <img class="h-9 w-auto" src="@/assets/imgs/logo.png" alt="logo" />
            <div class="h-4 w-px" :style="{ background: 'var(--rd-side)', opacity: .6 }"></div>
            <span class="text-sm font-bold text-[#222] dark:text-white">{{ appStore.getTitle }}</span>
          </div>

          <!-- 登录组件 -->
          <div
            class="login-card rounded-xl bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:border dark:border-white/10 dark:bg-[#111a2b]"
          >
            <!-- 品牌标题（仅账号登录态展示，其他状态由 LoginFormTitle 展示） -->
            <h2
              v-if="showLoginTitle"
              class="mb-4 text-center font-semibold leading-tight text-[#1a1a2e] dark:text-white"
              style="font-size: 22px"
            >
              登录
            </h2>

            <!-- 账号登录 -->
            <LoginForm />
            <!-- 手机登录 -->
            <MobileForm />
            <!-- 二维码登录 -->
            <QrCodeForm />
            <!-- 注册 -->
            <RegisterForm />
            <!-- 三方登录 -->
            <SSOLoginVue />
            <!-- 忘记密码 -->
            <ForgetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'

import { LoginStateEnum, useLoginState } from './components/useLogin'
import {
  LoginForm,
  MobileForm,
  QrCodeForm,
  RegisterForm,
  SSOLoginVue,
  ForgetPasswordForm
} from './components'

defineOptions({ name: 'Login' })

const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')

const { getLoginState } = useLoginState()

// 账号登录态时展示品牌标题，其他状态由 LoginFormTitle 展示
const showLoginTitle = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

// ============ 浅色主题：暖橙实验室风（默认） ============
.#{$prefix-cls} {
  --rd-o: #f4a261;
  --rd-b: #5a82e6;
  --rd-g: #39a96b;
  --rd-p: #9b7fe6;
  --rd-base-1: #fffdfa;
  --rd-base-2: #fff3e2;
  --rd-base-3: #f8e9dd;
  --rd-side: #c9a58a;
  --rd-glow-a: rgba(255, 150, 80, 0.16);
  --rd-glow-b: rgba(100, 150, 240, 0.12);
  --rd-glow-c: rgba(57, 169, 107, 0.08);
  --rd-grid: rgba(200, 130, 70, 0.05);
  --rd-sheen: linear-gradient(115deg, transparent 42%, rgba(255, 255, 255, 0.55) 50%, transparent 58%);
  --rd-orbit-o: rgba(244, 162, 97, 0.2);
  --rd-orbit-b: rgba(90, 130, 230, 0.14);
  --rd-flow-o: rgba(244, 162, 97, 0.5);
  --rd-flow-b: rgba(90, 130, 230, 0.4);
  --rd-core: rgba(244, 162, 97, 0.14);
  --rd-halo: rgba(244, 162, 97, 0.06);
  --rd-node-fill: #ffffff;
  --rd-node-stroke: #f4a261;
  --rd-node-dot: #f4a261;
  --rd-particle: rgba(90, 130, 230, 0.4);
  --rd-text: #2f2a26;
  --rd-muted: #9a7a63;
  --rd-input-bg: #f5f7fa;
  --rd-input-border: #e0e4ea;
  --rd-input-border-hover: #c9d1da;
  overflow: auto;
}

// ============ 深色主题：科技暗蓝风 ============
html.dark .#{$prefix-cls} {
  --rd-o: #22d3ee;
  --rd-b: #818cf8;
  --rd-g: #34d399;
  --rd-p: #c084fc;
  --rd-base-1: #04080f;
  --rd-base-2: #081020;
  --rd-base-3: #0c1a30;
  --rd-side: #7aa2d6;
  --rd-glow-a: rgba(34, 211, 238, 0.14);
  --rd-glow-b: rgba(124, 58, 237, 0.2);
  --rd-glow-c: rgba(52, 211, 153, 0.1);
  --rd-grid: rgba(34, 211, 238, 0.05);
  --rd-sheen: linear-gradient(115deg, transparent 40%, rgba(120, 180, 255, 0.06) 50%, transparent 60%);
  --rd-orbit-o: rgba(34, 211, 238, 0.18);
  --rd-orbit-b: rgba(129, 140, 248, 0.18);
  --rd-flow-o: rgba(34, 211, 238, 0.55);
  --rd-flow-b: rgba(129, 140, 248, 0.5);
  --rd-core: rgba(34, 211, 238, 0.16);
  --rd-halo: rgba(34, 211, 238, 0.06);
  --rd-node-fill: #101c30;
  --rd-node-stroke: #22d3ee;
  --rd-node-dot: #22d3ee;
  --rd-particle: rgba(34, 211, 238, 0.45);
  --rd-text: #e6edf7;
  --rd-muted: #8ea3bf;
  --rd-input-bg: #0c1423;
  --rd-input-border: rgba(255, 255, 255, 0.1);
  --rd-input-border-hover: rgba(255, 255, 255, 0.2);
}

/* ===== 背景层 ===== */
.login-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

// 主题渐变底层
.login-bg__base {
  position: absolute;
  inset: 0;
  background: linear-gradient(158deg, var(--rd-base-1) 0%, var(--rd-base-2) 44%, var(--rd-base-3) 100%);
}

// 微纹理（碳纹/点阵网格，聚焦左侧）
.login-bg__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--rd-grid) 1px, transparent 1px);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(circle at 26% 46%, black 8%, transparent 60%);
  mask-image: radial-gradient(circle at 26% 46%, black 8%, transparent 60%);
}

// 光束
.login-bg__sheen {
  position: absolute;
  inset: 0;
  background: var(--rd-sheen);
  mix-blend-mode: overlay;
}

// 环境光晕
.login-bg__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
}
.login-bg__glow-a {
  top: -14%;
  left: -10%;
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, var(--rd-glow-a) 0%, transparent 62%);
}
.login-bg__glow-b {
  bottom: -18%;
  left: 4%;
  width: 540px;
  height: 540px;
  background: radial-gradient(circle, var(--rd-glow-b) 0%, transparent 62%);
}
.login-bg__glow-c {
  top: 22%;
  right: -8%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, var(--rd-glow-c) 0%, transparent 62%);
}

// 研发闭环插图：左侧半区
.login-bg__svg {
  position: absolute;
  left: 1%;
  top: 50%;
  transform: translateY(-50%);
  width: min(600px, 50vw);
  height: auto;
}

/* ===== 插图元素 ===== */
.rd-halo {
  fill: var(--rd-halo);
}
.rd-halo-sm {
  opacity: 0.5;
}

.rd-orbit {
  fill: none;
  stroke-width: 1.4;
  stroke-dasharray: 4 12;
}
.rd-orbit-o {
  stroke: var(--rd-orbit-o);
}
.rd-orbit-b {
  stroke: var(--rd-orbit-b);
}

.rd-flow {
  fill: none;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 6 10;
  animation: rdFlow 9s linear infinite;
}
.rd-flow-b {
  stroke-linecap: round;
}
.rd-flow-rev {
  animation-direction: reverse;
}
@keyframes rdFlow {
  to {
    stroke-dashoffset: -160;
  }
}

.rd-flow-dot {
  fill: var(--rd-node-dot);
  animation: rdFlowDot 9s linear infinite;
}
.rd-flow-dot.rt {
  animation-direction: reverse;
}
@keyframes rdFlowDot {
  from {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.rd-core__pulse {
  transform-origin: 300px 330px;
  animation: rdCorePulse 3.2s ease-in-out infinite;
}
.rd-core__ring {
  fill: var(--rd-node-fill);
  stroke: var(--rd-node-stroke);
  stroke-width: 2.2;
}
.rd-core__bond {
  stroke: var(--rd-flow-o);
  stroke-width: 1.4;
  stroke-linecap: round;
}
.rd-core__dot {
  fill: var(--rd-node-dot);
}
@keyframes rdCorePulse {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.15);
  }
}

.rd-node__ring {
  fill: var(--rd-node-fill);
  stroke-width: 2.4;
}
.rd-node__ring.o {
  stroke: var(--rd-o);
}
.rd-node__ring.b {
  stroke: var(--rd-b);
}
.rd-node__ring.g {
  stroke: var(--rd-g);
}
.rd-node__ring.p {
  stroke: var(--rd-p);
}
.rd-node__dot {
  fill: var(--rd-node-fill);
  stroke-width: 2;
}
.rd-node__dot.o {
  stroke: var(--rd-o);
}
.rd-node__dot.b {
  stroke: var(--rd-b);
}
.rd-node__dot.g {
  stroke: var(--rd-g);
}
.rd-node__emoji {
  font-size: 20px;
  text-anchor: middle;
  dominant-baseline: central;
}
.rd-node__name {
  font-size: 13px;
  font-weight: 700;
  fill: var(--rd-text);
  text-anchor: middle;
}
.rd-node__sub {
  font-size: 9.5px;
  fill: var(--rd-muted);
  text-anchor: middle;
}

// 支线小节点
.rd-mini__name {
  font-size: 10px;
  font-weight: 600;
  fill: var(--rd-muted);
  text-anchor: middle;
  dominant-baseline: central;
}

.rd-float-a {
  animation: rdFloatA 5s ease-in-out infinite;
}
.rd-float-b {
  animation: rdFloatB 6s ease-in-out infinite reverse;
}
@keyframes rdFloatA {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -5px);
  }
}
@keyframes rdFloatB {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 4px);
  }
}

.rd-particle {
  fill: var(--rd-particle);
  animation: rdDrift 7s ease-in-out infinite;
}
.rd-particle:nth-child(2) {
  animation-delay: -2s;
}
.rd-particle:nth-child(3) {
  animation-delay: -4s;
}
.rd-particle:nth-child(4) {
  animation-delay: -5.5s;
}
.rd-particle:nth-child(5) {
  animation-delay: -3s;
}
.rd-particle:nth-child(6) {
  animation-delay: -1s;
}
.rd-particle:nth-child(7) {
  animation-delay: -6s;
}
.rd-particle:nth-child(8) {
  animation-delay: -2.5s;
}
@keyframes rdDrift {
  0%,
  100% {
    opacity: 0.2;
    transform: translate(0, 0);
  }
  50% {
    opacity: 0.75;
    transform: translate(6px, -9px);
  }
}

// 登录组件：进入页面时自下而上弹出。浅色/深色共用同一组件，
// 仅通过 --rd-input-bg/--rd-input-border 主题变量换色，输入框"外层容器"在深浅下均可见、结构一致
.login-card {
  animation: login-slide-up 0.5s ease-out both;

  // 统一表单项间距，避免深浅主题 margin-bottom 不同（14px vs 22px）导致卡片高度不一致
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    background: var(--rd-input-bg);
    box-shadow: 0 0 0 1px var(--rd-input-border) inset !important;
    border-radius: 8px;
  }
  :deep(.el-input__wrapper:hover),
  :deep(.el-select__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--rd-input-border-hover) inset !important;
  }
  :deep(.el-input--focus .el-input__wrapper),
  :deep(.el-select__wrapper.is-focused) {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
  }
}

@keyframes login-slide-up {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .login-bg__svg {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rd-flow,
  .rd-flow-dot,
  .rd-core__pulse,
  .rd-float-a,
  .rd-float-b,
  .rd-particle {
    animation: none !important;
  }
}
</style>