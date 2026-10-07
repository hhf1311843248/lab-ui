<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px lt-xl:px-10px"
  >
    <!-- 赛博背景层：网格 + 光晕 -->
    <div class="cyber-bg-grid"></div>
    <div class="cyber-bg-glow glow-1"></div>
    <div class="cyber-bg-glow glow-2"></div>
    <div class="cyber-bg-glow glow-3"></div>

    <div class="relative mx-auto h-full flex">
      <div
        :class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px lt-xl:hidden overflow-x-hidden overflow-y-auto`"
      >
        <!-- 左上角的 logo + 系统标题 -->
        <div class="relative flex items-center text-white">
          <img alt="" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />
          <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <!-- 左边的背景图 + 欢迎语 -->
        <div class="h-[calc(100%-60px)] flex items-center justify-center">
          <TransitionGroup
            appear
            enter-active-class="animate__animated animate__bounceInLeft"
            tag="div"
          >
            <img key="1" alt="" class="w-350px" src="@/assets/svgs/login-box-bg.svg" />
            <div key="2" class="glow-text text-3xl">{{ t('login.welcome') }}</div>
            <div key="3" class="mt-5 text-14px font-normal text-white">
              {{ t('login.message') }}
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div
        class="relative flex-1 p-30px dark:bg-[var(--login-bg-color)] lt-sm:p-10px overflow-x-hidden overflow-y-auto"
      >
        <!-- 右上角的主题、语言选择 -->
        <div
          class="flex items-center justify-between at-2xl:justify-end at-xl:justify-end"
          style="color: var(--el-text-color-primary)"
        >
          <div class="flex items-center at-2xl:hidden at-xl:hidden">
            <img alt="" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>
          <div class="flex items-center justify-end space-x-10px h-48px">
            <LocaleDropdown />
          </div>
        </div>
        <!-- 右边的登录界面 -->
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="m-auto h-[calc(100%-60px)] w-[100%] flex items-center at-2xl:max-w-500px at-lg:max-w-500px at-md:max-w-500px at-xl:max-w-500px"
          >
            <!-- 账号登录 -->
            <LoginForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
            <!-- 手机登录 -->
            <MobileForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
            <!-- 二维码登录 -->
            <QrCodeForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
            <!-- 注册 -->
            <RegisterForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
            <!-- 三方登录 -->
            <SSOLoginVue class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
            <!-- 忘记密码 -->
            <ForgetPasswordForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'

import {
  LoginForm,
  MobileForm,
  QrCodeForm,
  RegisterForm,
  SSOLoginVue,
  ForgetPasswordForm
} from './components'

defineOptions({ name: 'Login' })

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;
  background: var(--bg-primary);

  &__left {
    background:
      linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(123, 47, 247, 0.12) 100%),
      rgba(10, 14, 26, 0.55);

    &::before {
      display: none;
    }
  }
}

/* 赛博背景层：网格线 */
.cyber-bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
  z-index: 0;
}

/* 赛博背景层：径向光晕 */
.cyber-bg-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  animation: float 8s ease-in-out infinite;
  z-index: 0;
}
.glow-1 {
  top: -10%;
  left: -5%;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, transparent 70%);
}
.glow-2 {
  bottom: -15%;
  right: -10%;
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, rgba(123, 47, 247, 0.3) 0%, transparent 70%);
  animation-delay: -3s;
}
.glow-3 {
  top: 30%;
  left: 45%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
  animation-delay: -5s;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
}
</style>

<style lang="scss">
.dark .login-form {
  .el-divider__text {
    background-color: var(--login-bg-color);
  }

  .el-card {
    background-color: var(--login-bg-color);
  }
}
</style>
