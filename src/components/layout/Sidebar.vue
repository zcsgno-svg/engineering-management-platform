<template>
  <div class="sidebar-container" :class="{ 'mobile-open': isMobileOpen }">
    <div class="sidebar-logo">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo-img" />
      <span class="logo-title">深合工程管理</span>
    </div>

    <el-scrollbar>
      <div class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :unique-opened="true"
          class="menu"
          @select="handleSelect"
        >
          <template v-for="item in menuRoutes" :key="item.path">
            <!-- 无子菜单 -->
            <el-menu-item v-if="!item.children?.length" :index="item.path">
              <el-icon><component :is="item.meta.icon" /></el-icon>
              <template #title>{{ item.meta.title }}</template>
            </el-menu-item>

            <!-- 有子菜单 -->
            <el-sub-menu v-else :index="item.path">
              <template #title>
                <el-icon><component :is="item.meta.icon" /></el-icon>
                <span>{{ item.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.path"
                :index="item.path + '/' + child.path"
              >
                {{ child.meta.title }}
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 是否折叠
const isCollapse = computed(() => appStore.sidebarCollapsed)

// 移动端菜单状态
const isMobileOpen = ref(false)

// 菜单路由
const menuRoutes = computed(() => {
  return router.options.routes
    .find(route => path === '/')
    ?.children?.filter(route => !route.meta?.hidden) || []
})

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value
}

// 监听侧边栏折叠状态变化
watch(() => appStore.sidebarCollapsed, (newVal) => {
  if (newVal) {
    document.body.classList.add('sidebar-collapse')
  } else {
    document.body.classList.remove('sidebar-collapse')
  }
})

// 菜单选择
const handleSelect = (index) => {
  router.push(index)
  // 移动端选中后关闭菜单
  if (isMobileOpen.value) {
    isMobileOpen.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  toggleMobileMenu
})
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: var(--sidebar-width, 200px);
  height: 100vh;
  background-color: #001529;
  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  &.sidebar-collapse {
    width: 64px;
  }
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  overflow: hidden;

  .logo-img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  .logo-title {
    color: white;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.sidebar-menu {
  height: calc(100vh - 60px);
}

.menu {
  border: none;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    color: rgba(255, 255, 255, 0.8);
    height: 50px;
    line-height: 50px;

    &:hover {
      background-color: #1890ff;
      color: white;
    }

    &.is-active {
      background-color: #1890ff;
      color: white;
    }
  }

  :deep(.el-menu-item) {
    padding-left: 40px !important;
  }

  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      padding-left: 40px !important;
    }
  }
}

// 移动端样式
@media (max-width: 768px) {
  .sidebar-container {
    transform: translateX(-100%);

    &.mobile-open {
      transform: translateX(0);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>