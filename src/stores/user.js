import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const permissions = ref(JSON.parse(localStorage.getItem('permissions') || '[]'))

  // 登录
  const login = async (loginForm) => {
    try {
      const res = await loginApi(loginForm)
      token.value = res.data.token
      userInfo.value = res.data.userInfo
      permissions.value = res.data.permissions || []

      // 持久化存储
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
      localStorage.setItem('permissions', JSON.stringify(res.data.permissions || []))

      return res
    } catch (error) {
      throw error
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    permissions.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('permissions')
  }

  // 检查权限
  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  // 检查角色
  const hasRole = (role) => {
    return userInfo.value.roles?.includes(role)
  }

  return {
    token,
    userInfo,
    permissions,
    login,
    logout,
    hasPermission,
    hasRole
  }
})