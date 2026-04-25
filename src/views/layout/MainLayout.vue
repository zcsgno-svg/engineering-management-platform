<template>
  <div class="main-layout">
    <!-- 侧边栏 -->
    <Sidebar ref="sidebarRef" />

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <Navbar />

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'

const sidebarRef = ref(null)
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
}

// 隐藏滚动条但保持滚动功能
.content-wrapper::-webkit-scrollbar {
  display: none;
}

.content-wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>