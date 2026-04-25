import request from '@/utils/request'
import { mockRequest, generateMockData } from '@/utils/mock'

// 获取统计数据
export const getDashboardStats = () => {
  // 模拟数据
  return mockRequest({
    workOrderCount: {
      pending: 12,
      processing: 8,
      completed: 156
    },
    equipmentCount: {
      total: 356,
      fault: 12
    },
    alarmCount: 5,
    todayAlarms: 2
  })
}

// 获取工单趋势
export const getWorkOrderTrend = () => {
  return mockRequest(generateMockData.generateWorkOrderTrend())
}

// 获取能耗趋势
export const getEnergyTrend = () => {
  return mockRequest(generateMockData.generateEnergyData())
}

// 获取设备故障占比
export const getEquipmentFaultStats = () => {
  const data = [
    { name: '电梯', value: 35 },
    { name: '空调', value: 25 },
    { name: '配电', value: 20 },
    { name: '消防', value: 15 },
    { name: '其他', value: 5 }
  ]
  return mockRequest(data)
}