<script lang="tsx">
import { computed, defineComponent, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { Setting } from '@/layout/components/Setting'
import { useRenderLayout } from './components/useRenderLayout'
import { useDesign } from '@/hooks/web/useDesign'
import { getLayoutRenderMode } from '@/utils/layout'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const layout = computed(() => appStore.getLayout)

const handleClickOutside = () => {
  appStore.setCollapse(true)
}

const renderLayout = () => {
  switch (getLayoutRenderMode(unref(layout))) {
    case 'classic':
      const { renderClassic } = useRenderLayout()
      return renderClassic()
    case 'topLeft':
      const { renderTopLeft } = useRenderLayout()
      return renderTopLeft()
    case 'top':
      const { renderTop } = useRenderLayout()
      return renderTop()
    case 'cutMenu':
      const { renderCutMenu } = useRenderLayout()
      return renderCutMenu()
    default:
      break
  }
}

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => (
      <section
        class={[
          prefixCls,
          `${prefixCls}__${layout.value}`,
          `${prefixCls}__${getLayoutRenderMode(layout.value)}`,
          'w-[100%] h-[100%] relative'
        ]}
      >
        {mobile.value && !collapse.value ? (
          <div
            class="absolute left-0 top-0 z-99 h-full w-full bg-[var(--el-color-black)] opacity-30"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        {/* 赛博背景层：网格 + 光晕 */}
        <div class="cyber-bg-grid"></div>
        <div class="cyber-bg-glow"></div>

        <div class="cyber-content">{renderLayout()}</div>

        <Backtop></Backtop>

        <Setting></Setting>
      </section>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout;

.#{$prefix-cls} {
  background-color: var(--app-content-bg-color);
}

/* 赛博背景层：网格线 */
.cyber-bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* 赛博背景层：径向光晕 */
.cyber-bg-glow {
  position: fixed;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(123, 47, 247, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* 内容层：必须盖在背景层之上 */
.cyber-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
