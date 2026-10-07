import request from '@/config/axios'

export interface MethodVO {
  id: number
  code: string
  name: string
  std: string
  description: string
}

// 创建检测方法
export const createMethod = async (data) => {
  return request.post({ url: '/lab/method/create', data })
}

// 更新检测方法
export const updateMethod = async (data) => {
  return request.put({ url: '/lab/method/update', data })
}

// 删除检测方法
export const deleteMethod = async (id) => {
  return request.delete({ url: '/lab/method/delete?id=' + id, method: 'delete' })
}

// 获得检测方法
export const getMethod = async (id) => {
  return request.get({ url: '/lab/method/get?id=' + id })
}

// 获得检测方法分页
export const getMethodPage = async (query) => {
  return request.get({ url: '/lab/method/page', params: query })
}