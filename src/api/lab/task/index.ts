import request from '@/config/axios'

export interface TaskVO {
  id: number
  taskNo: string
  formulaCode: string
  section: string
  procName: string
  progress: number
  resource: string
  priority: string
  planStart: Date
  planEnd: Date
  status: string
}

// 实验任务 API
export const TaskApi = {
  // 创建实验任务
  create: async (data) => {
    return await request.post({ url: '/lab/task/create', data })
  },

  // 更新实验任务
  update: async (data) => {
    return await request.put({ url: '/lab/task/update', data })
  },

  // 删除实验任务
  delete: async (id) => {
    return await request.delete({ url: '/lab/task/delete?id=' + id, method: 'delete' })
  },

  // 获得实验任务
  get: async (id) => {
    return await request.get({ url: '/lab/task/get?id=' + id })
  },

  // 获得实验任务分页
  getPage: async (params) => {
    return await request.get({ url: '/lab/task/page', params })
  }
}