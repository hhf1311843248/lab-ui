import request from '@/config/axios'

export interface ScheduleTaskVO {
  id?: number
  groupCode?: string
  formulaCode?: string
  procName?: string
  resource?: string
  priority?: string
  planStart?: string
  planEnd?: string
  status?: string
  createTime?: Date
}

// 创建排产任务
export const createSchedule = async (data) => {
  return await request.post({ url: '/lab/schedule/create', data })
}

// 更新排产任务
export const updateSchedule = async (data) => {
  return await request.put({ url: '/lab/schedule/update', data })
}

// 删除排产任务
export const deleteSchedule = async (id) => {
  return await request.delete({ url: '/lab/schedule/delete?id=' + id, method: 'delete' })
}

// 获得排产任务
export const getSchedule = async (id) => {
  return await request.get({ url: '/lab/schedule/get?id=' + id })
}

// 获得排产任务分页
export const getSchedulePage = async (query) => {
  return await request.get({ url: '/lab/schedule/page', params: query })
}