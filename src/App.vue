<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import routerSearch from '@/components/RouterSearch/index.vue'

defineOptions({ name: 'APP' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('app')
const appStore = useAppStore()
const currentSize = computed(() => appStore.getCurrentSize)
const greyMode = computed(() => appStore.getGreyMode)

// 锁定深色赛博主题：强制暗黑模式，并覆写可能存在的旧缓存为主题色
const setDefaultTheme = () => {
  appStore.setIsDark(true)
  appStore.setTheme({
    elColorPrimary: '#00f0ff',
    leftMenuBorderColor: 'rgba(0, 240, 255, 0.15)',
    leftMenuBgColor: 'rgba(10, 14, 26, 0.95)',
    leftMenuBgLightColor: 'transparent',
    leftMenuBgActiveColor: 'transparent',
    leftMenuCollapseBgActiveColor: 'transparent',
    leftMenuTextColor: '#94a3b8',
    leftMenuTextActiveColor: '#00f0ff',
    logoTitleTextColor: '#fff',
    logoBorderColor: 'rgba(0, 240, 255, 0.15)',
    topHeaderBgColor: 'rgba(10, 14, 26, 0.6)',
    topHeaderTextColor: '#e2e8f0',
    topHeaderHoverColor: 'rgba(0, 240, 255, 0.08)',
    topToolBorderColor: 'rgba(0, 240, 255, 0.15)'
  })
}
setDefaultTheme()
</script>
<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
    <routerSearch />
  </ConfigGlobal>
</template>
<style lang="scss">
$prefix-cls: #{$namespace}-app;

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  @extend .size;

  padding: 0 !important;
  margin: 0;
  overflow: hidden;

  #app {
    @extend .size;
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
