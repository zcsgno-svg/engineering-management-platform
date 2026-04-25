import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: {
            title: '首页驾驶舱',
            icon: 'Odometer',
            requiresAuth: true
          }
        },
        {
          path: 'equipment',
          name: 'Equipment',
          redirect: '/equipment/list',
          meta: {
            title: '设备管理',
            icon: 'Tools',
            requiresAuth: true
          },
          children: [
            {
              path: 'list',
              name: 'EquipmentList',
              component: () => import('@/views/equipment/list.vue'),
              meta: {
                title: '设备列表',
                requiresAuth: true
              }
            },
            {
              path: 'detail/:id',
              name: 'EquipmentDetail',
              component: () => import('@/views/equipment/detail.vue'),
              meta: {
                title: '设备详情',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'workorder',
          name: 'WorkOrder',
          redirect: '/workorder/list',
          meta: {
            title: '工单管理',
            icon: 'Document',
            requiresAuth: true
          },
          children: [
            {
              path: 'list',
              name: 'WorkOrderList',
              component: () => import('@/views/workorder/list.vue'),
              meta: {
                title: '工单列表',
                requiresAuth: true
              }
            },
            {
              path: 'create',
              name: 'WorkOrderCreate',
              component: () => import('@/views/workorder/create.vue'),
              meta: {
                title: '新建工单',
                requiresAuth: true
              }
            },
            {
              path: 'detail/:id',
              name: 'WorkOrderDetail',
              component: () => import('@/views/workorder/detail.vue'),
              meta: {
                title: '工单详情',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'inspection',
          name: 'Inspection',
          redirect: '/inspection/list',
          meta: {
            title: '巡检管理',
            icon: 'Location',
            requiresAuth: true
          },
          children: [
            {
              path: 'list',
              name: 'InspectionList',
              component: () => import('@/views/inspection/list.vue'),
              meta: {
                title: '巡检列表',
                requiresAuth: true
              }
            },
            {
              path: 'create',
              name: 'InspectionCreate',
              component: () => import('@/views/inspection/create.vue'),
              meta: {
                title: '新建巡检',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'maintenance',
          name: 'Maintenance',
          redirect: '/maintenance/list',
          meta: {
            title: '维保管理',
            icon: 'Tools',
            requiresAuth: true
          },
          children: [
            {
              path: 'list',
              name: 'MaintenanceList',
              component: () => import('@/views/maintenance/list.vue'),
              meta: {
                title: '维保列表',
                requiresAuth: true
              }
            },
            {
              path: 'plan',
              name: 'MaintenancePlan',
              component: () => import('@/views/maintenance/plan.vue'),
              meta: {
                title: '维保计划',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'special',
          name: 'SpecialEquipment',
          redirect: '/special/list',
          meta: {
            title: '特种设备',
            icon: 'Warning',
            requiresAuth: true
          },
          children: [
            {
              path: 'list',
              name: 'SpecialList',
              component: () => import('@/views/special/list.vue'),
              meta: {
                title: '特种设备台账',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'energy',
          name: 'Energy',
          redirect: '/energy/overview',
          meta: {
            title: '能耗管理',
            icon: 'Lightning',
            requiresAuth: true
          },
          children: [
            {
              path: 'overview',
              name: 'EnergyOverview',
              component: () => import('@/views/energy/overview.vue'),
              meta: {
                title: '能耗概览',
                requiresAuth: true
              }
            },
            {
              path: 'detail',
              name: 'EnergyDetail',
              component: () => import('@/views/energy/detail.vue'),
              meta: {
                title: '能耗明细',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'report',
          name: 'Report',
          redirect: '/report/workorder',
          meta: {
            title: '报表中心',
            icon: 'DataAnalysis',
            requiresAuth: true
          },
          children: [
            {
              path: 'workorder',
              name: 'ReportWorkOrder',
              component: () => import('@/views/report/workorder.vue'),
              meta: {
                title: '工单报表',
                requiresAuth: true
              }
            },
            {
              path: 'energy',
              name: 'ReportEnergy',
              component: () => import('@/views/report/energy.vue'),
              meta: {
                title: '能耗报表',
                requiresAuth: true
              }
            },
            {
              path: 'equipment',
              name: 'ReportEquipment',
              component: () => import('@/views/report/equipment.vue'),
              meta: {
                title: '设备报表',
                requiresAuth: true
              }
            }
          ]
        },
        {
          path: 'system',
          name: 'System',
          redirect: '/system/user',
          meta: {
            title: '系统管理',
            icon: 'Setting',
            requiresAuth: true,
            role: ['admin']
          },
          children: [
            {
              path: 'user',
              name: 'SystemUser',
              component: () => import('@/views/system/user.vue'),
              meta: {
                title: '用户管理',
                requiresAuth: true,
                role: ['admin']
              }
            },
            {
              path: 'role',
              name: 'SystemRole',
              component: () => import('@/views/system/role.vue'),
              meta: {
                title: '角色管理',
                requiresAuth: true,
                role: ['admin']
              }
            },
            {
              path: 'menu',
              name: 'SystemMenu',
              component: () => import('@/views/system/menu.vue'),
              meta: {
                title: '菜单管理',
                requiresAuth: true,
                role: ['admin']
              }
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/error/404.vue'),
      meta: {
        title: '404',
        requiresAuth: false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 深合工程管理平台` : '深合工程管理平台'

  // 检查是否需要登录
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router