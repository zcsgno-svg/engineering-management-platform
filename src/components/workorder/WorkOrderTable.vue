<template>
  <div class="work-order-table">
    <!-- 工具栏 -->
    <div class="table-tool-bar">
      <div class="left">
        <el-input
          v-model="searchText"
          placeholder="搜索工单号、标题、报修人"
          prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="search-input"
        />
        <el-select v-model="statusFilter" placeholder="状态" clearable @change="handleFilter">
          <el-option label="待派单" value="待派单" />
          <el-option label="处理中" value="处理中" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已关闭" value="已关闭" />
        </el-select>
        <el-select v-model="priorityFilter" placeholder="优先级" clearable @change="handleFilter">
          <el-option label="低" value="低" />
          <el-option label="中" value="中" />
          <el-option label="高" value="高" />
          <el-option label="紧急" value="紧急" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleFilter"
        />
      </div>
      <div class="right">
        <el-button @click="refresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新建工单
        </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="filteredWorkOrders"
      v-loading="loading"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="工单号" prop="id" width="120" />
      <el-table-column label="标题" prop="title" min-width="200">
        <template #default="{ row }">
          <div class="work-order-title">
            <el-tag :type="getPriorityType(row.priority)" size="small">
              {{ row.priority }}
            </el-tag>
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" width="100" />
      <el-table-column label="报修人" prop="reporter" width="120" />
      <el-table-column label="负责人" prop="assignee" width="120">
        <template #default="{ row }">
          <span v-if="row.assignee" class="assignee">{{ row.assignee }}</span>
          <span v-else class="assignee-empty">未指派</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地点" prop="location" width="150" />
      <el-table-column label="创建时间" prop="createTime" width="160" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button
              v-if="row.status !== '已完成' && row.status !== '已关闭'"
              size="small"
              type="success"
              @click="handleComplete(row)"
            >
              完成
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 模拟数据
const workOrders = ref([
  {
    id: 'WO2024001',
    title: '电梯故障维修',
    type: '维修',
    priority: '紧急',
    status: '处理中',
    reporter: '张三',
    assignee: '李师傅',
    location: 'A栋1单元',
    createTime: '2024-01-15 09:00',
    description: '电梯运行异常，有异响'
  },
  {
    id: 'WO2024002',
    title: '空调系统保养',
    type: '保养',
    priority: '中',
    status: '待派单',
    reporter: '李四',
    assignee: null,
    location: 'B栋大堂',
    createTime: '2024-01-15 10:30',
    description: '空调滤网清洗，制冷剂检查'
  },
  {
    id: 'WO2024003',
    title: '消防管道漏水',
    type: '维修',
    priority: '高',
    status: '已完成',
    reporter: '王五',
    assignee: '张师傅',
    location: '地下车库',
    createTime: '2024-01-14 14:20',
    description: '消防管道接口渗水'
  },
  {
    id: 'WO2024004',
    title: '走廊照明更换',
    type: '维修',
    priority: '低',
    status: '待派单',
    reporter: '赵六',
    assignee: null,
    location: 'C栋3层走廊',
    createTime: '2024-01-14 16:45',
    description: 'LED灯管损坏，需要更换'
  }
])

// 加载状态
const loading = ref(false)

// 搜索和筛选
const searchText = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const dateRange = ref(null)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => workOrders.value.length)

// 选中项
const selectedRows = ref([])

// 筛选后的数据
const filteredWorkOrders = computed(() => {
  let filtered = [...workOrders.value]

  // 文本搜索
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.id.toLowerCase().includes(search) ||
      order.title.toLowerCase().includes(search) ||
      order.reporter.toLowerCase().includes(search)
    )
  }

  // 状态筛选
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // 优先级筛选
  if (priorityFilter.value) {
    filtered = filtered.filter(order => order.priority === priorityFilter.value)
  }

  // 日期筛选
  if (dateRange.value) {
    const [start, end] = dateRange.value
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createTime)
      return orderDate >= start && orderDate <= end
    })
  }

  return filtered
})

// 获取优先级标签类型
const getPriorityType = (priority) => {
  switch (priority) {
    case '紧急': return 'danger'
    case '高': return 'warning'
    case '中': return 'primary'
    case '低': return 'info'
    default: return 'info'
  }
}

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '待派单': return 'info'
    case '处理中': return 'primary'
    case '已完成': return 'success'
    case '已关闭': return 'warning'
    default: return 'info'
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 筛选
const handleFilter = () => {
  currentPage.value = 1
}

// 刷新
const refresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('刷新成功')
  }, 1000)
}

// 创建
const handleCreate = () => {
  router.push('/workorder/create')
}

// 查看
const handleView = (row) => {
  router.push(`/workorder/detail/${row.id}`)
}

// 编辑
const handleEdit = (row) => {
  router.push(`/workorder/detail/${row.id}`)
}

// 完成
const handleComplete = (row) => {
  ElMessageBox.confirm(
    '确定要将此工单标记为已完成吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = workOrders.value.findIndex(o => o.id === row.id)
    if (index !== -1) {
      workOrders.value[index].status = '已完成'
      ElMessage.success('操作成功')
    }
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除这个工单吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = workOrders.value.findIndex(o => o.id === row.id)
    if (index !== -1) {
      workOrders.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style lang="scss" scoped>
.work-order-table {
  .table-tool-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .left {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;

      .search-input {
        width: 300px;
      }
    }

    .right {
      display: flex;
      gap: 8px;
    }
  }

  .work-order-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-tag {
      flex-shrink: 0;
    }
  }

  .assignee {
    color: #666;
  }

  .assignee-empty {
    color: #999;
    font-style: italic;
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

// 响应式
@media (max-width: 768px) {
  .work-order-table {
    .table-tool-bar {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;

      .left {
        flex-direction: column;
        align-items: stretch;

        .search-input {
          width: 100%;
        }
      }

      .right {
        justify-content: center;
      }
    }

    .pagination-wrapper {
      justify-content: center;
    }
  }
}
</style>