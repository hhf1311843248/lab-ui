import request from '@/config/axios'

/**
 * 任务组优先级枚举：数字 Code 与名称（1-高、2-中、3-低）
 */
export const LabTaskGroupPriorityEnum = [
  { value: 1, label: '高' },
  { value: 2, label: '中' },
  { value: 3, label: '低' }
]

/**
 * 根据优先级值获得优先级名称
 */
export const getLabTaskGroupPriorityLabel = (prio?: number): string => {
  return LabTaskGroupPriorityEnum.find((item) => item.value === prio)?.label ?? ''
}

/**
 * 任务组状态枚举：数字 Code 与名称（1-新建、2-已下达、3-生产中、4-已完工、5-取消）
 */
export const LabTaskGroupStatusEnum = [
  { value: 1, label: '新建' },
  { value: 2, label: '已下达' },
  { value: 3, label: '生产中' },
  { value: 4, label: '已完工' },
  { value: 5, label: '取消' }
]

/**
 * 根据状态值获得状态名称
 */
export const getLabTaskGroupStatusLabel = (status?: number): string => {
  return LabTaskGroupStatusEnum.find((item) => item.value === status)?.label ?? ''
}

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
  prio?: number
  planStart?: string
  planEnd?: string
  status?: number
  linkList: TaskGroupLinkVO[]
  createTime?: Date
}

// 排产队列卡片
export interface TaskGroupQueueVO {
  id?: number
  code: string
  description?: string
  prio?: number
  planStart?: string
  planEnd?: string
  status: number
  sections?: string[]
  processCount?: number
  formulaCount?: number
  simStatus?: string
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

// 下达：新建 → 已下达
export const releaseTaskGroup = async (id) => {
  return await request.post({ url: '/lab/task-group/release?id=' + id })
}

// 获得实验任务组
export const getTaskGroup = async (id) => {
  return await request.get({ url: '/lab/task-group/get?id=' + id })
}

// 获得实验任务组分页
export const getTaskGroupPage = async (query) => {
  return await request.get({ url: '/lab/task-group/page', params: query })
}

// 获得排产队列（已下达、生产中）
export const getTaskGroupQueue = async () => {
  return await request.get({ url: '/lab/task-group/queue' })
}

// 更新排产队列任务优先级（仅已下达）
export const updateTaskGroupPriority = async (id, prio) => {
  return await request.post({ url: '/lab/task-group/update-priority', params: { id, prio } })
}