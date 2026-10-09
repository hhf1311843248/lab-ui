/**
 * 配方页面-供应商检测配置编辑暂存（浏览器缓存）
 *
 * 用户在实验方案中选择检测方法/检测判定/综合判定后，可点「查看/编辑」修改配置，
 * 修改结果暂存 localStorage；配方保存（确认）时再由页面统一写入
 * lab_formula_config_override 表（关联配方 id + 供应商 dataId）。
 */

/** 缓存 Key 前缀 */
const CACHE_PREFIX = 'lab_formula_config_edit'

export type ConfigEditType = 'method' | 'judge' | 'comprehensive'

export interface ConfigCacheItem {
  /** 编辑后的完整配置（JSON 字符串） */
  configJson: string
  /** 原始配置（JSON 字符串），用于判断是否已更改 */
  originalJson: string
  updatedAt: string
}

const cacheKey = (type: ConfigEditType, dataId: string): string => {
  return `${CACHE_PREFIX}:${type}:${dataId}`
}

/** 读取缓存 */
export const getConfigCache = (type: ConfigEditType, dataId: string): ConfigCacheItem | null => {
  try {
    const raw = localStorage.getItem(cacheKey(type, dataId))
    return raw ? (JSON.parse(raw) as ConfigCacheItem) : null
  } catch {
    return null
  }
}

/** 写入缓存 */
export const setConfigCache = (
  type: ConfigEditType,
  dataId: string,
  configJson: string,
  originalJson: string
): void => {
  const item: ConfigCacheItem = {
    configJson,
    originalJson,
    updatedAt: new Date().toISOString()
  }
  localStorage.setItem(cacheKey(type, dataId), JSON.stringify(item))
}

/** 清除缓存 */
export const clearConfigCache = (type?: ConfigEditType, dataId?: string): void => {
  if (type && dataId) {
    localStorage.removeItem(cacheKey(type, dataId))
    return
  }
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_PREFIX))
    .forEach((k) => localStorage.removeItem(k))
}

/** 判断该项是否已更改（缓存存在且内容与原始不同） */
export const isConfigChanged = (type: ConfigEditType, dataId: string): boolean => {
  const item = getConfigCache(type, dataId)
  if (!item) {
    return false
  }
  return item.configJson !== item.originalJson
}
