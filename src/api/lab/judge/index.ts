import request from '@/config/axios'

export interface JudgeVO {
  id: number
  code: string
  name: string
  method: string
  target: string
  description: string
}

// 创建检测判定
export const createJudge = async (data) => {
  return request.post({ url: '/lab/judge/create', data })
}

// 更新检测判定
export const updateJudge = async (data) => {
  return request.put({ url: '/lab/judge/update', data })
}

// 删除检测判定
export const deleteJudge = async (id) => {
  return request.delete({ url: '/lab/judge/delete?id=' + id, method: 'delete' })
}

// 获得检测判定
export const getJudge = async (id) => {
  return request.get({ url: '/lab/judge/get?id=' + id })
}

// 获得检测判定分页
export const getJudgePage = async (query) => {
  return request.get({ url: '/lab/judge/page', params: query })
}