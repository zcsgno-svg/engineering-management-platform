import request from '@/utils/request'
import { mockRequest, generateMockData } from '@/utils/mock'

// 获取工单列表
export const getWorkOrderList = (params) => {
  const { page = 1, pageSize = 10, ...searchParams } = params
  const mockData = generateMockData.generateWorkOrders(100)

  // 模拟分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockData.slice(start, end)

  return mockRequest({
    list: data,
    total: mockData.length
  })
}

// 获取工单详情
export const getWorkOrderDetail = (id) => {
  const mockData = generateMockData.generateWorkOrders(1)[0]
  mockData.id = id
  mockData.description = '详细的问题描述...处理方案...所需物料...预计时间...'
  mockData.attachments = [
    { id: 1, name: '现场照片1.jpg', url: '#' },
    { id: 2, name: '现场照片2.jpg', url: '#' }
  ]
  mockData.processRecords = [
    {
      id: 1,
      time: '2024-01-15 10:00',
      content: '接单，安排维修人员',
      operator: '管理员'
    },
    {
      id: 2,
      time: '2024-01-15 10:30',
      content: '维修人员已到达现场',
      operator: '李师傅'
    }
  ]

  return mockRequest(mockData)
}

// 创建工单
export const createWorkOrder = (data) => {
  return mockRequest({
    id: `WO${String(Date.now()).slice(-6)}`,
    ...data,
    createTime: new Date().toLocaleString('zh-CN'),
    status: '待派单'
  })
}

// 更新工单
export const updateWorkOrder = (id, data) => {
  return mockRequest({
    success: true
  })
}

// 删除工单
export const deleteWorkOrder = (id) => {
  return mockRequest({
    success: true
  })
}

// 更新工单状态
export const updateWorkOrderStatus = (id, status) => {
  return mockRequest({
    success: true
  })
}

// 获取工单统计
export const getWorkOrderStats = () => {
  return mockRequest({
    pending: 12,
    processing: 8,
    completed: 156,
    total: 176
  })
}