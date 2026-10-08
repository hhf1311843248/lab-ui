<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px"
  >
    <!-- 双主题自适应背景（深色=系统科技风，浅色=原型橙色调） -->
    <div class="login-bg" aria-hidden="true">
      <div class="login-bg__grid"></div>
      <div class="login-bg__glow login-bg__glow-a"></div>
      <div class="login-bg__glow login-bg__glow-b"></div>
      <!-- 研发闭环主题插图：AI4S → V&V → LAB → DATA -->
      <svg class="login-bg__svg" viewBox="0 0 760 640" fill="none">
        <defs>
          <linearGradient id="rdFlowO" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F4A261" stop-opacity=".15" />
            <stop offset=".5" stop-color="#F4A261" stop-opacity=".65" />
            <stop offset="1" stop-color="#F4A261" stop-opacity=".15" />
          </linearGradient>
          <linearGradient id="rdFlowB" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#5A82E6" stop-opacity=".15" />
            <stop offset=".5" stop-color="#5A82E6" stop-opacity=".6" />
            <stop offset="1" stop-color="#5A82E6" stop-opacity=".15" />
          </linearGradient>
        </defs>

        <!-- 轨道 -->
        <ellipse class="rd-orbit rd-orbit-o" cx="300" cy="330" rx="228" ry="138" />
        <ellipse class="rd-orbit rd-orbit-b" cx="300" cy="330" rx="158" ry="96" />

        <!-- 流动路径（研发闭环） -->
        <path class="rd-flow" d="M150 170 C 255 118, 365 118, 470 140" stroke="url(#rdFlowO)" />
        <path class="rd-flow rd-flow-rev" d="M470 140 C 522 258, 520 382, 480 500" stroke="url(#rdFlowB)" />
        <path class="rd-flow" d="M480 500 C 360 542, 240 542, 140 500" stroke="url(#rdFlowO)" style="animation-delay:-3s" />
        <path class="rd-flow rd-flow-rev" d="M140 500 C 88 382, 90 258, 150 170" stroke="url(#rdFlowB)" style="animation-delay:-6s" />

        <!-- 中心分子（脉冲） -->
        <g class="rd-core">
          <circle class="rd-core__pulse" cx="300" cy="330" r="30" />
          <circle class="rd-core__ring" cx="300" cy="330" r="18" />
          <line class="rd-core__bond" x1="300" y1="312" x2="300" y2="348" />
          <line class="rd-core__bond" x1="300" y1="330" x2="334" y2="312" />
          <line class="rd-core__bond" x1="300" y1="330" x2="266" y2="312" />
          <circle class="rd-core__dot" cx="300" cy="312" r="4" />
          <circle class="rd-core__dot" cx="334" cy="312" r="4" />
          <circle class="rd-core__dot" cx="266" cy="312" r="4" />
          <circle class="rd-core__dot" cx="300" cy="348" r="4" />
        </g>

        <!-- 节点：AI4S -->
        <g class="rd-node rd-float-a" transform="translate(150 170)">
          <circle class="rd-node__ring o" r="42" />
          <text class="rd-node__emoji" y="-4">🧪</text>
          <text class="rd-node__name" y="26">AI4S</text>
          <text class="rd-node__sub" y="42">材料设计引擎</text>
        </g>

        <!-- 节点：V&V -->
        <g class="rd-node rd-float-b" transform="translate(470 140)">
          <circle class="rd-node__ring b" r="38" />
          <text class="rd-node__emoji" y="-5">🔬</text>
          <text class="rd-node__name" y="25">V&amp;V</text>
          <text class="rd-node__sub" y="41">虚拟验证</text>
        </g>

        <!-- 节点：LAB -->
        <g class="rd-node rd-float-b" transform="translate(480 500)">
          <circle class="rd-node__ring g" r="38" />
          <text class="rd-node__emoji" y="-5">⚗️</text>
          <text class="rd-node__name" y="25">LAB</text>
          <text class="rd-node__sub" y="41">自动化实验</text>
        </g>

        <!-- 节点：DATA -->
        <g class="rd-node rd-float-a" transform="translate(140 500)">
          <circle class="rd-node__ring p" r="42" />
          <text class="rd-node__emoji" y="-4">📊</text>
          <text class="rd-node__name" y="26">DATA</text>
          <text class="rd-node__sub" y="42">数据回流</text>
        </g>

        <!-- 环境粒子 -->
        <circle class="rd-particle" cx="250" cy="150" r="3" />
        <circle class="rd-particle" cx="420" cy="300" r="2.5" />
        <circle class="rd-particle" cx="200" cy="420" r="2" />
        <circle class="rd-particle" cx="360" cy="470" r="3" />
      </svg>
    </div>

    <div class="relative mx-auto h-full flex">
      <!-- 左上角品牌（图标 + 分隔线 + 系统名） -->
      <div class="absolute left-10 top-7 z-20 flex items-center gap-3">
        <img class="h-10 w-auto" src="@/assets/imgs/logo.png" alt="logo" />
        <div class="h-5 w-px" style="background: #dcdcdc"></div>
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
            <div class="h-4 w-px" style="background: #dcdcdc"></div>
            <span class="text-sm font-bold text-[#222] dark:text-white">{{ appStore.getTitle }}</span>
          </div>

          <!-- 登录组件 -->
          <div
            class="login-card rounded-xl bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:border dark:border-white/10 dark:bg-[#333a44]"
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

.#{$prefix-cls} {
  --rd-o: #f4a261;
  --rd-b: #5a82e6;
  --rd-g: #39a96b;
  --rd-p: #9b7fe6;
  --rd-base-1: #ffffff;
  --rd-base-2: #faf8f5;
  --rd-base-3: #f7f8fa;
  --rd-glow-o: rgba(244, 162, 97, 0.12);
  --rd-glow-b: rgba(90, 130, 230, 0.1);
  --rd-grid: rgba(244, 162, 97, 0.07);
  --rd-orbit-o: rgba(244, 162, 97, 0.2);
  --rd-orbit-b: rgba(90, 130, 230, 0.16);
  --rd-flow-o: rgba(244, 162, 97, 0.5);
  --rd-flow-b: rgba(90, 130, 230, 0.45);
  --rd-node-fill: #ffffff;
  --rd-node-stroke: #f4a261;
  --rd-core: rgba(244, 162, 97, 0.16);
  --rd-particle: rgba(90, 130, 230, 0.35);
  --rd-text: #28323c;
  --rd-muted: #7b8794;
  --rd-opacity: 0.95;
  overflow: auto;
}

html.dark .#{$prefix-cls} {
  --rd-base-1: #0e1420;
  --rd-base-2: #111b2d;
  --rd-base-3: #0e1420;
  --rd-glow-o: rgba(0, 240, 255, 0.1);
  --rd-glow-b: rgba(123, 47, 247, 0.14);
  --rd-grid: rgba(0, 240, 255, 0.05);
  --rd-orbit-o: rgba(0, 240, 255, 0.14);
  --rd-orbit-b: rgba(123, 47, 247, 0.16);
  --rd-flow-o: rgba(244, 162, 97, 0.55);
  --rd-flow-b: rgba(90, 130, 230, 0.5);
  --rd-node-fill: #1a2433;
  --rd-node-stroke: #f4a261;
  --rd-core: rgba(0, 240, 255, 0.12);
  --rd-particle: rgba(0, 240, 255, 0.4);
  --rd-text: #e8eef7;
  --rd-muted: #8ea3bf;
  --rd-opacity: 1;
}

/* ===== 背景层 ===== */
.login-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: linear-gradient(160deg, var(--rd-base-1) 0%, var(--rd-base-2) 46%, var(--rd-base-3) 100%);
}

// 网格底纹（聚焦左侧，避免干扰登录卡片）
.login-bg__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--rd-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--rd-grid) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(circle at 30% 45%, black 12%, transparent 68%);
  mask-image: radial-gradient(circle at 30% 45%, black 12%, transparent 68%);
}

// 环境光晕
.login-bg__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
}
.login-bg__glow-a {
  top: -12%;
  left: -8%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, var(--rd-glow-o) 0%, transparent 62%);
}
.login-bg__glow-b {
  bottom: -16%;
  right: -6%;
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, var(--rd-glow-b) 0%, transparent 62%);
}

// 研发闭环插图：左侧半区
.login-bg__svg {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: min(560px, 48vw);
  height: auto;
  opacity: var(--rd-opacity);
}

/* ===== 插图元素 ===== */
.rd-orbit {
  fill: none;
  stroke-width: 1;
  stroke-dasharray: 3 10;
}
.rd-orbit-o {
  stroke: var(--rd-orbit-o);
}
.rd-orbit-b {
  stroke: var(--rd-orbit-b);
}

.rd-flow {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 5 9;
  animation: rdFlow 9s linear infinite;
}
.rd-flow-rev {
  animation-direction: reverse;
}
@keyframes rdFlow {
  to {
    stroke-dashoffset: -140;
  }
}

.rd-core__pulse {
  fill: var(--rd-core);
  stroke: var(--rd-core);
  stroke-width: 1;
  transform-origin: 300px 330px;
  animation: rdCorePulse 3.2s ease-in-out infinite;
}
.rd-core__ring {
  fill: var(--rd-node-fill);
  stroke: var(--rd-o);
  stroke-width: 2;
}
.rd-core__bond {
  stroke: var(--rd-flow-o);
  stroke-width: 1.4;
  stroke-linecap: round;
}
.rd-core__dot {
  fill: var(--rd-o);
}
@keyframes rdCorePulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.28);
  }
}

.rd-node__ring {
  fill: var(--rd-node-fill);
  stroke-width: 2;
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
.rd-node__emoji {
  font-size: 19px;
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
  font-size: 9px;
  fill: var(--rd-muted);
  text-anchor: middle;
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
@keyframes rdDrift {
  0%,
  100% {
    opacity: 0.25;
    transform: translate(0, 0);
  }
  50% {
    opacity: 0.7;
    transform: translate(6px, -8px);
  }
}

// 登录组件：进入页面时自下而上弹出
.login-card {
  animation: login-slide-up 0.5s ease-out both;
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
  .rd-core__pulse,
  .rd-float-a,
  .rd-float-b,
  .rd-particle {
    animation: none !important;
  }
}
</style>
