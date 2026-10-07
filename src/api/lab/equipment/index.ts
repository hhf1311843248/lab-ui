import request from '@/config/axios'

export interface EquipmentVO {
  id: number
  name: string
  section: string
  status: string
  temp: string
  util: string
  oee: string
}

// 设备监控 API
export const EquipmentApi = {
  // 创建设备监控
  create: async (data) => {
    return await request.post({ url: '/lab/equipment/create', data })
  },

  // 更新设备监控
  update: async (data) => {
    return await request.put({ url: '/lab/equipment/update', data })
  },

  // 删除设备监控
  delete: async (id) => {
    return await request.delete({ url: '/lab/equipment/delete?id=' + id, method: 'delete' })
  },

  // 获得设备监控
  get: async (id) => {
    return await request.get({ url: '/lab/equipment/get?id=' + id })
  },

  // 获得设备监控分页
  getPage: async (params) => {
    return await request.get({ url: '/lab/equipment/page', params })
  }
}