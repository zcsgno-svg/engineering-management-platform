import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)

  // 当前项目
  const currentProject = ref(JSON.parse(localStorage.getItem('currentProject') || '{}'))

  // 刷新标志
  const refreshFlag = ref(false)

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置当前项目
  const setCurrentProject = (project) => {
    currentProject.value = project
    localStorage.setItem('currentProject', JSON.stringify(project))
  }

  // 触发刷新
  const triggerRefresh = () => {
    refreshFlag.value = !refreshFlag.value
  }

  return {
    sidebarCollapsed,
    currentProject,
    refreshFlag,
    toggleSidebar,
    setCurrentProject,
    triggerRefresh
  }
})