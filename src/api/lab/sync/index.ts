import request from '@/config/axios'
import { getLabSectionName } from '@/api/lab/resource'

/**
 * 供应商项目类型：1-水分检测 2-细度检测 3-流变测试 4-脱泡检测 5-XRD检测 6-离子电导率
 */
export const LabProjectTypeEnum = [
  { value: 1, label: '水分检测' },
  { value: 2, label: '细度检测' },
  { value: 3, label: '流变测试' },
  { value: 4, label: '脱泡检测' },
  { value: 5, label: 'XRD检测' },
  { value: 6, label: '离子电导率' }
]

export const getLabProjectTypeLabel = (type: number): string => {
  return LabProjectTypeEnum.find((item) => item.value === type)?.label ?? ''
}

// 判定方式（检测判定）：1-具体值、2-上下浮动区间
export const LabJudgeModeEnum = [
  { value: 1, label: '具体值' },
  { value: 2, label: '上下浮动区间' }
]

// 判定方式（综合判定）：1-按判定项数、2-按项目组合
export const LabComprehensiveModeEnum = [
  { value: 1, label: '按判定项数' },
  { value: 2, label: '按项目组合' }
]

export const getLabComprehensiveModeLabel = (mode: number): string => {
  return LabComprehensiveModeEnum.find((item) => item.value === mode)?.label ?? ''
}

export const getLabJudgeModeLabel = (mode: number): string => {
  return LabJudgeModeEnum.find((item) => item.value === mode)?.label ?? ''
}

export interface SyncMethodVO {
  id: number
  segmentCode: string
  projectSegment: number
  projectType: number
  projectName: string
  requiresMethod: boolean
  sampleAmount: number
  sampleUnit: string
  supportedResultCodes: string
  remark: string
  configJson: string
  status: number
  dataId: string
  dataUpdateTime: string
  createTime: string
}

export interface SyncJudgeVO {
  id: number
  segmentCode: string
  projectSegment: number
  name: string
  projectType: number
  resultCode: string
  unit: string
  mode: number
  standardValue: number
  standardJson: string
  status: number
  dataId: string
  dataUpdateTime: string
  remark?: string
  createTime: string
}

export interface SyncComprehensiveVO {
  id: number
  segmentCode: string
  projectSegment: number
  name: string
  mode: number
  projectTypes: string
  mainProjectType: number
  comprehensiveJson: string
  status: number
  dataId: string
  dataUpdateTime: string
  createTime: string
}

// ========== 检测项目/方法 ==========
export const getSyncMethodPage = async (query) => {
  return request.get({ url: '/lab/sync/method/page', params: query })
}
export const getSyncMethod = async (id: number) => {
  return request.get({ url: '/lab/sync/method/get?id=' + id })
}

// ========== 检测判定标准 ==========
export const getSyncJudgePage = async (query) => {
  return request.get({ url: '/lab/sync/judge/page', params: query })
}
export const getSyncJudge = async (id: number) => {
  return request.get({ url: '/lab/sync/judge/get?id=' + id })
}

// ========== 综合判定规则 ==========
export const getSyncComprehensivePage = async (query) => {
  return request.get({ url: '/lab/sync/comprehensive/page', params: query })
}
export const getSyncComprehensive = async (id: number) => {
  return request.get({ url: '/lab/sync/comprehensive/get?id=' + id })
}

// 工具：所属段展示
export const formatSyncSegment = (segmentCode: string): string => {
  return getLabSectionName(segmentCode)
}
