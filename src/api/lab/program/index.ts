import request from '@/config/axios'

export interface ProgramVO {
  id: number
  code: string
  name: string
  proc: string
  description: string
}

// 创建程序号
export const createProgram = async (data) => {
  return request.post({ url: '/lab/program/create', data })
}

// 更新程序号
export const updateProgram = async (data) => {
  return request.put({ url: '/lab/program/update', data })
}

// 删除程序号
export const deleteProgram = async (id) => {
  return request.delete({ url: '/lab/program/delete?id=' + id, method: 'delete' })
}

// 获得程序号
export const getProgram = async (id) => {
  return request.get({ url: '/lab/program/get?id=' + id })
}

// 获得程序号分页
export const getProgramPage = async (query) => {
  return request.get({ url: '/lab/program/page', params: query })
}