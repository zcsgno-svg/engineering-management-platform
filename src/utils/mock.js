// 模拟数据生成器
export const generateMockData = {
  // 生成随机数
  random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  // 生成随机日期
  randomDate: (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  },

  // 生成随机字符串
  randomString: (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // 生成模拟工单数据
  generateWorkOrders: (count = 10) => {
    const statuses = ['待派单', '处理中', '已完成', '已关闭']
    const priorities = ['低', '中', '高', '紧急']
    const types = ['维修', '保养', '巡检', '其他']
    const titles = [
      '电梯故障维修',
      '空调系统保养',
      '消防管道检查',
      '照明设备更换',
      '门禁系统故障',
      '漏水维修',
      '供电异常',
      '网络故障',
      '设备清洁',
      '安全检查'
    ]
    const reporters = ['张三', '李四', '王五', '赵六', '孙七']
    const buildings = ['A栋', 'B栋', 'C栋', 'D栋', 'E栋']

    const orders = []
    for (let i = 0; i < count; i++) {
      const status = statuses[this.random(0, 3)]
      const priority = priorities[this.random(0, 3)]
      const createTime = this.randomDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      )

      orders.push({
        id: `WO${String(i + 1).padStart(4, '0')}`,
        title: titles[this.random(0, titles.length - 1)],
        type: types[this.random(0, 3)],
        priority: priority,
        status: status,
        reporter: reporters[this.random(0, 4)],
        reportTime: createTime.toISOString(),
        assignee: status === '待派单' ? '' : ['李师傅', '张师傅', '王工'][this.random(0, 2)],
        location: `${buildings[this.random(0, 4)]}${this.random(1, 20)}层`,
        description: '问题描述详情...',
        images: [],
        createTime: createTime.toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      })
    }
    return orders
  },

  // 生成模拟设备数据
  generateEquipment: (count = 50) => {
    const types = ['电梯', '空调', '配电', '消防', '给排水', '安防', '门禁']
    const statuses = ['运行正常', '故障维修', '停机维护', '待报废']
    const buildings = ['A栋', 'B栋', 'C栋', 'D栋', 'E栋']

    const equipment = []
    for (let i = 0; i < count; i++) {
      const type = types[this.random(0, types.length - 1)]
      const status = statuses[this.random(0, 3)]

      equipment.push({
        id: `EQ${String(i + 1).padStart(4, '0')}`,
        name: `${type}-${this.randomString(4)}`,
        type: type,
        model: `Model-${this.randomString(6)}`,
        serialNo: `SN${this.randomString(8)}`,
        location: `${buildings[this.random(0, 4)]}${this.random(1, 20)}`,
        status: status,
        installDate: this.randomDate(new Date(2020, 0, 1), new Date()).toLocaleDateString('zh-CN'),
        lastMaintenance: this.randomDate(new Date(Date.now() - 365 * 2 * 24 * 60 * 60 * 1000), new Date()).toLocaleDateString('zh-CN'),
        nextMaintenance: this.randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)).toLocaleDateString('zh-CN'),
        manufacturer: `制造商${i + 1}`,
        warrantyPeriod: `${this.random(1, 5)}年`,
        remarks: '设备备注信息'
      })
    }
    return equipment
  },

  // 生成能耗数据
  generateEnergyData: (months = 12) => {
    const data = []
    const now = new Date()

    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const electric = this.random(7000, 10000)
      const water = this.random(250, 400)
      const gas = this.random(100, 200)

      data.unshift({
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        electric: electric,
        water: water,
        gas: gas,
        electricCost: electric * 0.8,
        waterCost: water * 4,
        gasCost: gas * 2.5,
        totalCost: electric * 0.8 + water * 4 + gas * 2.5
      })
    }
    return data
  },

  // 生成工单趋势数据
  generateWorkOrderTrend: (days = 30) => {
    const data = []
    const now = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      data.unshift({
        date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        created: this.random(5, 20),
        completed: this.random(3, 15)
      })
    }
    return data
  }
}

// 模拟API响应延迟
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API请求
export const mockRequest = (data, delayTime = 300) => {
  return delay(delayTime).then(() => ({
    code: 200,
    message: 'success',
    data: data
  }))
}