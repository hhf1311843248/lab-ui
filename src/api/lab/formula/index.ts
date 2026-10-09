import request from '@/config/axios'

export interface FormulaFeedVO {
  id?: number
  formulaId?: number
  feedProc?: string
  seq?: number
  feedSeq?: number
  materialName?: string
  materialCode?: string
  cat1?: string
  cat2?: string
  quantity?: number
  unit?: string
  deviation?: number
  tolerance?: string
  createTime?: Date
}

export interface FormulaSchemeVO {
  id?: number
  formulaId?: number
  procName: string
  paramKey: string
  paramValue?: string
  createTime?: Date
}

export interface FormulaVO {
  id?: number
  section?: string
  code: string
  version?: string
  isCurrent?: string
  sysCode?: string
  rdClass?: string
  pole?: string
  gen?: string
  cap?: string
  formula?: string
  route?: string
  prio?: string
  bg1?: string
  bg2?: string
  atk1?: string
  atk2?: string
  factor?: string
  purpose?: string
  description?: string
  status?: number
  feedList: FormulaFeedVO[]
  schemeList: FormulaSchemeVO[]
  createTime?: Date
}

/** 配方简单信息（下拉选择用） */
export interface FormulaSimpleVO {
  id: number
  code: string
  section?: string
  description?: string
}

// 创建配方
export const createFormula = async (data) => {
  return await request.post({ url: '/lab/formula/create', data })
}

// 更新配方
export const updateFormula = async (data) => {
  return await request.put({ url: '/lab/formula/update', data })
}

// 删除配方
export const deleteFormula = async (id) => {
  return await request.delete({ url: '/lab/formula/delete?id=' + id, method: 'delete' })
}

// 复制配方（生成新配方：状态重置为新建，编号加 -C 后缀，明细/实验方案一并复制）
export const copyFormula = async (id) => {
  return await request.post({ url: '/lab/formula/copy?id=' + id })
}

// 提交评审：新建 → 评审中
export const submitReviewFormula = async (id) => {
  return await request.post({ url: '/lab/formula/submit-review?id=' + id })
}

// 下达：评审中 → 已下达
export const releaseFormula = async (id) => {
  return await request.post({ url: '/lab/formula/release?id=' + id })
}

// 取消：新建/评审中/已下达 → 取消
export const cancelFormula = async (id) => {
  return await request.post({ url: '/lab/formula/cancel?id=' + id })
}

// 获得配方
export const getFormula = async (id) => {
  return await request.get({ url: '/lab/formula/get?id=' + id })
}

// 获得配方分页
export const getFormulaPage = async (params) => {
  return await request.get({ url: '/lab/formula/page', params })
}

// 获得已下达状态的配方简单列表（下拉选择用）
export const getReleasedFormulaList = async () => {
  return await request.get({ url: '/lab/formula/list-released' })
}

// ========== 配方检测配置变更（用户在配方页面编辑供应商检测配置后入库） ==========

export interface FormulaConfigOverrideVO {
  id?: number
  formulaId?: number
  dataId?: string
  configType?: string
  configJson?: string
  originalJson?: string
  createTime?: Date
}

// 批量保存配方检测配置变更（按配方id + 供应商dataId + 类型覆盖更新）
export const saveFormulaConfigOverrides = async (data: FormulaConfigOverrideVO[]) => {
  return await request.post({ url: '/lab/formula/config-override/save', data })
}

// 获得指定配方的检测配置变更列表
export const getFormulaConfigOverrideList = async (formulaId: number) => {
  return await request.get({ url: '/lab/formula/config-override/list-by-formula?formulaId=' + formulaId })
}