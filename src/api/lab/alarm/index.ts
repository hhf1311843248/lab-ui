import request from '@/config/axios'

export interface AlarmVO {
  id: number
  alarmNo: string
  sourceType: string
  sourceName: string
  level: string
  type: string
  metric: string
  status: string
  alarmTime: Date
}

// 报警信息 API
export const AlarmApi = {
  // 创建报警信息
  create: async (data) => {
    return await request.post({ url: '/lab/alarm/create', data })
  },

  // 更新报警信息
  update: async (data) => {
    return await request.put({ url: '/lab/alarm/update', data })
  },

  // 删除报警信息
  delete: async (id) => {
    return await request.delete({ url: '/lab/alarm/delete?id=' + id, method: 'delete' })
  },

  // 获得报警信息
  get: async (id) => {
    return await request.get({ url: '/lab/alarm/get?id=' + id })
  },

  // 获得报警信息分页
  getPage: async (params) => {
    return await request.get({ url: '/lab/alarm/page', params })
  }
}