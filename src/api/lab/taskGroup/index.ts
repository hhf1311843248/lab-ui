import request from '@/config/axios'

export interface TaskGroupLinkVO {
  id?: number
  groupId?: number
  formulaCode: string
  negFormula?: string
  createTime?: Date
}

export interface TaskGroupVO {
  id?: number
  code: string
  description?: string
  prio?: string
  planStart?: string
  planEnd?: string
  status?: string
  linkList: TaskGroupLinkVO[]
  createTime?: Date
}

// 创建实验任务组
export const createTaskGroup = async (data) => {
  return await request.post({ url: '/lab/task-group/create', data })
}

// 更新实验任务组
export const updateTaskGroup = async (data) => {
  return await request.put({ url: '/lab/task-group/update', data })
}

// 删除实验任务组
export const deleteTaskGroup = async (id) => {
  return await request.delete({ url: '/lab/task-group/delete?id=' + id, method: 'delete' })
}

// 获得实验任务组
export const getTaskGroup = async (id) => {
  return await request.get({ url: '/lab/task-group/get?id=' + id })
}

// 获得实验任务组分页
export const getTaskGroupPage = async (query) => {
  return await request.get({ url: '/lab/task-group/page', params: query })
}