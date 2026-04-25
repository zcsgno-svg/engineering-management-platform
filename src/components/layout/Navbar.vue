<template>
  <div class="navbar">
    <!-- 左侧 -->
    <div class="left">
      <!-- 折叠按钮 -->
      <el-button
        text
        @click="toggleSidebar"
        class="toggle-btn"
      >
        <el-icon :size="20">
          <component :is="isCollapse ? 'Expand' : 'Fold'" />
        </el-icon>
      </el-button>

      <!-- 移动端菜单按钮 -->
      <el-button
        text
        @click="toggleMobileMenu"
        class="mobile-toggle-btn"
      >
        <el-icon :size="20">
          <Menu />
        </el-icon>
      </el-button>

      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentRoute.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧 -->
    <div class="right">
      <!-- 项目选择 -->
      <el-dropdown trigger="click" @command="handleProjectChange">
        <el-button text>
          <el-icon><Office /></el-icon>
          {{ currentProject.name || '选择项目' }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="project in projects"
              :key="project.id"
              :command="project"
            >
              {{ project.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 刷新按钮 -->
      <el-button text @click="handleRefresh" class="refresh-btn">
        <el-icon :size="18">
          <Refresh />
        </el-icon>
      </el-button>

      <!-- 全屏按钮 -->
      <el-button text @click="toggleFullscreen" class="fullscreen-btn">
        <el-icon :size="18">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-button>

      <!-- 通知 -->
      <el-badge :value="notificationCount" class="notification-badge">
        <el-button text class="notification-btn">
          <el-icon :size="20"><Bell /></el-icon>
        </el-button>
      </el-badge>

      <!-- 用户信息 -->
      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userInfo.avatar">
            {{ userInfo.name?.charAt(0) }}
          </el-avatar>
          <span class="username">{{ userInfo.name }}</span>
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人信息
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 是否折叠
const isCollapse = computed(() => appStore.sidebarCollapsed)

// 当前路由
const currentRoute = computed(() => route)

// 当前项目
const currentProject = computed(() => appStore.currentProject)

// 模拟项目列表
const projects = ref([
  { id: 1, name: '深合广场项目' },
  { id: 2, name: '科技园区项目' },
  { id: 3, name: '商务中心项目' }
])

// 通知数量
const notificationCount = ref(5)

// 是否全屏
const isFullscreen = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  // 通过ref调用Sidebar组件的方法
  const sidebar = document.querySelector('.sidebar-container')
  if (sidebar) {
    sidebar.classList.toggle('mobile-open')
  }
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// 刷新页面
const handleRefresh = () => {
  appStore.triggerRefresh()
  window.location.reload()
}

// 切换项目
const handleProjectChange = (project) => {
  appStore.setCurrentProject(project)
}

// 用户菜单命令
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        userStore.logout()
        router.push('/login')
      })
      break
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;

  .toggle-btn,
  .mobile-toggle-btn {
    padding: 6px;
  }

  .el-breadcrumb {
    font-size: 14px;
  }
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;

  .el-button {
    padding: 6px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .username {
      font-size: 14px;
      color: #333;
    }
  }

  .notification-badge {
    margin-right: 8px;
  }
}

// 响应式
@media (max-width: 768px) {
  .navbar {
    padding: 0 10px;
  }

  .left {
    .el-breadcrumb {
      display: none;
    }
  }

  .user-info .username {
    display: none;
  }
}
</style>