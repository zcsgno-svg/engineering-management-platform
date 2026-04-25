<template>
  <div class="stats-card">
    <div class="card-icon" :class="`bg-${type}`">
      <el-icon :size="24">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="card-value">{{ value }}</div>
      <div class="card-footer">
        <span>{{ footer }}</span>
        <span v-if="trend" :class="`trend-${trend.type}`">
          <el-icon :size="12"><Trend /></el-icon>
          {{ trend.value }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  footer: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'primary'
  },
  icon: {
    type: String,
    default: 'DataLine'
  },
  trend: {
    type: Object,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.stats-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .card-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;

    &.bg-primary {
      background: #1890ff;
    }

    &.bg-success {
      background: #52c41a;
    }

    &.bg-warning {
      background: #faad14;
    }

    &.bg-danger {
      background: #f5222d;
    }

    &.bg-info {
      background: #722ed1;
    }
  }

  .card-content {
    flex: 1;

    .card-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .card-footer {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      gap: 8px;

      .trend-up {
        color: #52c41a;
      }

      .trend-down {
        color: #f5222d;
      }
    }
  }
}
</style>