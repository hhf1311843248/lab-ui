import request from '@/config/axios'

export interface ResultVO {
  id: number
  resultNo: string
  formulaCode: string
  section: string
  item: string
  method: string
  value: string
  judge: string
  comprehensive: string
  judgeTime: Date
}

// 实验结果 API
export const ResultApi = {
  // 创建实验结果
  create: async (data) => {
    return await request.post({ url: '/lab/result/create', data })
  },

  // 更新实验结果
  update: async (data) => {
    return await request.put({ url: '/lab/result/update', data })
  },

  // 删除实验结果
  delete: async (id) => {
    return await request.delete({ url: '/lab/result/delete?id=' + id, method: 'delete' })
  },

  // 获得实验结果
  get: async (id) => {
    return await request.get({ url: '/lab/result/get?id=' + id })
  },

  // 获得实验结果分页
  getPage: async (params) => {
    return await request.get({ url: '/lab/result/page', params })
  }
}