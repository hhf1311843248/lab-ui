import request from '@/config/axios'

export interface ResourceVO {
  id: number
  code: string
  name: string
  type: string
  section: string
  shift: string
  status: string
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