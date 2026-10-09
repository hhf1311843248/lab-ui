import request from '@/config/axios'

/**
 * 工段枚举：Code 与名称
 */
export const LabSectionEnum = [
  { value: 'S01', label: '合成段' },
  { value: 'S02', label: '配方段' },
  { value: 'S03', label: '组装段' },
  { value: 'S04', label: '热压段' },
  { value: 'S05', label: '测试段' }
]

/**
 * 资源状态枚举：数字 Code 与名称
 */
export const LabResourceStatusEnum = [
  { value: 0, label: '运行中' },
  { value: 1, label: '空闲' },
  { value: 2, label: '维保' }
]

/**
 * 根据工段 Code 获得工段名称
 */
export const getLabSectionName = (code: string): string => {
  return LabSectionEnum.find((item) => item.value === code)?.label ?? code
}

/**
 * 根据状态值获得资源状态名称
 */
export const getLabResourceStatusLabel = (status: number): string => {
  return LabResourceStatusEnum.find((item) => item.value === status)?.label ?? ''
}

export interface ResourceVO {
  id: number
  code: string
  name: string
  type: string
  sectionCode: string
  shift: string
  beatTime: number
  beatUnit: string
  status: number
}

// 创建资源
export const createResource = async (data) => {
  return request.post({ url: '/lab/resource/create', data })
}

// 更新资源
export const updateResource = async (data) => {
  return request.put({ url: '/lab/resource/update', data })
}

// 删除资源
export const deleteResource = async (id) => {
  return request.delete({ url: '/lab/resource/delete?id=' + id, method: 'delete' })
}

// 获得资源
export const getResource = async (id) => {
  return request.get({ url: '/lab/resource/get?id=' + id })
}

// 获得资源分页
export const getResourcePage = async (query) => {
  return request.get({ url: '/lab/resource/page', params: query })
}

// 获得指定工段下的资源列表
export const getResourceListBySection = async (sectionCode: string) => {
  return request.get({ url: '/lab/resource/list-by-section', params: { sectionCode } })
}
