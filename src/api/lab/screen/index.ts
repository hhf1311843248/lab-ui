import request from '@/config/axios'

// 数据大屏 API
export const ScreenApi = {
  // 首页聚合统计
  getHome: () => request.get({ url: '/lab/screen/home' })
}
