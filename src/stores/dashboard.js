import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDashboardStats, getWorkOrderTrend, getEnergyTrend, getEquipmentFaultStats } from '@/api/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // 统计数据
  const stats = ref({
    workOrderCount: { pending: 0, processing: 0, completed: 0 },
    equipmentCount: { total: 0, fault: 0 },
    alarmCount: 0,
    todayAlarms: 0
  })

  // 工单趋势
  const workOrderTrend = ref([])

  // 能耗趋势
  const energyTrend = ref([])

  // 设备故障占比
  const equipmentFaultStats = ref([])

  // 加载统计数据
  const loadStats = async () => {
    try {
      const res = await getDashboardStats()
      stats.value = res.data
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  // 加载工单趋势
  const loadWorkOrderTrend = async () => {
    try {
      const res = await getWorkOrderTrend()
      workOrderTrend.value = res.data
    } catch (error) {
      console.error('加载工单趋势失败:', error)
    }
  }

  // 加载能耗趋势
  const loadEnergyTrend = async () => {
    try {
      const res = await getEnergyTrend()
      energyTrend.value = res.data
    } catch (error) {
      console.error('加载能耗趋势失败:', error)
    }
  }

  // 加载设备故障统计
  const loadEquipmentFaultStats = async () => {
    try {
      const res = await getEquipmentFaultStats()
      equipmentFaultStats.value = res.data
    } catch (error) {
      console.error('加载设备故障统计失败:', error)
    }
  }

  // 刷新所有数据
  const refreshData = async () => {
    await Promise.all([
      loadStats(),
      loadWorkOrderTrend(),
      loadEnergyTrend(),
      loadEquipmentFaultStats()
    ])
  }

  return {
    stats,
    workOrderTrend,
    energyTrend,
    equipmentFaultStats,
    loadStats,
    loadWorkOrderTrend,
    loadEnergyTrend,
    loadEquipmentFaultStats,
    refreshData
  }
})