import request from '@/config/axios'

export interface RouteStepVO {
  id?: number
  routeId?: number
  seq?: number
  procCode: string
  procName?: string
  createTime?: Date
}

export interface RouteVO {
  id?: number
  code: string
  name: string
  sec?: string
  steps: RouteStepVO[]
  createTime?: Date
}

// 创建工艺路线
export const createRoute = async (data) => {
  return await request.post({ url: '/lab/route/create', data })
}

// 更新工艺路线
export const updateRoute = async (data) => {
  return await request.put({ url: '/lab/route/update', data })
}

// 删除工艺路线
export const deleteRoute = async (id) => {
  return await request.delete({ url: '/lab/route/delete?id=' + id, method: 'delete' })
}

// 获得工艺路线
export const getRoute = async (id) => {
  return await request.get({ url: '/lab/route/get?id=' + id })
}

// 获得工艺路线分页
export const getRoutePage = async (query) => {
  return await request.get({ url: '/lab/route/page', params: query })
}