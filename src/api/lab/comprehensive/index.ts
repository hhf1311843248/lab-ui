import request from '@/config/axios'

export interface ComprehensiveVO {
  id: number
  code: string
  name: string
  items: string
  rule: string
  description: string
}

// 创建综合判定
export const createComprehensive = async (data) => {
  return request.post({ url: '/lab/comprehensive/create', data })
}

// 更新综合判定
export const updateComprehensive = async (data) => {
  return request.put({ url: '/lab/comprehensive/update', data })
}

// 删除综合判定
export const deleteComprehensive = async (id) => {
  return request.delete({ url: '/lab/comprehensive/delete?id=' + id, method: 'delete' })
}

// 获得综合判定
export const getComprehensive = async (id) => {
  return request.get({ url: '/lab/comprehensive/get?id=' + id })
}

// 获得综合判定分页
export const getComprehensivePage = async (query) => {
  return request.get({ url: '/lab/comprehensive/page', params: query })
}