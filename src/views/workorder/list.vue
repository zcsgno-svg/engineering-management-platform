<template>
  <div class="workorder-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">工单管理</h1>
      <p class="page-desc">管理和跟踪所有设备维修和保养工单</p>
    </div>

    <!-- 工单表格组件 -->
    <WorkOrderTable />
  </div>
</template>

<script setup>
import WorkOrderTable from '@/components/workorder/WorkOrderTable.vue'
</script>

<style lang="scss" scoped>
.workorder-list {
  .page-header {
    margin-bottom: 20px;
  }
}
</style>