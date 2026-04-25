// 数据存储
let workOrders = [
    {id: 'WO001', title: '电梯故障维修', reporter: '张三', type: '维修', priority: '高', status: '处理中', createTime: '2024-01-15 09:00', deadline: '2024-01-15 17:00', assignee: '李师傅', phone: '13812345678', location: 'A栋1单元', description: '电梯运行异常，有异响'},
    {id: 'WO002', title: '空调系统保养', reporter: '李四', type: '保养', priority: '中', status: '待处理', createTime: '2024-01-15 10:30', deadline: '2024-01-16 12:00', assignee: '', phone: '13987654321', location: 'B栋大堂', description: '空调滤网清洗，制冷剂检查'},
    {id: 'WO003', title: '消防管道漏水', reporter: '王五', type: '维修', priority: '紧急', status: '已完成', createTime: '2024-01-14 14:20', deadline: '2024-01-14 16:00', assignee: '张师傅', phone: '13611112222', location: '地下车库', description: '消防管道接口渗水'},
    {id: 'WO004', title: '走廊照明更换', reporter: '赵六', type: '维修', priority: '低', status: '待处理', createTime: '2024-01-14 16:45', deadline: '2024-01-17 18:00', assignee: '', phone: '13533334444', location: 'C栋3层走廊', description: 'LED灯管损坏，需要更换'}
];

let warehouseStock = [
    {id: 'M001', name: '电力电缆', code: 'DL-DL-001', spec: 'BV 3×6mm²', quantity: 120, unit: '米', price: 25.50, supplier: 'XX电缆厂', batch: 'B20240101', status: 'normal'},
    {id: 'M002', name: '空气开关', code: 'DQ-KG-002', spec: '86型单开', quantity: 50, unit: '个', price: 15.00, supplier: '电器批发商', batch: 'B20240102', status: 'normal'},
    {id: 'M003', name: 'LED灯泡', code: 'DG-LED-003', spec: '220V 16W', quantity: 8, unit: '个', price: 12.00, supplier: '照明器材', batch: 'B20240103', status: 'low'},
    {id: 'M004', name: 'PPR水管', code: 'SG-PPR-004', spec: 'φ32', quantity: 200, unit: '米', price: 8.50, supplier: '建材市场', batch: 'B20240104', status: 'normal'},
    {id: 'M005', name: '电线管', code: 'DG-XG-005', spec: 'φ20', quantity: 15, unit: '根', price: 18.00, supplier: '建材市场', batch: 'B20240105', status: 'low'}
];

let energyData = [
    {date: '2024-01', electric: 8500, water: 320, gas: 150, electricCost: 6800, waterCost: 1280, gasCost: 375, totalCost: 8455},
    {date: '2024-02', electric: 8200, water: 310, gas: 140, electricCost: 6560, waterCost: 1240, gasCost: 350, totalCost: 8150},
    {date: '2024-03', electric: 7800, water: 300, gas: 130, electricCost: 6240, waterCost: 1200, gasCost: 325, totalCost: 7765},
    {date: '2024-04', electric: 7500, water: 290, gas: 120, electricCost: 6000, waterCost: 1160, gasCost: 300, totalCost: 7460}
];

// 页面切换
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // 更新活动状态
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // 切换页面
        const pageId = this.getAttribute('data-page') + '-page';
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        document.getElementById(pageId).style.display = 'block';
        document.getElementById(pageId).classList.add('fade-in');

        // 加载对应页面数据
        if (pageId === 'workorders-page') {
            loadWorkOrders();
        } else if (pageId === 'warehouse-page') {
            loadWarehouse();
        } else if (pageId === 'energy-page') {
            loadEnergyData();
        }
    });
});

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 显示当前日期
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    document.getElementById('currentDate').textContent = dateStr;

    // 加载首页数据
    loadDashboardData();
    loadRecentOrders();
});

// 加载首页数据
function loadDashboardData() {
    // 更新统计数据
    const pendingCount = workOrders.filter(o => o.status === '待处理').length;
    document.getElementById('pending-count').textContent = pendingCount;

    const warningCount = warehouseStock.filter(s => s.status === 'low').length;
    document.getElementById('stock-warning').textContent = warningCount;

    // 设备总数（模拟数据）
    document.getElementById('device-count').textContent = '156';

    // 本月能耗
    const currentMonth = energyData[energyData.length - 1];
    document.getElementById('energy-count').textContent = currentMonth.electric.toLocaleString();
}

// 加载最近工单
function loadRecentOrders() {
    const tbody = document.getElementById('recent-orders-tbody');
    tbody.innerHTML = '';

    const recentOrders = workOrders.slice(0, 5);
    recentOrders.forEach(order => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><span class="badge bg-secondary">${order.id}</span></td>
            <td>${order.title}</td>
            <td><span class="priority-badge priority-${getPriorityClass(order.priority)}">${order.priority}</span></td>
            <td><span class="status-badge status-${getStatusClass(order.status)}">${order.status}</span></td>
            <td><small>${order.createTime}</small></td>
        `;
    });
}

// 加载工单数据
function loadWorkOrders() {
    const tbody = document.getElementById('workorders-tbody');
    tbody.innerHTML = '';

    let filteredOrders = [...workOrders];

    // 应用筛选
    const searchTerm = document.getElementById('search-orders')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-status')?.value;
    const priorityFilter = document.getElementById('filter-priority')?.value;
    const dateFilter = document.getElementById('filter-date')?.value;

    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
            order.title.toLowerCase().includes(searchTerm) ||
            order.reporter.toLowerCase().includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm)
        );
    }

    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    if (priorityFilter) {
        filteredOrders = filteredOrders.filter(order => order.priority === priorityFilter);
    }

    if (dateFilter) {
        filteredOrders = filteredOrders.filter(order =>
            order.createTime.startsWith(dateFilter)
        );
    }

    // 渲染表格
    filteredOrders.forEach(order => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><span class="badge bg-secondary">${order.id}</span></td>
            <td>
                <div>
                    <strong>${order.title}</strong><br>
                    <small class="text-muted">${order.type}</small>
                </div>
            </td>
            <td>
                <div>
                    <strong>${order.reporter}</strong><br>
                    <small>${order.phone || '-'}</small>
                </div>
            </td>
            <td><span class="priority-badge priority-${getPriorityClass(order.priority)}">${order.priority}</span></td>
            <td><span class="status-badge status-${getStatusClass(order.status)}">${order.status}</span></td>
            <td><small>${order.createTime}</small></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editWorkOrder('${order.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-success me-1" onclick="changeWorkOrderStatus('${order.id}')">
                    <i class="bi bi-check-circle"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteWorkOrder('${order.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    });
}

// 加载仓库数据
function loadWarehouse() {
    const tbody = document.getElementById('warehouse-tbody');
    tbody.innerHTML = '';

    // 更新统计数据
    document.getElementById('material-count').textContent = warehouseStock.length;
    const totalQuantity = warehouseStock.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('total-quantity').textContent = totalQuantity.toLocaleString();

    const lowStockCount = warehouseStock.filter(item => item.status === 'low').length;
    document.getElementById('low-stock-count').textContent = lowStockCount;

    // 渲染表格
    warehouseStock.forEach(item => {
        const row = tbody.insertRow();
        const stockClass = item.status === 'low' ? 'stock-low' : 'stock-normal';
        const stockBadge = item.status === 'low' ? '<span class="badge bg-warning">低库存</span>' : '<span class="badge bg-success">正常</span>';

        row.innerHTML = `
            <td><code>${item.id}</code></td>
            <td>
                <div>
                    <strong>${item.name}</strong><br>
                    <small class="text-muted">${item.code}</small>
                </div>
            </td>
            <td>${item.spec}</td>
            <td><span class="${stockClass}">${item.quantity}</span></td>
            <td><small>${item.unit}</small></td>
            <td>¥${item.price.toFixed(2)}</td>
            <td>¥${(item.quantity * item.price).toFixed(2)}</td>
            <td>${stockBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStock('${item.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="addStock('${item.id}')">
                    <i class="bi bi-plus-circle"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStock('${item.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    });
}

// 加载能耗数据
function loadEnergyData() {
    // 更新能耗明细表
    const tbody = document.getElementById('energy-tbody');
    tbody.innerHTML = '';

    energyData.forEach(data => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${data.date}</td>
            <td>${data.electric.toLocaleString()}</td>
            <td>${data.water}</td>
            <td>${data.gas}</td>
            <td>¥${data.electricCost.toFixed(2)}</td>
            <td>¥${data.waterCost.toFixed(2)}</td>
            <td>¥${data.gasCost.toFixed(2)}</td>
            <td><strong>¥${data.totalCost.toFixed(2)}</strong></td>
        `;
    });

    // 绘制图表
    drawEnergyCharts();
}

// 绘制能耗图表
function drawEnergyCharts() {
    // 清除旧图表
    const chartCanvas = document.getElementById('energyChart');
    const pieCanvas = document.getElementById('energyPieChart');

    if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
    }
    if (pieCanvas.chart) {
        pieCanvas.chart.destroy();
    }

    // 月度趋势图
    const trendCtx = chartCanvas.getContext('2d');
    chartCanvas.chart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: energyData.map(d => d.date),
            datasets: [
                {
                    label: '用电量',
                    data: energyData.map(d => d.electric),
                    borderColor: 'rgb(67, 97, 238)',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '用水量',
                    data: energyData.map(d => d.water * 10), // 放大10倍显示
                    borderColor: 'rgb(6, 255, 165)',
                    backgroundColor: 'rgba(6, 255, 165, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 能耗占比饼图
    const pieCtx = pieCanvas.getContext('2d');
    const currentMonth = energyData[energyData.length - 1];
    pieCanvas.chart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['电费', '水费', '燃气费'],
            datasets: [{
                data: [
                    currentMonth.electricCost,
                    currentMonth.waterCost,
                    currentMonth.gasCost
                ],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.8)',
                    'rgba(6, 255, 165, 0.8)',
                    'rgba(255, 190, 11, 0.8)'
                ],
                borderColor: [
                    'rgba(67, 97, 238, 1)',
                    'rgba(6, 255, 165, 1)',
                    'rgba(255, 190, 11, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// 显示工单表单
function showWorkOrderForm() {
    document.getElementById('workOrderModal').querySelector('.modal-title').textContent = '新建工单';
    document.getElementById('workOrderId').value = '';
    document.getElementById('workOrderForm').reset();
    new bootstrap.Modal(document.getElementById('workOrderModal')).show();
}

// 编辑工单
function editWorkOrder(id) {
    const order = workOrders.find(o => o.id === id);
    if (order) {
        document.getElementById('workOrderModal').querySelector('.modal-title').textContent = '编辑工单';
        document.getElementById('workOrderId').value = order.id;
        document.getElementById('workOrderTitle').value = order.title;
        document.getElementById('workOrderType').value = order.type;
        document.getElementById('workOrderReporter').value = order.reporter;
        document.getElementById('workOrderPhone').value = order.phone || '';
        document.getElementById('workOrderPriority').value = order.priority;
        document.getElementById('workOrderDeadline').value = order.deadline ? order.deadline.replace(' ', 'T') : '';
        document.getElementById('workOrderAssignee').value = order.assignee || '';
        document.getElementById('workOrderDescription').value = order.description;
        document.getElementById('workOrderLocation').value = order.location || '';
        new bootstrap.Modal(document.getElementById('workOrderModal')).show();
    }
}

// 保存工单
function saveWorkOrder() {
    const id = document.getElementById('workOrderId').value;
    const formData = {
        title: document.getElementById('workOrderTitle').value,
        type: document.getElementById('workOrderType').value,
        reporter: document.getElementById('workOrderReporter').value,
        phone: document.getElementById('workOrderPhone').value,
        priority: document.getElementById('workOrderPriority').value,
        deadline: document.getElementById('workOrderDeadline').value,
        assignee: document.getElementById('workOrderAssignee').value,
        description: document.getElementById('workOrderDescription').value,
        location: document.getElementById('workOrderLocation').value
    };

    if (formData.title && formData.reporter && formData.priority && formData.description) {
        if (id) {
            // 编辑现有工单
            const index = workOrders.findIndex(o => o.id === id);
            if (index !== -1) {
                workOrders[index] = {...workOrders[index], ...formData};
            }
        } else {
            // 创建新工单
            const newId = 'WO' + String(workOrders.length + 1).padStart(3, '0');
            workOrders.unshift({
                id: newId,
                ...formData,
                status: '待处理',
                createTime: new Date().toLocaleString('zh-CN')
            });
        }

        bootstrap.Modal.getInstance(document.getElementById('workOrderModal')).hide();

        // 如果在工单页面，刷新列表
        if (document.getElementById('workorders-page').style.display !== 'none') {
            loadWorkOrders();
        } else {
            loadDashboardData();
            loadRecentOrders();
        }
    } else {
        // 显示必填项验证
        const requiredFields = ['workOrderTitle', 'workOrderReporter', 'workOrderPriority', 'workOrderDescription'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value) {
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });
    }
}

// 自动生成物料编码
function generateStockCode() {
    const code = 'M' + String(warehouseStock.length + 1).padStart(3, '0');
    document.getElementById('stockCode').value = code;
}
    } else {
        alert('请填写必填项！');
    }
}

// 更改工单状态
function changeWorkOrderStatus(id) {
    const order = workOrders.find(o => o.id === id);
    if (order) {
        const statusFlow = {
            '待处理': '处理中',
            '处理中': '已完成',
            '已完成': '待处理'
        };
        order.status = statusFlow[order.status];
        loadWorkOrders();
        loadDashboardData();
        loadRecentOrders();
    }
}

// 删除工单
function deleteWorkOrder(id) {
    if (confirm('确定要删除这个工单吗？')) {
        workOrders = workOrders.filter(o => o.id !== id);
        loadWorkOrders();
        loadDashboardData();
        loadRecentOrders();
    }
}

// 显示入库表单
function showStockForm() {
    document.getElementById('stockModal').querySelector('.modal-title').textContent = '新建入库';
    document.getElementById('stockForm').reset();
    // 自动生成物料编码
    const code = 'M' + String(warehouseStock.length + 1).padStart(3, '0');
    document.getElementById('stockCode').value = code;
    new bootstrap.Modal(document.getElementById('stockModal')).show();
}

// 编辑库存
function editStock(id) {
    const item = warehouseStock.find(i => i.id === id);
    if (item) {
        document.getElementById('stockModal').querySelector('.modal-title').textContent = '编辑库存';
        document.getElementById('stockName').value = item.name;
        document.getElementById('stockCode').value = item.code;
        document.getElementById('stockSpec').value = item.spec;
        document.getElementById('stockQuantity').value = item.quantity;
        document.getElementById('stockUnit').value = item.unit;
        document.getElementById('stockPrice').value = item.price;
        document.getElementById('stockSupplier').value = item.supplier || '';
        document.getElementById('stockBatch').value = item.batch || '';
        new bootstrap.Modal(document.getElementById('stockModal')).show();
    }
}

// 增加库存
function addStock(id) {
    const item = warehouseStock.find(i => i.id === id);
    if (item) {
        const quantity = prompt(`请输入入库数量：\n当前库存：${item.quantity} ${item.unit}`, '0');
        if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
            item.quantity += parseInt(quantity);
            loadWarehouse();
        }
    }
}

// 保存库存
function saveStock() {
    const formData = {
        name: document.getElementById('stockName').value,
        code: document.getElementById('stockCode').value,
        spec: document.getElementById('stockSpec').value,
        quantity: parseInt(document.getElementById('stockQuantity').value),
        unit: document.getElementById('stockUnit').value,
        price: parseFloat(document.getElementById('stockPrice').value),
        supplier: document.getElementById('stockSupplier').value,
        batch: document.getElementById('stockBatch').value
    };

    if (formData.name && formData.quantity && formData.unit && formData.price) {
        const id = 'M' + String(warehouseStock.length + 1).padStart(3, '0');
        warehouseStock.unshift({
            id,
            code: formData.code,
            name: formData.name,
            spec: formData.spec,
            quantity: formData.quantity,
            unit: formData.unit,
            price: formData.price,
            supplier: formData.supplier,
            batch: formData.batch,
            status: formData.quantity < 20 ? 'low' : 'normal'
        });

        bootstrap.Modal.getInstance(document.getElementById('stockModal')).hide();
        loadWarehouse();
    } else {
        alert('请填写必填项！');
    }
}

// 删除库存
function deleteStock(id) {
    if (confirm('确定要删除这个物料吗？')) {
        warehouseStock = warehouseStock.filter(i => i.id !== id);
        loadWarehouse();
    }
}

// 搜索和过滤
function filterOrders() {
    loadWorkOrders();
}

// 获取优先级样式类
function getPriorityClass(priority) {
    switch(priority) {
        case '低': return 'low';
        case '中': return 'medium';
        case '高': return 'high';
        case '紧急': return 'urgent';
        default: return 'low';
    }
}

// 获取状态样式类
function getStatusClass(status) {
    switch(status) {
        case '待处理': return 'pending';
        case '处理中': return 'processing';
        case '已完成': return 'completed';
        default: return 'pending';
    }
}