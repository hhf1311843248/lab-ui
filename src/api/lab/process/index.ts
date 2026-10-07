import request from '@/config/axios'

export interface ProcessVO {
  id: number
  secCode: string
  secName: string
  procCode: string
  procName: string
  takt: number
  resName: string
  status: number
}

// 创建工序
export const createProcess = async (data) => {
  return request.post({ url: '/lab/process/create', data })
}

// 更新工序
export const updateProcess = async (data) => {
  return request.put({ url: '/lab/process/update', data })
}

// 删除工序
export const deleteProcess = async (id) => {
  return request.delete({ url: '/lab/process/delete?id=' + id, method: 'delete' })
}

// 获得工序
export const getProcess = async (id) => {
  return request.get({ url: '/lab/process/get?id=' + id })
}

// 获得工序分页
export const getProcessPage = async (query) => {
  return request.get({ url: '/lab/process/page', params: query })
}