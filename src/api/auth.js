import request from '@/utils/request'
import { mockRequest } from '@/utils/mock'

// 登录
export const login = (data) => {
  return mockRequest({
    token: 'mock-token-' + Date.now(),
    userInfo: {
      id: 1,
      username: 'admin',
      name: '管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['*']
    },
    permissions: ['*']
  })
}

// 登出
export const logout = () => {
  return mockRequest({ success: true })
}

// 获取用户信息
export const getUserInfo = () => {
  return mockRequest({
    id: 1,
    username: 'admin',
    name: '管理员',
    avatar: '',
    roles: ['admin'],
    permissions: ['*']
  })
}