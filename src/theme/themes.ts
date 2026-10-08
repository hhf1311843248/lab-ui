import type { ThemeTypes } from '@/types/theme'

/**
 * 深色主题：赛博风（青色 #00f0ff + 紫色 #7b2ff7，深色底 rgba(10,14,26)）
 */
export const darkTheme: ThemeTypes = {
  // 主题色（赛博青）
  elColorPrimary: '#00f0ff',
  // 左侧菜单边框颜色
  leftMenuBorderColor: 'rgba(0, 240, 255, 0.15)',
  // 左侧菜单背景颜色
  leftMenuBgColor: 'rgba(10, 14, 26, 0.95)',
  // 左侧菜单浅色背景颜色（二级菜单项透明，悬浮/激活才上色）
  leftMenuBgLightColor: 'transparent',
  // 左侧菜单选中背景颜色
  leftMenuBgActiveColor: 'transparent',
  // 左侧菜单收起选中背景颜色
  leftMenuCollapseBgActiveColor: 'transparent',
  // 左侧菜单字体颜色
  leftMenuTextColor: '#94a3b8',
  // 左侧菜单选中字体颜色
  leftMenuTextActiveColor: '#00f0ff',
  // logo字体颜色
  logoTitleTextColor: '#fff',
  // logo边框颜色
  logoBorderColor: 'rgba(0, 240, 255, 0.15)',
  // 头部背景颜色
  topHeaderBgColor: 'rgba(10, 14, 26, 0.6)',
  // 头部字体颜色
  topHeaderTextColor: '#e2e8f0',
  // 头部悬停颜色
  topHeaderHoverColor: 'rgba(0, 240, 255, 0.08)',
  // 头部边框颜色
  topToolBorderColor: 'rgba(0, 240, 255, 0.15)'
}

/**
 * 浅色主题：严格参照 lab/dashboard.html 的暖橙实验室风
 * 主色 #F4A261、卡片 #FFFFFF、底 #F7F8FA、线 #E8EBEF、文本 #28323C
 */
export const lightTheme: ThemeTypes = {
  // 主题色（暖橙）
  elColorPrimary: '#F4A261',
  // 左侧菜单边框颜色
  leftMenuBorderColor: '#E8EBEF',
  // 左侧菜单背景颜色（白）
  leftMenuBgColor: '#FFFFFF',
  // 左侧菜单浅色背景颜色（二级菜单项白底）
  leftMenuBgLightColor: '#FFFFFF',
  // 左侧菜单选中背景颜色
  leftMenuBgActiveColor: '#FFFFFF',
  // 左侧菜单收起选中背景颜色
  leftMenuCollapseBgActiveColor: '#FFFFFF',
  // 左侧菜单字体颜色
  leftMenuTextColor: '#59636E',
  // 左侧菜单选中字体颜色（橙褐）
  leftMenuTextActiveColor: '#CF742B',
  // logo字体颜色
  logoTitleTextColor: '#28323C',
  // logo边框颜色
  logoBorderColor: '#E8EBEF',
  // 头部背景颜色（白）
  topHeaderBgColor: '#FFFFFF',
  // 头部字体颜色
  topHeaderTextColor: '#28323C',
  // 头部悬停颜色
  topHeaderHoverColor: '#F8F9FA',
  // 头部边框颜色
  topToolBorderColor: '#E8EBEF'
}
