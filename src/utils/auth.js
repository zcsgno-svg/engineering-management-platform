// 权限检查
export const hasPermission = (permission) => {
  const userStore = useUserStore()
  return userStore.hasPermission(permission)
}

// 角色检查
export const hasRole = (role) => {
  const userStore = useUserStore()
  return userStore.hasRole(role)
}

// 路由守卫
export const setupGuards = (router) => {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // 检查是否需要登录
    if (to.meta.requiresAuth && !userStore.token) {
      next('/login')
      return
    }

    // 检查角色权限
    if (to.meta.role && !hasRole(to.meta.role)) {
      next('/403')
      return
    }

    // 检查普通权限
    if (to.meta.permission && !hasPermission(to.meta.permission)) {
      next('/403')
      return
    }

    next()
  })
}