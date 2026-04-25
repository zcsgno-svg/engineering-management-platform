<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">首页驾驶舱</h1>
      <p class="page-desc">物业工程管理数据概览</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-section">
      <el-col :span="6">
        <div class="stat-card work-order-card">
          <div class="card-icon bg-blue">
            <Document />
          </div>
          <div class="card-title">工单统计</div>
          <div class="card-value">
            {{ stats.workOrderCount.pending }}
          </div>
          <div class="card-footer">
            待处理工单
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card equipment-card">
          <div class="card-icon bg-green">
            <Tools />
          </div>
          <div class="card-title">设备统计</div>
          <div class="card-value">
            {{ stats.equipmentCount.total }}
          </div>
          <div class="card-footer">
            设备总数
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card alarm-card">
          <div class="card-icon bg-red">
            <Warning />
          </div>
          <div class="card-title">告警统计</div>
          <div class="card-value">
            {{ stats.alarmCount }}
          </div>
          <div class="card-footer">
            今日告警
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card fault-card">
          <div class="card-icon bg-orange">
            <Tools />
          </div>
          <div class="card-title">故障设备</div>
          <div class="card-value">
            {{ stats.equipmentCount.fault }}
          </div>
          <div class="card-footer">
            需要维修
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-section">
      <!-- 工单趋势图 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h3>工单趋势</h3>
            <el-radio-group v-model="workOrderPeriod" size="small">
              <el-radio-button label="week">近7天</el-radio-button>
              <el-radio-button label="month">近30天</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-content">
            <v-chart
              :option="workOrderOption"
              autoresize
            />
          </div>
        </div>
      </el-col>

      <!-- 设备故障占比 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h3>设备故障占比</h3>
          </div>
          <div class="chart-content">
            <v-chart
              :option="equipmentFaultOption"
              autoresize
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 能耗趋势 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="24">
        <div class="chart-card">
          <div class="chart-header">
            <h3>能耗趋势</h3>
            <el-radio-group v-model="energyPeriod" size="small">
              <el-radio-button label="month">近12个月</el-radio-button>
              <el-radio-button label="year">近1年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-content" style="height: 400px;">
            <v-chart
              :option="energyOption"
              autoresize
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useDashboardStore } from '@/stores/dashboard'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const dashboardStore = useDashboardStore()

// 数据加载
const loadDashboardData = async () => {
  await dashboardStore.refreshData()
}

// 统计数据
const stats = ref(dashboardStore.stats)

// 工单趋势图数据
const workOrderPeriod = ref('week')
const workOrderTrend = ref(dashboardStore.workOrderTrend)

// 能耗趋势数据
const energyPeriod = ref('month')
const energyTrend = ref(dashboardStore.energyTrend)

// 设备故障占比
const equipmentFaultStats = ref(dashboardStore.equipmentFaultStats)

// 工单趋势图配置
const workOrderOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['创建工单', '完成工单']
  },
  xAxis: {
    type: 'category',
    data: workOrderTrend.value.map(item => item.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '创建工单',
      type: 'line',
      data: workOrderTrend.value.map(item => item.created),
      smooth: true,
      itemStyle: {
        color: '#1890ff'
      }
    },
    {
      name: '完成工单',
      type: 'line',
      data: workOrderTrend.value.map(item => item.completed),
      smooth: true,
      itemStyle: {
        color: '#52c41a'
      }
    }
  ]
})

// 设备故障占比图配置
const equipmentFaultOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '故障类型',
      type: 'pie',
      radius: '50%',
      data: equipmentFaultStats.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

// 能耗趋势图配置
const energyOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['用电量', '用水量', '燃气量']
  },
  xAxis: {
    type: 'category',
    data: energyTrend.value.map(item => item.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '用电量',
      type: 'bar',
      data: energyTrend.value.map(item => item.electric),
      itemStyle: {
        color: '#1890ff'
      }
    },
    {
      name: '用水量',
      type: 'bar',
      data: energyTrend.value.map(item => item.water * 10), // 放大10倍显示
      itemStyle: {
        color: '#52c41a'
      }
    },
    {
      name: '燃气量',
      type: 'bar',
      data: energyTrend.value.map(item => item.gas * 5), // 放大5倍显示
      itemStyle: {
        color: '#faad14'
      }
    }
  ]
})

// 监听数据变化
watch(() => dashboardStore.stats, (newStats) => {
  stats.value = newStats
})

watch(() => dashboardStore.workOrderTrend, (newTrend) => {
  workOrderTrend.value = newTrend
  updateWorkOrderChart()
})

watch(() => dashboardStore.equipmentFaultStats, (newStats) => {
  equipmentFaultStats.value = newStats
  updateEquipmentFaultChart()
})

watch(() => dashboardStore.energyTrend, (newTrend) => {
  energyTrend.value = newTrend
  updateEnergyChart()
})

// 更新图表
const updateWorkOrderChart = () => {
  workOrderOption.value = {
    ...workOrderOption.value,
    xAxis: {
      ...workOrderOption.value.xAxis,
      data: workOrderTrend.value.map(item => item.date)
    },
    series: [
      {
        ...workOrderOption.value.series[0],
        data: workOrderTrend.value.map(item => item.created)
      },
      {
        ...workOrderOption.value.series[1],
        data: workOrderTrend.value.map(item => item.completed)
      }
    ]
  }
}

const updateEquipmentFaultChart = () => {
  equipmentFaultOption.value = {
    ...equipmentFaultOption.value,
    series: [
      {
        ...equipmentFaultOption.value.series[0],
        data: equipmentFaultStats.value
      }
    ]
  }
}

const updateEnergyChart = () => {
  energyOption.value = {
    ...energyOption.value,
    xAxis: {
      ...energyOption.value.xAxis,
      data: energyTrend.value.map(item => item.date)
    },
    series: [
      {
        ...energyOption.value.series[0],
        data: energyTrend.value.map(item => item.electric)
      },
      {
        ...energyOption.value.series[1],
        data: energyTrend.value.map(item => item.water * 10)
      },
      {
        ...energyOption.value.series[2],
        data: energyTrend.value.map(item => item.gas * 5)
      }
    ]
  }
}

// 定时刷新
let refreshTimer = null

const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    dashboardStore.refreshData()
  }, 60000) // 每分钟刷新一次
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(() => {
  loadDashboardData()
  startAutoRefresh()
})

// 组件卸载时清除定时器
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  stopAutoRefresh()
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 0;
}

.page-header {
  margin-bottom: 20px;
}

.stats-section {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 12px;
    color: white;

    &.bg-blue {
      background: #1890ff;
    }

    &.bg-green {
      background: #52c41a;
    }

    &.bg-red {
      background: #f5222d;
    }

    &.bg-orange {
      background: #fa8c16;
    }
  }

  .card-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .card-footer {
    font-size: 12px;
    color: #999;
  }
}

.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .chart-content {
    height: 300px;
  }
}

// 响应式
@media (max-width: 768px) {
  .stats-section .el-col {
    margin-bottom: 10px;
  }

  .chart-card .chart-content {
    height: 200px;
  }
}
</style>